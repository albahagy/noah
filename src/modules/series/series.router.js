import { Router } from "express";
import * as seriesController from './controller/series.controller.js'
import { validation } from "../../middelware/validation.js";
import { catchErorr } from "../../utils/handelError.js";
import { auth } from "../../middelware/auth.js";
import { fileValidation, uploadFile } from "../../utils/multer.js";
export const seriesRouter = Router()

seriesRouter.post(
    '/addSeries',
    catchErorr(auth()),
    uploadFile({ customValidation: fileValidation.image }).single('image'),
    catchErorr(seriesController.addSeries)
)
seriesRouter.post(
    '/addEpisode/:_id',
    catchErorr(auth()),
    catchErorr(seriesController.addEpisode)
)
seriesRouter.patch(
    '/updateEpisode/:_id',
    catchErorr(auth()),
    catchErorr(seriesController.updateEpisode)
)
seriesRouter.delete(
    '/deleteEpisode/:_id',
    catchErorr(auth()),
    catchErorr(seriesController.deleteEpisode)
)
seriesRouter.patch(
    '/updateSeries/:_id',
    catchErorr(auth()),
    catchErorr(seriesController.updateSeries)
)
seriesRouter.patch(
    '/updateSeriesImage/:_id',
    catchErorr(auth()),
    uploadFile({ customValidation: fileValidation.image }).single('image'),
    catchErorr(seriesController.updateSeriesImage)
)
seriesRouter.delete(
    '/deleteSeries/:_id',
    catchErorr(auth()),
    catchErorr(seriesController.deleteSeries)
)

seriesRouter.patch(
    '/addSeriesToTrend',
    catchErorr(auth()),
    catchErorr(seriesController.AddSeriesToTrend)
)

seriesRouter.get(
    '/getSeries',
    catchErorr(seriesController.getSeries)
)
seriesRouter.get(
    '/getSeriesByCategory',
    catchErorr(seriesController.getSeriesByCategory)
)
seriesRouter.get(
    '/getSeriesBylang',
    catchErorr(seriesController.getSeriesBylang)
)
seriesRouter.get(
    '/getOneSeries/:_id',
    catchErorr(seriesController.getOneSeries)
)

seriesRouter.get(
    '/getTrendingSeries',
    catchErorr(seriesController.getTrendingSeries)
)





