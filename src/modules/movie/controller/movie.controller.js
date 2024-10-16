import { MovieModel } from "../../../../DB/models/movie.model.js";
import fs from "fs";
import path from "path";


export const addMovie = async (req, res, next) => {
    try {
        const { title, description, releaseDate, category, rating, lang, duration, videoUrl } = req.body;
        // Create the new Category
        if (!req?.file) {
            return next(new Error('Image is required', { cause: 409 }));
        }
        const OpenImage = `${process.env.IMAGE_URI}${req?.file?.finalDest}`
        await MovieModel.create({ title, description, releaseDate, category, rating, lang, duration, videoUrl, image: { OpenImage, DeleteImage: req?.file?.path } })        // Send the response
        res.status(201).json({ status: "true", message: 'Movie added successfully' })
    } catch (err) {
        if (req.file.path) {
            const imagePath = path.resolve(req.file.path); // Remove leading slash
            fs.unlink(imagePath, (err) => {
                if (err) {
                    console.error('Error deleting image file:', err);
                    return res.status(500).json({ status: "false", message: 'Error deleting image file' });
                }
            });
        }
        // Handle duplicate key error
        if (err.code === 11000) {
            return next(new Error('Movie name must be uniqe ', { cause: 409 }))
        }
        // Handle other errors
        return next(err);
    }
}
export const updateMovie = async (req, res, next) => {
    const { _id } = req.params
    const { title, description, releaseDate, category, rating, lang, duration, videoUrl } = req.body;

    const titleExists = await MovieModel.findOne({ title: title, _id: { $ne: _id } });
    if (titleExists) {
        return next(new Error('Movie title already exists ', { cause: 409 }))
    }

    const movie = await MovieModel.findByIdAndUpdate(_id, { title, description, releaseDate, category, rating, lang, duration, videoUrl })
    if (!movie) {
        return next(new Error('Movie not found ', { cause: 404 }))
    }
    res.status(200).json({ status: "true", message: 'Movie updated successfully' })
}

export const updateMovieImage = async (req, res, next) => {
    const { _id } = req.params;
    console.log(req.file);
    if (!req?.file) {
        return next(new Error('Image is required', { cause: 409 }));
    }
    const movie = await MovieModel.findById(_id)
    if (!movie) {
        return next(new Error('Movie not found', { cause: 404 }))
    }
    if (movie?.image?.DeleteImage) {
        const imagePath = path.resolve(movie.image.DeleteImage); // Remove leading slash
        fs.unlink(imagePath, (err) => {
            if (err) {
                console.error('Error deleting image file:', err);
                return res.status(500).json({ status: "false", message: 'Error deleting image file' });
            }
        });
    }
    const OpenImage = `${process.env.IMAGE_URI}${req?.file?.finalDest}`
    movie.image = {
        OpenImage,
        DeleteImage: req?.file?.path
    }
    await movie.save()

    res.status(200).json({ status: "true", message: 'Movie updated successfully' })
}


export const deleteMovie = async (req, res, next) => {
    const { _id } = req.params;
    const movie = await MovieModel.findByIdAndDelete(_id)
    if (!movie) {
        return next(new Error('Movie not found ', { cause: 404 }))
    }
    if (movie?.image?.DeleteImage) {
        const imagePath = path.resolve(movie.image.DeleteImage); // Remove leading slash
        fs.unlink(imagePath, (err) => {
            if (err) {
                console.error('Error deleting image file:', err);
                return res.status(500).json({ status: "false", message: 'Error deleting image file' });
            }
        });
    }
    res.status(200).json({ status: "true", message: 'Movie deleted successfully' })
}
export const getMovies = async (req, res, next) => {
    const movies = await MovieModel.find({}).populate('category')
    res.status(200).json({ status: "true", data: movies })
}
export const getMoviesByCategory = async (req, res, next) => {
    const { category } = req.body
    const movies = await MovieModel.find({ category }).populate('category')
    res.status(200).json({ status: "true", data: movies })
}
export const getMoviesBylang = async (req, res, next) => {
    const { lang } = req.body
    const movies = await MovieModel.find({ lang }).populate('category')
    res.status(200).json({ status: "true", data: movies })
}
export const getOneMovie = async (req, res, next) => {
    const { _id } = req.params;
    const movie = await MovieModel.findById(_id).populate('category')
    if (!movie) {
        return next(new Error('Movie not found ', { cause: 404 }))
    }
    res.status(200).json({ status: "true", data: movie })
}

export const AddMovieToTrend = async (req, res, next) => {
    const { Movies } = req.body;
    await MovieModel.updateMany({ trending: true }, { trending: false })

    Movies.map(async (_id) => {
        await MovieModel.updateOne({ _id }, { trending: true })
    })
    res.status(200).json({ status: "true", message: "Trending movie updated successfully" })
}

export const getTrendingMovies = async (req, res, next) => {
    const movies = await MovieModel.find({ trending: true })
    res.status(200).json({ status: "true", data: movies })
}
