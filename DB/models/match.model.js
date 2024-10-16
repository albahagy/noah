// models/Match.js
import { Schema, model } from "mongoose";


const MatchSchema = new Schema({
    championship: { type: String, required: true },
    round: { type: String, required: true },
    TeamA: { type: Object, required: true },
    TeamB: { type: Object, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true }, // Time in HH:MM format
    streamUrl: { type: [String], required: true }, // URL to the streaming source
},
    { timestamps: true });


export const MatchModel = model('Match', MatchSchema)

