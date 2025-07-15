import express from 'express';
import * as companyController from './service/company.js';
// import { validation } from '../../middlewares/validation.js';
// import * as validators from './company.validation.js'
import { allowedExtensions, Fileupload } from '../../utilits/newFeatures/multerCloud.js';
import { author } from '../../middlewares/auth.js';
const router = express.Router();
//Create lal Admin Bas
router.post('/create',author,Fileupload(allowedExtensions.Image).fields([{ name: 'photo', maxCount: 5 }, { name: 'logo', maxCount: 1 }])
, companyController.createCompany);
router.patch('/:id/login', companyController.loginByType);
router.patch('/:id/logout', companyController.logoutByType);
router.get('/:id/active-users', companyController.getActiveUsersByType); // /:id/active-users?type=mobile
router.get('/companies', companyController.getAllCompanies);
router.get('/active-users/:deviceType', companyController.getActiveUsersByDevice);


export default router;
