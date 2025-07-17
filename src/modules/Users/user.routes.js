import { Router } from "express";
import * as authController from './user.controller.js'
import {author,authAccessRole} from '../../middlewares/auth.js'
import { endpoint } from "./user.endpoint.js";
import { validation } from "../../middlewares/validation.js";
import * as validators from './user.validationSchemas.js'
// import {  allowedExtensions, upload } from '../../utilits/newFeatures/multer.js'
const router = Router();



// router.post("/verifyOTP",validation)
// router.post(
//     "/Uploadimage",
//     author,
//     upload(allowedExtensions.Images).single("image"),
//     authController.AddProfilePicture
//   );
// router.post(
//     "/CoverImages",
//     author,
//     upload(allowedExtensions.Images).array("images"),
//     authController.CoverImages
//   );
  //low 3ez a3ml post la PDF/VIodes brdk
// router.post(
//     "/Fields",
//     author,
//     upload().fields([
//{name:(nameEly3EZO),maxcount:1-9}
//{name:(nameEly3EZO),maxcount:1-9}
// ]),
//(req,res)=>{return res.json({files:req.files})}
//     authController.CoverImages
//   );

router.get("/users",author('admin'), authAccessRole('admin'),authController.getusers)
router.post("/Signup",validation(validators.Signup) ,authController.SignUp)
router.post("/Login", validation(validators.login), authController.SignIn)

router.patch("/sendCode", validation(validators.sendCode), authController.sendCode)
router.post("/verifyCode", validation(validators.verifyCode), authController.verifyCode); // ✅ جديد
router.patch("/forgetPassword", author("forget"), authController.forgetPassword);
// router.get("/adminDashboard", author("admin"), authAccessRole(["admin"]), adminDashboard);
// router.get("/userProfile", author("user"), userProfile);

router.get("/userprofile", author, authAccessRole('user'), authController.getProfileData);
// router.get("/adminprofile", author, authAccessRole('admin'), authController.GetAdminData);
router.post("/adminCreate", authController.SignUpAdmin);
router.get("/confirmEmail/:token", authController.confirmEmail);
router.get("/newConfirmEmail/:token", authController.newConfirmEmail);
router.post('/logout', author,authController.logout);
router.post("/resend-confirmation-email", authController.resendConfirmationEmail);





export default router