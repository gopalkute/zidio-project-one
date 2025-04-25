import mongoose from "mongoose";
import bcrypt from 'bcrypt';

import { User } from "../models/index.js";
import { createError, errorCodes } from "../utils/index.js";
import { env } from "../config/index.js";

const cookieOptions = {
    // httpOnly: true,
    // secure: true,
    // sameSite: 'None'
}

const generateAccessAndRefereshTokens = async (id) => {
    try {
        const user = await User.findById(id);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save();
        return { accessToken, refreshToken };
    } catch (error) {
        console.log('Error in generateAccessAndRefereshTokens: ', error);
        throw error;
    }
}

export const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json(createError(errorCodes.badRequest, 'input', 'Please provide all required fields to proceed.'))
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json(createError(errorCodes.conflict, 'email', 'An account with this email address already exists.'))
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username, email,
            password: hashedPassword
        });
        await newUser.save();

        console.log('User created successfully.')
        res.status(201).json({ message: "User created successfully." })
    } catch (error) {
        console.error("Error registering user:", error);
        if (error instanceof mongoose.Error.ValidationError) {
            res.status(400).json({ code: errorCodes.badRequest, errors: error.errors })
        }
        else {
            res.status(500).json(createError(errorCodes.serverError, 'serverError', 'An error occurred while registering user. Please try again later.'));
        }
    }
}

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json(createError(errorCodes.badRequest, 'input', 'Both email and password is required.'));
        }

        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(401).json(createError(errorCodes.unauthorized, 'credentials', 'Invalid username or password.'));
        }

        const isValidPassword = await bcrypt.compare(password, existingUser.password);
        if (!isValidPassword) {
            return res.status(401).json(createError(errorCodes.unauthorized, 'credentials', 'Invalid username or password.'));
        }

        const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(existingUser._id);
        res.status(200)
            .cookie('Auth_Access_Token', accessToken, { ...cookieOptions, maxAge: env.accessTokenMaxAge })
            .cookie('Auth_Refresh_Token', refreshToken, { ...cookieOptions, maxAge: env.refreshTokenMaxAge })
            .json({ accessToken, refreshToken });

    } catch (error) {
        console.log('Error while authenticating user:', error);
        res.status(500).json(createError(errorCodes.serverError, 'serverError', 'An error occurred while authenticating user. Please try again later.'));
    }
}

export const handleTokenRefresh = async (req, res) => {
    try {
        const incomingRefreshToken = req.cookies.refreshToken || req.body?.refreshToken;
        if (!incomingRefreshToken) {
            return res.status(401).json(createError(
                errorCodes.tokenMissing,
                'refreshToken',
                'Access denied, A valid token is required.'
            ));
        }

        const decodedRefreshToken = jwt.verify(incomingRefreshToken, env.refreshTokenSecret);

        const existingUser = await User.findById(decodedRefreshToken.id, { refreshToken: 1 });
        if (!existingUser) {
            return res.status(401).json(createError(
                errorCodes.tokenInvalid,
                'refreshToken',
                'Access denied, A valid token is required.'
            ));
        }

        if (incomingRefreshToken !== existingUser.refreshToken) {
            return res.status(400).json(createError(
                errorCodes.tokenInvalid,
                'refreshToken',
                'Access denied, A valid token is required.'
            ));
        }

        const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(existingUser._id);

        res.status(200)
            .cookie('Auth_Access_Token', accessToken, { ...cookieOptions, maxAge: env.accessTokenMaxAge })
            .cookie('Auth_Refresh_Token', refreshToken, { ...cookieOptions, maxAge: env.refreshTokenMaxAge })
            .json({ accessToken, refreshToken });
    } catch (error) {
        if (error?.name == 'TokenExpiredError') {
            res.status(401).json(createError(
                errorCodes.tokenExpired,
                'refreshToken',
                'Your access has temporarily expired. Reauthenticate to get back in!'
            ));
        }
        else if (error?.name == 'JsonWebTokenError') {
            res.status(401).json(createError(
                errorCodes.tokenTampered,
                'refreshToken',
                'It seems the token is corrupted or invalid.'
            ));
        }
        else {
            res.status(500).json(createError(500, 'serverError', 'An error occurred while authenticating your access, Please try again later.'));
        }
    }
}

/**
 * Route: POST /api/dev/insert-users
 * Purpose: For test/development use only.
 * Allows inserting:
 *   - A single user (send one user object)
 *   - Multiple users (send an array of user objects)
 * This route won't be available in production!
 */
export const testInsertUser = async (req, res) => {
    try {
        const data = req.body;
        const isMultiple = Array.isArray(data);
        let result;
        if (isMultiple) {
            result = await User.insertMany(data);
        } else {
            const newUser = new User(data);
            result = await newUser.save();
        }
        res.json({ message: 'User added successfully: ', result });
    } catch (error) {
        console.log("Error in insert user: ", error);
        res.json({ message: 'Error adding user: ', error });
    }
}

/**
 * Route: DELETE /api/dev/delete-users
 * Purpose: For test/development use only.
 * Allows deleting:
 *   - All users (by setting { all: true })
 *   - Selected users (by sending their IDs in { ids: [] })
 * This route won't be available in production!
 */
export const testDeleteUser = async (req, res) => {
    try {
        const { ids, all } = req.body;
        if (all) {
            const result = await User.deleteMany({});
            return res.status(200).json({ message: 'All users deleted', deletedCount: result.deletedCount });
        }
        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ message: 'Provide array of user IDs or set all=true' });
        }
        const result = await User.deleteMany({ _id: { $in: ids } });
        res.status(200).json({ message: 'Selected users deleted', deletedCount: result.deletedCount });
    } catch (err) {
        console.error('Error deleting users:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
}