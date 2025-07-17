import express from 'express';
import * as companyController from './service/company.js';
// import { validation } from '../../middlewares/validation.js';
// import * as validators from './company.validation.js'
import { allowedExtensions, Fileupload } from '../../utilits/newFeatures/multerCloud.js';
import { authAccessRole, author } from '../../middlewares/auth.js';
// import { endpoint } from './company.endpoint.js';
const protectAdmin = [author('admin'), authAccessRole('admin')];


const router = express.Router();
//Create lal Admin Bas
router.post(
    '/create',
    ...protectAdmin,
    Fileupload(allowedExtensions.Image).fields([
      { name: 'photo', maxCount: 5 },
      { name: 'logo', maxCount: 1 }
    ]),
    companyController.createCompany
  );
router.patch('/:id/login', companyController.loginByType);

// تسجيل خروج بحسب نوع الجهاز
router.patch('/:id/logout',  companyController.logoutByType);

// جلب المستخدمين النشطين بحسب نوع الجهاز
router.get('/:id/active-users',  companyController.getActiveUsersByType);

// جلب كل الشركات
router.get('/companies',  companyController.getAllCompanies);

// جلب المستخدمين النشطين لكل الأجهزة
router.get('/active-users/:deviceType',  companyController.getActiveUsersByDevice);


export default router;
