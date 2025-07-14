import express from 'express';
import * as companyController from './service/company.js';

const router = express.Router();
//Create lal Admin Bas
router.post('/create', companyController.createCompany);
router.patch('/:id/login', companyController.loginByType);
router.patch('/:id/logout', companyController.logoutByType);
router.get('/:id/active-users', companyController.getActiveUsersByType); // /:id/active-users?type=mobile
router.get('/', companyController.getAllCompanies);
router.get('/active-users/:deviceType', companyController.getActiveUsersByDevice);


export default router;
