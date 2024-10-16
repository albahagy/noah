import { Router } from "express";
import * as matchesControllers from './controller/match.controller.js'
import { validation } from "../../middelware/validation.js";
import { catchErorr } from "../../utils/handelError.js";
import { auth } from "../../middelware/auth.js";
import { fileValidation, uploadFile } from "../../utils/multer.js";

export const matchRouter = Router()

matchRouter.post(
    '/addMatch',
    catchErorr(auth()),
    uploadFile({ customValidation: fileValidation.image }).fields([{ name: 'image1', maxCount: 1 }, { name: 'image2', maxCount: 1 }]),
    catchErorr(matchesControllers.addMatch)
)

matchRouter.patch(
    '/updateMatch/:_id',
    catchErorr(auth()),
    catchErorr(matchesControllers.updateMatch)
)

matchRouter.patch(
    '/updateMatchImages/:_id',
    catchErorr(auth()),
    uploadFile({ customValidation: fileValidation.image }).fields([{ name: 'image1', maxCount: 1 }, { name: 'image2', maxCount: 1 }]),
    catchErorr(matchesControllers.updateMatchImages)
)

matchRouter.delete('/deleteMatch/:_id', catchErorr(auth()), catchErorr(matchesControllers.deleteMatch))

matchRouter.get('/getMatches', catchErorr(matchesControllers.getMatches))
matchRouter.get('/getOneMatch', catchErorr(matchesControllers.getOneMatch))




