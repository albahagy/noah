import { Schema, model, Types } from "mongoose";

// Define the Episode schema
const EpisodeSchema = new Schema({
    title: { type: String, required: true , unique: true },
    videoUrl: { type: String, required: true },
    Series: {
        type: Types.ObjectId,
        ref: 'Series',
        required: [true, 'Series is required'],
    }// URL to the video file
}, { timestamps: true });

// Define the Series schema
const SeriesSchema = new Schema({
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    releaseDate: { type: Number, required: true },
    episodes: {
        type: [Types.ObjectId],
        ref: 'Episode',
    }
    , // Array of episodes
    category: {
        type: Types.ObjectId,
        ref: 'Category',
        required: [true, 'Category is required'],
    },
    image: {
        type: Object, required: [true, 'image is required'],
    },
    rating: { type: Number, min: 0, max: 10 }, // Rating from 0 to 10
    lang: { type: String, enum: ['en', 'ar'], required: true }, // Language
    trending: { type: Boolean, default: false }

}, { timestamps: true });

export const SeriesModel = model('Series', SeriesSchema);

export const EpisodeModel = model('Episode', EpisodeSchema);

