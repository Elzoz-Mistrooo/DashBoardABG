import mongoose, { Schema } from 'mongoose';
import { userRoles } from '../../src/middlewares/auth.js'

const userSchema = new Schema({
  username: { type: String, required: true, lowercase: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  gender: { type: String, enum: ['female', 'male', 'not specified'], default: 'not specified' },
  isConfirmed: { type: Boolean, default: false },
  isLoggin: {
    type: String,
    enum: ["Online", "Offline"],
    default: "Offline"
  },
  loginDevice: {
    type: String,
    enum: ['browser', 'mobile', 'office', 'backend', null],
    default: null,
  },
    role: { type: String, enum: Object.values(userRoles), default: userRoles.user },
  forgetCode: { type: Number, default: null },
  changePasswordTime: { type: Date },
  phone: { type: String },
  adress: { type: String },
 profileImage: {type:String},
  DOB: String,
 
  token: String,
}, { timestamps: true });

export const userModel = mongoose.model('User', userSchema);

