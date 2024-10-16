import { EpisodeModel, SeriesModel } from "../../../../DB/models/series.model.js";
import fs from "fs";
import path from "path";
export const addSeries = async (req, res, next) => {
    try {
        const { title, description, releaseDate, category, lang, rating } = req.body;
        if (!req?.file) {
            return next(new Error('Image is required', { cause: 409 }));
        }
        const OpenImage = `${process.env.IMAGE_URI}${req?.file?.finalDest}`
        // Create the new Series
        await SeriesModel.create({ title, image: { OpenImage, DeleteImage: req?.file?.path }, description, releaseDate, category, lang, rating })
        // Send the response
        res.status(201).json({ status: "true", message: 'Series added successfully' })
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
            return next(new Error('Series must be uniqe ', { cause: 409 }))
        }
        // Handle other errors
        return next(err);
    }
}
// Add Episode
export const addEpisode = async (req, res, next) => {
    try {
        const { _id } = req.params
        const { title, videoUrl } = req.body;
        const series = await SeriesModel.findById(_id);
        if (!series) {
            return next(new Error('Series not found', { cause: 404 }))
        }
        const episode = await EpisodeModel.create({ title, videoUrl, Series: _id })
        // Save the updated series
        series.episodes.push(episode._id)
        await series.save()
        res.status(201).json({ status: "true", message: 'Episode added successfully' })
    } catch (error) {
        // Handle duplicate key error
        if (error.code === 11000) {
            return next(new Error('Episode must be uniqe ', { cause: 409 }))
        }
        // Handle other errors
        return next(error);
    }
}
// Update Episode
export const updateEpisode = async (req, res, next) => {
    const { _id } = req.params
    const { title, videoUrl } = req.body;

    const titleExists = await EpisodeModel.findOne({ title: title, _id: { $ne: _id } });
    if (titleExists) {
        return next(new Error('Episode title already exists ', { cause: 409 }))
    }
    const episode = await EpisodeModel.findByIdAndUpdate(_id, { title, videoUrl });
    if (!episode) {
        return next(new Error('Episode not found', { cause: 404 }));
    }
    res.status(200).json({ status: "true", message: 'Episode updated successfully' });
};
// Delete Episode
export const deleteEpisode = async (req, res, next) => {
    const { _id } = req.params;
    const episode = await EpisodeModel.findByIdAndDelete(_id)
    if (!episode) {
        return next(new Error('episode not found', { cause: 404 }))
    }
    res.status(200).json({ status: "true", message: 'Episode deleted successfully' });
};

export const updateSeries = async (req, res, next) => {
    const { _id } = req.params
    const { title, description, releaseDate, category, lang, rating } = req.body;

    const titleExists = await SeriesModel.findOne({ title: title, _id: { $ne: _id } });
    if (titleExists) {
        return next(new Error('Series title already exists ', { cause: 409 }))
    }
    const Series = await SeriesModel.findByIdAndUpdate(_id, { title, description, releaseDate, category, lang, rating })
    if (!Series) {
        return next(new Error('Series not found ', { cause: 404 }))
    }
    res.status(200).json({ status: "true", message: 'Series updated successfully' })
}

export const updateSeriesImage = async (req, res, next) => {
    const { _id } = req.params;
    console.log(req.file);
    if (!req?.file) {
        return next(new Error('Image is required', { cause: 409 }));
    }
    const series = await SeriesModel.findById(_id)
    if (!series) {
        return next(new Error('Series not found', { cause: 404 }))
    }
    if (series?.image?.DeleteImage) {
        const imagePath = path.resolve(series.image.DeleteImage); // Remove leading slash
        fs.unlink(imagePath, (err) => {
            if (err) {
                console.error('Error deleting image file:', err);
                return res.status(500).json({ status: "false", message: 'Error deleting image file' });
            }
        });
    }
    const OpenImage = `${process.env.IMAGE_URI}${req?.file?.finalDest}`
    series.image = {
        OpenImage,
        DeleteImage: req?.file?.path
    }
    await series.save()

    res.status(200).json({ status: "true", message: 'Series updated successfully' })
}
export const deleteSeries = async (req, res, next) => {
    const { _id } = req.params;
    const Series = await SeriesModel.findByIdAndDelete(_id)
    if (!Series) {
        return next(new Error('Series not found ', { cause: 404 }))
    }
    if (Series?.image?.DeleteImage) {
        const imagePath = path.resolve(Series.image.DeleteImage); // Remove leading slash
        fs.unlink(imagePath, (err) => {
            if (err) {
                console.error('Error deleting image file:', err);
                return res.status(500).json({ status: "false", message: 'Error deleting image file' });
            }
        });
    }
    res.status(200).json({ status: "true", message: 'Series deleted successfully' })
}

export const getSeries = async (req, res, next) => {
    const Series = await SeriesModel.find({}).populate('category episodes',)
    res.status(200).json({ status: "true", data: Series })
}
export const getSeriesByCategory = async (req, res, next) => {
    const { category } = req.body
    const Series = await SeriesModel.find({ category }).populate('category')
    res.status(200).json({ status: "true", data: Series })
}
export const getSeriesBylang = async (req, res, next) => {
    const { lang } = req.body
    const Series = await SeriesModel.find({ lang }).populate('category')
    res.status(200).json({ status: "true", data: Series })
}
export const getOneSeries = async (req, res, next) => {
    const { _id } = req.params;
    const Series = await SeriesModel.findById(_id).populate('category episodes')
    if (!Series) {
        return next(new Error('Series not found ', { cause: 404 }))
    }
    res.status(200).json({ status: "true", data: Series })
}

export const AddSeriesToTrend = async (req, res, next) => {
    const { Series } = req.body;
    await SeriesModel.updateMany({ trending: true }, { trending: false })

    Series.map(async (_id) => {
        await SeriesModel.updateOne({ _id }, { trending: true })
    })
    res.status(200).json({ status: "true", message: "Trending Series updated successfully" })
}

export const getTrendingSeries = async (req, res, next) => {
    const series = await SeriesModel.find({ trending: true })
    res.status(200).json({ status: "true", data: series })
}

