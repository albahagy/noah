import { Router } from "express"
import * as authControllers from './controllers/auth.controller.js'
import { catchErorr } from "../../utils/handelError.js"
import { auth } from "../../middelware/auth.js"
import { validation } from "../../middelware/validation.js"
import * as validationSchemas from "./auth.validtion.js"
import { fileValidation, uploadFile } from "../../utils/multer.js"
export const authRouter = Router()

authRouter.post('/signUp', validation(validationSchemas.SignUpSchema), catchErorr(authControllers.signUp))

authRouter.patch('/logIn', validation(validationSchemas.LoginSchema), catchErorr(authControllers.login))

authRouter.patch('/logOut', catchErorr(authControllers.logOut))

authRouter.patch('/uplodeProfile', catchErorr(auth()), uploadFile({ customValidation: fileValidation.image }).single('image'), catchErorr(authControllers.uplodeProfile))

authRouter.patch('/updateProfileImage', catchErorr(auth()), uploadFile({ customValidation: fileValidation.image }).single('image'), catchErorr(authControllers.updateProfileImage))


authRouter.patch('/updateAccount', catchErorr(auth()), validation(validationSchemas.updateAccountSchema), catchErorr(authControllers.updateAccount))

authRouter.patch('/updatePass', catchErorr(auth()), validation(validationSchemas.updatePassSchema), catchErorr(authControllers.updatePass))

authRouter.patch('/updateAccountUser', catchErorr(auth()), validation(validationSchemas.updateAccountUserSchema), catchErorr(authControllers.updateAccountUser))

authRouter.patch('/updatePassUser', catchErorr(auth()), validation(validationSchemas.updatePassUserSchema), catchErorr(authControllers.updatePassUser))

authRouter.get('/getAccountdata', catchErorr(auth()), catchErorr(authControllers.getAccountdata))

authRouter.get('/getUsers', catchErorr(auth()), catchErorr(authControllers.getUsers))

authRouter.get('/getAnotherAccountdata/:_id', catchErorr(auth()), validation(validationSchemas.getAnotherAccountdataSchema), catchErorr(authControllers.getAnotherAccountdata))

authRouter.patch('/deleteAccount', catchErorr(auth()), validation(validationSchemas.deleteUserSchema), catchErorr(authControllers.deleteAccount))

// authRouter.patch('/sendCodeForForgetPass', validation(validationSchemas.sendCodeForForgetPassSchema), catchErorr(authControllers.sendCodeForForgetPass))

// authRouter.patch('/ForgetPass', validation(validationSchemas.ForgetPassSchema), catchErorr(authControllers.ForgetPass))
