import { Router } from "express";
import * as authController from './user.controller.js'
import {author,authAccessRole} from '../../middlewares/auth.js'
import { endpoint } from "./user.endpoint.js";
import { validation } from "../../middlewares/validation.js";
import * as validators from './user.validationSchemas.js'
// import {  allowedExtensions, upload } from '../../utilits/newFeatures/multer.js'
const router = Router();




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

router.get("/users",authController.getusers)
router.post("/Signup",validation(validators.Signup) ,authController.SignUp)
router.post("/Login", validation(validators.login), authController.SignIn)
router.patch("/sendCode", validation(validators.sendCode), authController.sendCode)
router.patch("/forgetpassword", validation(validators.forgetpassword), authController.forgetPassword)
router.get("/userprofile",author,authAccessRole(endpoint),authController.Getprofile)
router.post("admin/signup", authController.SignUpAdmin);
router.get("/confirmEmail/:token", authController.confirmEmail);
router.get("/newConfirmEmail/:token", authController.newConfirmEmail);
router.post('/logout', author,authController.logout);
router.post("/resend-confirmation-email", authController.resendConfirmationEmail);





export default router