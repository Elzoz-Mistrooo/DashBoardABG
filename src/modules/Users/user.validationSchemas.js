import joi from 'joi'
import { generalFields } from '../../middlewares/validation.js'

export const Signup = {
  body: joi
    .object({
      username: joi
        .string()
        .min(3)
        .max(10)
        .messages({
          'any.required': 'userName is required',
        })
        .required(),
      email: generalFields.email,
      password: generalFields.password,
      cPassword: joi.valid(joi.ref('password')).required(),
      gender: joi.string().optional(),
    })
    .required(),

}

export const login = joi.object({
    email: generalFields.email,
    password: generalFields.password,
    loginDevice: joi.string()
    .valid('browser', 'mobile', 'office', 'backend')
    .allow(null)
    .optional()
}).required()

export const sendCode = joi.object({
    email: generalFields.email,

}).required()



export const forgetpassword = joi.object({
    //body
    forgetCode: joi.string().pattern(new RegExp(/[0-9]{4}$/)).required(),
    email: joi.string().email(
        { minDomainSegments: 2, maxDomainSegments: 4, tlds: { allow: ['com', 'net', 'edu', 'eg', 'hambozo'] } }
    ).required(),
    password: joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)).required(),
    cPassword: generalFields.cPassword.valid(joi.ref('password')),


}).required();