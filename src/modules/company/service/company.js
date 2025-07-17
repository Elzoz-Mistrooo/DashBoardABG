import { asyncHandler } from '../../../utilits/globalerror.js';
import {CompanyModel} from '../../../../DB/Models/company.js';
import { userModel } from '../../../../DB/Models/user.model.js';
//api /company
export const createCompany = asyncHandler(async (req, res) => {
  // تحقق من صلاحية الأدمن

  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied: Admins only' });
  }

  // استخرج روابط الصور من الملفات المرفوعة (إن وُجدت)
  const photo = req.files?.photo?.[0]?.path || '';
  const logo = req.files?.logo?.[0]?.path || '';

  // إنشاء الشركة ببيانات النموذج والصور
  const company = await CompanyModel.create({
    ...req.body,
    photo,
    logo,
  });

  // الرد بالنجاح
  return res.status(201).json({
    success: true,
    message: 'Company has been created successfully',
    company,
  });
});

  
export const loginByType = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { type } = req.query;

  const company = await CompanyModel.findById(id);
  
  if (!company || !company.users || !company.users.hasOwnProperty(type)) {
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

  if (!company || !company.users || !company.users.hasOwnProperty(type)) {
    return res.status(400).json({ message: 'Invalid company or type' });
  }

  if (company.users[type] > 0) {
    company.users[type] -= 1;
    await company.save();
  }

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
    if (!company || !company.users || typeof company.users[type] !== 'number') {
      return res.status(400).json({ message: 'Invalid company or type' });
    }
  
    const count = company.users[type];
  
    res.json({
      type,
      count,
      users: Array(count).fill({ type, isActiveNow: true }) // just dummy user objects
    });
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
  