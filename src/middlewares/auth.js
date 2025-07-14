import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import { userModel } from '../../DB/Models/user.model.js';

export const userRoles = {
    admin: 'admin',
    user: 'user',
};

export const author= asyncHandler(async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return next(new Error("Authorization header is required", { cause: 400 }));
    }

    const [bearer, token] = authorization.split(" ");

    if (!bearer || !token) {
        return next(new Error("Invalid authorization format", { cause: 400 }));
    }

    let secretKey;
    switch (bearer) {
        case "admin":
            secretKey = process.env.ADMIN_SIGNATURE;
            break;
        case "Bearer":
            secretKey = process.env.USER_SIGNATURE;
            break;
        default:
            return next(new Error("Invalid token prefix", { cause: 400 }));
    }

    if (!secretKey) {
        return next(new Error("Secret key not configured for this role", { cause: 500 }));
    }

    let decoded;
    try {
        decoded = jwt.verify(token, secretKey);
    } catch (err) {
        return next(new Error("Invalid or expired token", { cause: 401 }));
    }

    if (!decoded?.id) {
        return next(new Error("Invalid token payload", { cause: 400 }));
    }

    const user = await userModel.findById(decoded.id);
    if (!user) {
        return next(new Error("User not found", { cause: 404 }));
    }

    if (!user.token) {
        return next(new Error("Please login again", { cause: 401 }));
    }

    req.user = user;
    next();
});
export const authAccessRole = (accessRoles) => {
    return asyncHandler((req, res, next) => {
        accessRoles = Array.isArray(accessRoles) ? accessRoles : Object.values(userRoles);

        if (!accessRoles.includes(req.user.role)) {
            return next(new Error("Not authorized to access this resource", { cause: 403 }));
        }

        next();
    });
};
