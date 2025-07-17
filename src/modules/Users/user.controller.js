import { userModel } from '../../../DB/Models/user.model.js'
import bcrypt from 'bcryptjs'; // بدل bcrypt العادية
import asyncHandler from 'express-async-handler'
import jwt from 'jsonwebtoken'
import { userRoles } from '../../middlewares/auth.js'
import { sendEmail } from '../../utilits/sendEmails.js'
import { emailEmitter } from '../../utilits/events/emailEvent.js'
import { customAlphabet, nanoid } from 'nanoid';
import { detectLoginDevice } from '../../utilits/detectDash.js'
import CryptoJS from 'crypto-js';




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

    const { username, email, password, gender ,phone} = req.body

    // email check
    const isUserExists = await userModel.findOne({ email })
    if (isUserExists) {
      return res.status(400).json({ message: 'Email is already exists' })
    }
    const hashedPassword = bcrypt.hashSync(password, parseInt(process.env.SALT));
    const encryptPhone = CryptoJS.AES.encrypt(phone, process.env.PHONE_ENCRYPT).toString();

    // confirmEmail
    emailEmitter.emit("sendEmail", email)

    const user = new userModel({
      username,
      email,
      password: hashedPassword,
      gender,
      phone:encryptPhone
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
    console.log(req.user);

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
  const { email, phone } = req.body;

  if (!email && !phone) {
    return res.status(400).json({ message: "email or phone is required" });
  }

  const nanoId = customAlphabet('123456789', 4);
  const code = nanoId();
  let user;

  if (email) {
    user = await userModel.findOne({ email: email.toLowerCase() });
    if (!user) return next(new Error('Invalid email', { cause: 404 }));

    await userModel.findOneAndUpdate(
      { email: email.toLowerCase() },
      { forgetCode: code, codeVerified: false }
    );

    const html = `
      <div style="font-family: Arial, sans-serif; padding: 10px;">
        <h2>🔐 Your OTP Code</h2>
        <p>Use this code to reset your password:</p>
        <h1 style="color: #4CAF50;">${code}</h1>
        <p>This code will expire soon.</p>
      </div>
    `;

    try {
      const isSent = await sendEmail({
        to: email,
        subject: "EasyClinic - Your Verification Code",
        html,
      });

      if (isSent) {
        return res.status(200).json({ message: "Code sent to your email" });
      } else {
        return res.status(500).json({ message: "Failed to send email" });
      }
    } catch (err) {
      return next(new Error("Email service failed", { cause: 500 }));
    }

  } else if (phone) {
    const encryptedPhone = CryptoJS.AES.encrypt(phone, process.env.PHONE_ENCRYPT).toString();
    user = await userModel.findOne({ phone: encryptedPhone });

    if (!user) return next(new Error('Invalid phone number', { cause: 404 }));

    user.forgetCode = code;
    user.codeVerified = false;
    await user.save();

    // هنا المفروض ترسل SMS بالـ code لو عندك خدمة SMS API
    return res.status(200).json({ message: "OTP sent to your phone" });
  }
});



export const verifyCode = asyncHandler(async (req, res, next) => {
  const { email, phone, forgetCode } = req.body;

  if ((!email && !phone) || !forgetCode) {
    return res.status(400).json({ message: "Email or phone and forgetCode are required" });
  }

  let user;

  if (email) {
    user = await userModel.findOne({ email: email.toLowerCase() });
  } else if (phone) {
    const encryptedPhone = CryptoJS.AES.encrypt(phone, process.env.PHONE_ENCRYPT).toString();
    user = await userModel.findOne({ phone: encryptedPhone });
  }

  if (!user) return next(new Error("Account not found", { cause: 404 }));

  if (user.forgetCode != parseInt(forgetCode)) {
    return next(new Error("Invalid code", { cause: 400 }));
  }

  user.codeVerified = true;
  await user.save();

  // هنا بنولّد توكن خاص بنسيان الباسورد
  const token = jwt.sign(
    { id: user._id }, // لازم id علشان author يشتغل
    process.env.FORGET_TOKEN_SECRET,
    { expiresIn: "15m" }
  );

  return res.status(200).json({
    message: "Code verified successfully",
    token
  });
});




export const forgetPassword = asyncHandler(async (req, res, next) => {
  const { password, cPassword } = req.body;
  const user = await userModel.findById(req.userId);

  if (!user) {
    return next(new Error('User not found', { cause: 404 }));
  }

  if (!user.codeVerified) {
    return next(new Error('Code not verified', { cause: 401 }));
  }

  user.password = bcrypt.hashSync(password, parseInt(process.env.SALT));
  user.forgetCode = null;
  user.codeVerified = false;
  user.changePasswordTime = Date.now();

  await user.save();

  return res.status(200).json({ message: "Password changed successfully" });
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


// export const verifyOTP=asyncHandler(async(req,res,next)=>{
//   const{email}=req.body

 
//     const findEmail=await userModel.findOne({email:email.toLowerCase()})
//     if(findEmail)
//     return next(new Error({message:"Hello It's not found Here this email"}));

//     //generate OTP
//     const otp=RandomString.generate=({})
  
// })