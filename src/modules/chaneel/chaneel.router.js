import { Router } from "express";
import * as chaneelControllers from './controller/chaneel.controller.js'
import { validation } from "../../middelware/validation.js";
import { catchErorr } from "../../utils/handelError.js";
import { auth } from "../../middelware/auth.js";
import { fileValidation, uploadFile } from "../../utils/multer.js";

export const chaneelRouter = Router()

chaneelRouter.post(
    '/addChannel',
    catchErorr(auth()),
    uploadFile({ customValidation: fileValidation.image }).single('image'),
    catchErorr(chaneelControllers.addChannel)
)
chaneelRouter.patch(
    '/updateChannelData/:_id',
    catchErorr(auth()),
    catchErorr(chaneelControllers.updateChannelData)
)
chaneelRouter.patch(
    '/addChannelToTrend',
    catchErorr(auth()),
    catchErorr(chaneelControllers.AddChannelToTrend)
)

chaneelRouter.patch(
    '/updateChannelImage/:_id',
    catchErorr(auth()),
    uploadFile({ customValidation: fileValidation.image }).single('image'),
    catchErorr(chaneelControllers.updateChannelImage)
)
chaneelRouter.delete(
    '/deleteChannel/:_id',
    catchErorr(auth()),
    catchErorr(chaneelControllers.deleteChannel)
)

chaneelRouter.get('/getChannels', catchErorr(chaneelControllers.getChannels))
chaneelRouter.get('/getChannelsByCategory', catchErorr(chaneelControllers.getChannelsByCategory))
chaneelRouter.get('/getChannelsBylang', catchErorr(chaneelControllers.getChannelsBylang))
chaneelRouter.get('/getOneChaneel/:_id', catchErorr(chaneelControllers.getOneChaneel))
chaneelRouter.get('/getTrendingChannel', catchErorr(chaneelControllers.getTrendingChannel))





