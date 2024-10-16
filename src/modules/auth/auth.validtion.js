import joi from "joi";
import { idValidate } from "../../middelware/validation.js";

export const SignUpSchema = joi.object({
    name: joi.string().min(2).max(20).required(),
    email: joi.string().email().required(),
    password: joi.string().required(),
    confirmPassword: joi.string().equal(joi.ref('password')).required(),
    mobileNumber: joi.string().min(10).max(12).required(),
}).required()

export const LoginSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required()
}).required()

export const updateAccountSchema = joi.object({
    name: joi.string().min(2).max(20).required()
}).required()

export const updateAccountUserSchema = joi.object({
    _id: joi.custom(idValidate).required(),
    name: joi.string().min(2).max(20).required()
}).required()

export const getAnotherAccountdataSchema = joi.object({
    _id: joi.custom(idValidate).required(),
}).required()

export const updatePassSchema = joi.object({
    password: joi.string().required(),
    newPassword: joi.string().required(),
    confirmPassword: joi.string().equal(joi.ref('newPassword')).required()
}).required()

export const updatePassUserSchema = joi.object({
    _id: joi.custom(idValidate).required(),
    password: joi.string().required(),
    confirmPassword: joi.string().equal(joi.ref('password')).required()
}).required()

export const deleteUserSchema = joi.object({
    _id: joi.custom(idValidate).required(),
    
}).required()


// export const sendCodeForForgetPassSchema = joi.object({
//     email: joi.string().email().required(),
// }).required()

// export const ForgetPassSchema = joi.object({
//     email: joi.string().email().required(),
//     code: joi.string().required(),
//     password: joi.string().pattern(new RegExp("^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$")).required()
// }).required()

// export const getAccountsforRecoveryMailSchema = joi.object({
//     recoveryEmail: joi.string().email().required(),
// }).required()




