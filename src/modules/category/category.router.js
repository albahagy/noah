import { Router } from "express";
import * as categoryControllers from './controllers/category.controller.js'
import { validation } from "../../middelware/validation.js";
import { catchErorr } from "../../utils/handelError.js";
import { auth } from "../../middelware/auth.js";
import { fileValidation, uploadFile } from "../../utils/multer.js";
export const categoryRouter = Router()

categoryRouter.post(
    '/addCategory',
    catchErorr(auth()),
    uploadFile({ customValidation: fileValidation.image }).single('image'),
    catchErorr(categoryControllers.addCategory)
)
categoryRouter.patch(
    '/updateCategoryTitle/:_id',
    catchErorr(auth()),
    catchErorr(categoryControllers.updateCategoryTitle)
)
categoryRouter.patch(
    '/updateCategoryImage/:_id',
    catchErorr(auth()),
    uploadFile({ customValidation: fileValidation.image }).single('image'),
    catchErorr(categoryControllers.updateCategoryImage)
)
categoryRouter.delete(
    '/deleteCategory/:_id',
    catchErorr(auth())
    , catchErorr(categoryControllers.deleteCategory)
)
categoryRouter.get(
    '/getcategories',
    catchErorr(categoryControllers.getcategories)
)
categoryRouter.get(
    '/getcategories/:type',
    catchErorr(categoryControllers.getCategoriesByType)
)



