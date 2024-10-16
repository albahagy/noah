import { Router } from "express";
import * as movieControllers from './controller/movie.controller.js'
import { validation } from "../../middelware/validation.js";
import { catchErorr } from "../../utils/handelError.js";
import { auth } from "../../middelware/auth.js";
import { fileValidation, uploadFile } from "../../utils/multer.js";

export const movieRouter = Router()

movieRouter.post(
    '/addMovie',
    catchErorr(auth()),
    uploadFile({ customValidation: fileValidation.image }).single('image'),
    catchErorr(movieControllers.addMovie)
)

movieRouter.patch(
    '/addMovieToTrend',
    catchErorr(auth()),
    catchErorr(movieControllers.AddMovieToTrend)
)

movieRouter.patch(
    '/updateMovie/:_id',
    catchErorr(auth()),
    catchErorr(movieControllers.updateMovie)
)
movieRouter.patch(
    '/updateMovieImage/:_id',
    catchErorr(auth()),
    uploadFile({ customValidation: fileValidation.image }).single('image'),
    catchErorr(movieControllers.updateMovieImage)
)

movieRouter.delete('/deleteMovie/:_id', catchErorr(auth()), catchErorr(movieControllers.deleteMovie))

movieRouter.get('/getMovies', catchErorr(movieControllers.getMovies))
movieRouter.get('/getMoviesByCategory', catchErorr(movieControllers.getMoviesByCategory))
movieRouter.get('/getMoviesBylang', catchErorr(movieControllers.getMoviesBylang))
movieRouter.get('/getOneMovie/:_id', catchErorr(movieControllers.getOneMovie))
movieRouter.get('/getTrendingMovies', catchErorr(movieControllers.getTrendingMovies))





