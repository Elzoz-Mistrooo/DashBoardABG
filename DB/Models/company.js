import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
  name: { type: String, required: true },
  link: String,
  photo: String,
  logo: String,
  apiLink: String,
  users: {
    browser: { type: Number, default: 0 },
    mobile: { type: Number, default: 0 },
    office: { type: Number, default: 0 },
    backend: { type: Number, default: 0 },
  },
}, { timestamps: true });

export const CompanyModel = mongoose.model('Company', companySchema);
