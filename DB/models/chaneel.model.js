// models/Channel.js
import { Schema, Types, model } from "mongoose";


const ChannelSchema = new Schema({
    title: { type: String, required: true, unique: true },
    category: {
        type: Types.ObjectId,
        ref: 'Category',
        required: [true, 'category is required'],
    },
    streamUrl: { type: String, required: true }, // URL to the streaming source
    lang: { type: String, enum: ['en', 'ar'], required: true },
    image: {
        type: Object, required: [true, 'image is required'],
    },
    trending: { type: Boolean, default: false }
},
    { timestamps: true });

export const ChannelModel = model('Channel', ChannelSchema)