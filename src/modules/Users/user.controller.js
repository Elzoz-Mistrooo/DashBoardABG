import { userModel } from '../../../DB/Models/user.model.js'
import bcrypt from 'bcryptjs'; // بدل bcrypt العادية
import asyncHandler from 'express-async-handler'
import jwt from 'jsonwebtoken'
import { userRoles } from '../../middlewares/auth.js'
import { sendEmail } from '../../utilits/sendEmails.js'
import { emailEmitter } from '../../utilits/events/emailEvent.js'
import { customAlphabet, nanoid } from 'nanoid';
import { detectLoginDevice } from '../../utilits/detectDash.js'

//==================================== SignUp ===========================
export const getusers = asyncHandler(async (req, res, next) => {
  const users = await userModel.find(); // دي بترجع كل المستخدمين
  res.json({ message: "Done", users })
})

export const SignUpAdmin = asyncHandler(async (req, res, next) => {
  const { username, email, password, gender } = req.body;

  // Check if email exists
  const isUserExists = await userModel.findOne({ email });
  if (isUserExists) {
    return res.status(400).json({ message: "Email is already exists" });
  }

  // Hash password
  emailEmitter.emit("sendEmail", email)
  const hashedPassword = bcrypt.hashSync(password, parseInt(process.env.SALT_ROUNDS));

  // Create admin user
  const admin = new userModel({
    username,
    email,
    password: hashedPassword,
    gender,
    role: "admin", // <<< role is enforced
  });

  await admin.save();

  res.status(201).json({ message: "Admin account created successfully" });
});

  export const SignUp = asyncHandler(async (req, res, next) => {
    // const { test } = req.query

    const { username, email, password, gender } = req.body

    // email check
    const isUserExists = await userModel.findOne({ email })
    if (isUserExists) {
      return res.status(400).json({ message: 'Email is already exists' })
    }

    // confirmEmail
    emailEmitter.emit("sendEmail", email)
    const hashedPassword = bcrypt.hashSync(password, parseInt(process.env.SALT));

    const user = new userModel({
      username,
      email,
      password: hashedPassword,
      gender,
    })



    await user.save()
    res.status(201).json({
      message: `Done, ${user.email} has been created`
    });
  })

//================================== Confirm email =====================


//================================== signIn ============================
export const SignIn = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email, isConfirmed: true });

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }
  const userAgent = req.headers['user-agent'];
  const loginDevice = detectLoginDevice(userAgent);
  const token = jwt.sign(
    {
      id: user._id,
      role: user.role,
      isConfirmed: true,
      isLoggin: 'Online',
      loginDevice
    },
    user.role === userRoles.admin ? process.env.ADMIN_SIGNATURE : process.env.USER_SIGNATURE,
    { expiresIn: '1h' }
  );

  user.token = token;
  user.isLoggin = 'Online';
  user.loginDevice = loginDevice;
  await user.save();

  res.status(200).json({ message: 'Login successful', token });
});

export const Getprofile = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;

  const getprofile = await userModel.findById(userId).select("-password -role -confirmEmail -forgetCode -isAdmin -__v  -updatedAt")
  if (!getprofile) {
    return next(new Error("No profile found"));
  }

  // getprofile.image = getprofile.image?.secure_url;
  return res.json({ message: "Done", getprofile });
});

