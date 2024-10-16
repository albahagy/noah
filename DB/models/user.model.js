import { Schema, Types, model } from "mongoose";

const UserSchema = new Schema({
    name: {
        type: String,
        required: [true, 'name is required'],
    },
    email: {
        type: String,
        required: [true, 'email is required'],
        unique: [true, 'email must be unique value']
    },
    password: {
        type: String,
        required: [true, 'password is required'],
    },
    mobileNumber: {
        type: String,
        required: [true, 'mobileNumber is required'],
        unique: [true, 'mobileNumber must be unique value']
    },
    status: {
        type: String,
        default: 'offline',
        enum: ['offline', 'online']
    },
    image: {
        type: Object,
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

export const userModel = model('User', UserSchema)
