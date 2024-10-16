import { Schema, model } from "mongoose";

const CategorySchema = new Schema({
    title: {
        type: String, required: [true, 'title is required'], unique: true
    },
    image: {
        type: Object, required: [true, 'image is required'],
    },
    type: { type: String, enum: ['channel', 'movie', 'series'], required: true },

},
    { timestamps: true })

export const CategoryModel = model('Category', CategorySchema)