export const confirmEmail = asyncHandler(async (req, res, next) => {
  const { token } = req.params;
  let email;
  try {
    const decoded = jwt.verify(token, "SecretEasyClinc");
    email = decoded.email;
  } catch (err) {
    return next(new Error("Invalid or expired token", { cause: 400 }));
  }

  if (!email) {
    return next(new Error("Invalid email in token", { cause: 400 }));
  }

  const user = await userModel.updateOne(
    { email },
    { isConfirmed: true }
  );

  if (user.matchedCount) {
    res.status(200).json({ message: 'Email confirmed. Please log in.', user });
  } else {
    res.status(404).json({ message: "Account not found or already confirmed." });
  }
});
// 
export const sendCode = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const nanoId = customAlphabet('123456789', 4);

  let user = await userModel.findOne({ email: email.toLowerCase() });
  if (!user) {
    return next(new Error('Invalid email', { cause: 404 }));
  }

  user = await userModel.findOneAndUpdate(
    { email: email.toLowerCase() },
    { forgetCode: nanoId() },
    { new: true }
  );

  const html = `<!DOCTYPE html>
  <html>
  <head>
      <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
  </head>
  <style type="text/css">
      body { background-color: #88BDBF; margin: 0px; }
  </style>
  <body>
      <table border="0" width="50%" style="margin:auto;padding:30px;background-color:#F3F3F3;border:1px solid #630E2B;">
          <tr>
              <td>
                  <table border="0" width="100%">
                      <tr>
                          <td>
                              <h1><img width="100px" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670702280/Group_35052_icaysu.png"/></h1>
                          </td>
                          <td>
                              <p style="text-align: right;"><a href="http://localhost:4200/#/" target="_blank" style="text-decoration: none;">View In Website</a></p>
                          </td>
                      </tr>
                  </table>
              </td>
          </tr>
          <tr>
              <td>
                  <table border="0" style="text-align:center;width:100%;background-color:#fff;">
                      <tr>
                          <td style="background-color:#630E2B;height:100px;font-size:50px;color:#fff;">
                              <img width="50px" height="50px" src="${process.env.logo}">
                          </td>
                      </tr>
                      <tr>
                          <td><h1 style="padding-top:25px; color:#630E2B">Reset password</h1></td>
                      </tr>
                      <tr>
                          <td>
                              <p style="margin:10px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:#630E2B;">${user.forgetCode}</p>
                          </td>
                      </tr>
                  </table>
              </td>
          </tr>
      </table>
  </body>
  </html>`;

  if (!(await sendEmail({ to: email, subject: 'Forget Password', html }))) {
    return next(new Error({ message: "Email Rejected" }));
  }

  return res.status(200).json({ message: "Done" });
});

export const forgetPassword = asyncHandler(async (req, res, next) => {
  const { email, forgetCode, password, cPassword } = req.body;

  let user = await userModel.findOne({ email: email.toLowerCase() });

  if (!user) {
    return next(new Error('Not registered account', { cause: 404 }));
  }

  if (user.forgetCode != parseInt(forgetCode)) {
    return next(new Error('Invalid code', { cause: 400 }));
  }

  user.password = bcrypt.hashSync(password, parseInt(process.env.SALT))
  user.forgetCode = null;
  user.changePasswordTime = Date.now();

  await user.save();

  return res.status(200).json({ message: "Done" });
});

export const logout = asyncHandler(async (req, res) => {
  await userModel.updateOne(
    { _id: req.user._id },
    {
      $unset: { token: "" },
      $set: { isLoggin: 'Offline', loginDevice: null }
    }
  );

  res.status(200).json({ message: 'Logged out successfully' });
});
export const newConfirmEmail = asyncHandler(async (req, res, next) => {
  const { token } = req.params;
  let email;

  try {
    const decoded = jwt.verify(token, "SecretEasyClinc");
    email = decoded.email;
  } catch (err) {
    return next(new Error("Invalid or expired refresh token", { cause: 400 }));
  }

  if (!email) {
    return next(new Error("Invalid email in token", { cause: 400 }));
  }

  const user = await userModel.updateOne(
    { email, isConfirmed: false }, // تأكد انه مش مفعل بالفعل
    { isConfirmed: true }
  );

  if (user.matchedCount) {
    res.status(200).json({ message: 'Email re-confirmed successfully. You can now log in.' });
  } else {
    res.status(404).json({ message: "Account not found or already confirmed." });
  }
});



// لو في حاله محلصش confirm Email
export const resendConfirmationEmail = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new Error("Email is required", { cause: 400 }));
  }

  const user = await userModel.findOne({ email: email.toLowerCase() });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (user.isConfirmed) {
    return res.status(400).json({ message: "Email already confirmed" });
  }

  // Trigger re-send confirmation email using your EventEmitter
  emailEmitter.emit("sendEmail", email);

  return res.status(200).json({ message: "Confirmation email resent successfully" });
});


// export const AddProfilePicture = asyncHandler(async (req, res, next) => {
//   if (!req.file) {
//     return res.status(400).json({ success: false, message: "No image uploaded" });
//   }

//   const user = await userModel.findByIdAndUpdate(
//     req.user._id,
//     { profileImage: req.file.path },
//     { new: true }
//   );

//   res.status(201).json({ success: true, message: "Profile image updated", result: user });
// });


// export const CoverImages=asyncHandler(async(req,res,next)=>{
// const user=await userModel.findById(req.user._id)
// user.coverImages=req.files.map((file)=>file.path)
// await user.save();
// return res.status(201).json({success:true,result:{files:req.files}})
// })