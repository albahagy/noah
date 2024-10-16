import { CategoryModel } from "../../../../DB/models/category.model.js";
import fs from "fs";
import path from "path";

export const addCategory = async (req, res, next) => {
    try {
        const { title, type } = req.body;
        if (!req?.file) {
            return next(new Error('Image is required', { cause: 409 }));
        }
        // Create the new Category
        const OpenImage = `${process.env.IMAGE_URI}${req?.file?.finalDest}`
        await CategoryModel.create({ title, type, image: { OpenImage, DeleteImage: req?.file?.path } })
        // Send the response
        return res.status(201).json({ status: "true", message: 'Category added successfully' });
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

            return next(new Error('Category must be unique', { cause: 409 }));
        }
        // Handle other errors
        return next(err);
    }
}

export const updateCategoryTitle = async (req, res, next) => {
    const { _id } = req.params;
    const { title } = req.body;
    if (await CategoryModel.findOne({ title, _id: { $ne: _id } })) {
        return next(new Error('Category must be unique', { cause: 409 }))
    }
    const category = await CategoryModel.findByIdAndUpdate(_id, { title })
    if (!category) {
        return next(new Error('Category not found', { cause: 404 }))
    }

    res.status(200).json({ status: "true", messagge: 'Category updated successfully' })
}

export const updateCategoryImage = async (req, res, next) => {
    const { _id } = req.params;
    console.log(req.file);
    if (!req?.file) {
        return next(new Error('Image is required', { cause: 409 }));
    }
    const category = await CategoryModel.findById(_id)
    if (!category) {
        return next(new Error('Category not found', { cause: 404 }))
    }
    if (category?.image?.DeleteImage) {
        const imagePath = path.resolve(category.image.DeleteImage); // Remove leading slash
        fs.unlink(imagePath, (err) => {
            if (err) {
                console.error('Error deleting image file:', err);
                return res.status(500).json({ status: "false", message: 'Error deleting image file' });
            }
        });
    }
    const OpenImage = `${process.env.IMAGE_URI}${req?.file?.finalDest}`
    category.image = {
        OpenImage,
        DeleteImage: req?.file?.path
    }
    await category.save()

    res.status(200).json({ status: "true", message: 'Category updated successfully' })
}

export const deleteCategory = async (req, res, next) => {
    const { _id } = req.params;
    const category = await CategoryModel.findByIdAndDelete(_id)
    if (!category) {
        return next(new Error('Category not found', { cause: 404 }))
    }
    if (category?.image?.DeleteImage) {
        const imagePath = path.resolve(category.image.DeleteImage); // Remove leading slash
        fs.unlink(imagePath, (err) => {
            if (err) {
                console.error('Error deleting image file:', err);
                return res.status(500).json({ status: "false", message: 'Error deleting image file' });
            }
        });
    }


    res.status(200).json({ status: "true", message: 'Category deleted successfully' })
}

export const getCategoriesByType = async (req, res, next) => {
    const { type } = req.params
    const categories = await CategoryModel.find({ type })
    res.status(200).json({ status: "true", data: categories })
}

export const getcategories = async (req, res, next) => {
    const categories = await CategoryModel.find({})
    res.status(200).json({ status: "true", data: categories })
}

