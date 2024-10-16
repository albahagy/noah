// models/Movie.js
import { Schema, Types, model } from "mongoose";

const MovieSchema = new Schema({
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    releaseDate: { type: Number, required: true },
    category: {
        type: Types.ObjectId,
        ref: 'Category',
        required: [true, 'category is required'],
    },
    image: {
        type: Object, required: [true, 'image is required'],
    },
    rating: { type: Number, required: true },
    lang: { type: String, enum: ['en', 'ar'], required: true },
    duration: { type: Number, required: true }, // duration in minutes
    videoUrl: { type: String, required: true }, // URL to the video file
    trending: { type: Boolean, default: false }
},
    { timestamps: true });
export const MovieModel = model('Movie', MovieSchema)
