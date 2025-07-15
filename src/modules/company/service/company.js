import { asyncHandler } from '../../../utilits/globalerror.js';
import {CompanyModel} from '../../../../DB/Models/company.js';
//api /company
export const createCompany = asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied: Admins only' });
  }
    const company = await CompanyModel.create(req.body);
    res.status(201).json({ message: 'Company created', company });
  });
  
  export const loginByType = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { type } = req.query;
  
    const company = await CompanyModel.findById(id);
    if (!company || !company.users[type]) {
      return res.status(400).json({ message: 'Invalid company or type' });
    }
  
    company.users[type] += 1;
    await company.save();
  
    res.json({ message: `User logged in (${type})`, currentUsers: company.users });
  });
  
  export const logoutByType = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { type } = req.query;
  
    const company = await CompanyModel.findById(id);
    if (!company || !company.users[type]) {
      return res.status(400).json({ message: 'Invalid company or type' });
    }
  
    company.users[type] = Math.max(0, company.users[type] - 1);
    await company.save();
  
    res.json({ message: `User logged out (${type})`, currentUsers: company.users });
  });
  
  export const getAllCompanies = asyncHandler(async (req, res) => {
    const companies = await CompanyModel.find();
    res.json({ message: 'All companies', companies });
  });

export const getActiveUsersByType = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { type } = req.query;

  const company = await CompanyModel.findById(id);
  if (!company) return res.status(404).json({ message: 'Company not found' });

  const activeUsers = company.activeUsers.filter(u => u.type === type && u.isActiveNow);
  res.json({ type, count: activeUsers.length, users: activeUsers });
});

export const getActiveUsersByDevice = asyncHandler(async (req, res) => {
    const { deviceType } = req.params;
  
    if (!['browser', 'mobile', 'office', 'backend'].includes(deviceType)) {
      return res.status(400).json({ message: 'Invalid device type' });
    }
  
    const users = await userModel.find({
      isLoggin: 'Online',
      loginDevice: deviceType
    });
  
    res.status(200).json({ count: users.length, users });
  });
  