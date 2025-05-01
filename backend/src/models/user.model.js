import mongoose from "mongoose";
import jwt from "jsonwebtoken";

import { env } from "../config/index.js";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username is required to personalize your account."]
    },
    email: {
        type: String,
        required: [true, "Please provide your email address."],
        unique: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email address."]
    },
    password: {
        type: String,
        required: [true, "A password is required to create an account."],
        minlength: [6, "Password must be at least 6 characters long."]
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
}, { timestamps: true });

userSchema.methods.generateAccessToken = function () {
    return jwt.sign({ id: this._id }, env.accessTokenSecret, { expiresIn: env.accessTokenValidity });
}
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign({ id: this._id }, env.refreshTokenSecret, { expiresIn: env.refreshTokenValidity });
}

const User = mongoose.model('User', userSchema);
export default User;