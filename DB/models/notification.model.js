// models/Notification.js
import { Schema, model } from "mongoose";

const notificationSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    screen: {
        type: String,
        required: true
    }
},
    { timestamps: true });

export const NotificationModel = model('Notification', notificationSchema);

