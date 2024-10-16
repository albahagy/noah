import { CategoryModel } from "../../../../DB/models/category.model.js";
import { ChannelModel } from "../../../../DB/models/chaneel.model.js";
import fs from "fs";
import path from "path";

export const addChannel = async (req, res, next) => {
    try {
        const { title, category, lang, streamUrl } = req.body;
        if (!req?.file) {
            return next(new Error('Image is required', { cause: 409 }));
        }
        if (! await CategoryModel.findOne({ _id: category })) {
            const imagePath = path.resolve(req.file.path); // Remove leading slash
            fs.unlink(imagePath, (err) => {
                if (err) {
                    console.error('Error deleting image file:', err);
                    return res.status(500).json({ status: "false", message: 'Error deleting image file' });
                }
            });
            return next(new Error('Category not found', { cause: 404 }));
        }
        const OpenImage = `${process.env.IMAGE_URI}${req?.file?.finalDest}`
        // Create the new channel
        await ChannelModel.create({ title, category, lang, streamUrl, image: { OpenImage, DeleteImage: req?.file?.path } });
        // Send the response
        return res.status(201).json({ status: "true", message: 'Channel added successfully' });
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
            return next(new Error('Channel must be unique', { cause: 409 }));
        }
        // Handle other errors
        return next(err);
    }
}
export const updateChannelData = async (req, res, next) => {
    const { _id } = req.params
    const { title, category, lang, streamUrl } = req.body;
    if (! await CategoryModel.findOne({ _id: category })) {
        return next(new Error('Category not found', { cause: 404 }));
    }
    const titleExists = await ChannelModel.findOne({ title: title, _id: { $ne: _id } });
    if (titleExists) {
        return next(new Error('Channel title already exists ', { cause: 409 }))
    }
    const channel = await ChannelModel.findByIdAndUpdate(_id, { title, category, lang, streamUrl })
    if (!channel) {
        return next(new Error('Channel not found ', { cause: 404 }))
    }
    res.status(200).json({ status: "true", message: 'Channel updated successfully' })
}

export const updateChannelImage = async (req, res, next) => {
    const { _id } = req.params;
    console.log(req.file);
    if (!req?.file) {
        return next(new Error('Image is required', { cause: 409 }));
    }
    const channel = await ChannelModel.findById(_id)
    if (!channel) {
        return next(new Error('Channel not found', { cause: 404 }))
    }
    if (channel?.image?.DeleteImage) {
        const imagePath = path.resolve(channel.image.DeleteImage); // Remove leading slash
        fs.unlink(imagePath, (err) => {
            if (err) {
                console.error('Error deleting image file:', err);
                return res.status(500).json({ status: "false", message: 'Error deleting image file' });
            }
        });
    }
    const OpenImage = `${process.env.IMAGE_URI}${req?.file?.finalDest}`
    channel.image = {
        OpenImage,
        DeleteImage: req?.file?.path
    }
    await channel.save()

    res.status(200).json({ status: "true", message: 'Channel updated successfully' })
}

export const deleteChannel = async (req, res, next) => {
    const { _id } = req.params;
    const channel = await ChannelModel.findByIdAndDelete(_id)
    if (!channel) {
        return next(new Error('Channel not found ', { cause: 404 }))
    }
    if (channel?.image?.DeleteImage) {
        const imagePath = path.resolve(channel.image.DeleteImage); // Remove leading slash
        fs.unlink(imagePath, (err) => {
            if (err) {
                console.error('Error deleting image file:', err);
                return res.status(500).json({ status: "false", message: 'Error deleting image file' });
            }
        });
    }
    res.status(200).json({ status: "true", message: 'Channel deleted successfully' })
}
export const getChannels = async (req, res, next) => {
    const Channels = await ChannelModel.find({}).populate('category')
    res.status(200).json({ status: "true", data: Channels })
}
export const getChannelsByCategory = async (req, res, next) => {
    const { category } = req.body
    const Channels = await ChannelModel.find({ category }).populate('category')
    res.status(200).json({ status: "true", data: Channels })
}
export const getChannelsBylang = async (req, res, next) => {
    const { lang } = req.body
    const Channels = await ChannelModel.find({ lang }).populate('category')
    res.status(200).json({ status: "true", data: Channels })
}
export const getOneChaneel = async (req, res, next) => {
    const { _id } = req.params;

    const channel = await ChannelModel.findById(_id).populate('category')
    if (!channel) {
        return next(new Error('Channel not found ', { cause: 404 }))
    }
    res.status(200).json({ status: "true", data: channel })
}

export const AddChannelToTrend = async (req, res, next) => {
    const { Channels } = req.body;
    await ChannelModel.updateMany({ trending: true }, { trending: false })

    Channels.map(async (_id) => {
        await ChannelModel.updateOne({ _id }, { trending: true })
    })
    res.status(200).json({ status: "true", message: "Trending Channel updated successfully" })
}

export const getTrendingChannel = async (req, res, next) => {
    const Channel = await ChannelModel.find({ trending: true })
    res.status(200).json({ status: "true", data: Channel })
}
