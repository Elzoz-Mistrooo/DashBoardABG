import mongoose, { Schema } from "mongoose";
const OTPSchema=new Schema({
    email:{type:String,required:true},
    otp:{type:String,required:true},

},{
    timestamps:true
})

export const otpModel = mongoose.model('Otp', OTPSchema);
