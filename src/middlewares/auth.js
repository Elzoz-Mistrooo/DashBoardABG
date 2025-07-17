    import jwt from 'jsonwebtoken';
    import asyncHandler from 'express-async-handler';
    import { userModel } from '../../DB/Models/user.model.js';

    export const userRoles = {
    admin: 'admin',
    user: 'user',
    };

    // تعديل هنا: بترجع دالة middleware حسب نوع التوكن
    export const author = (type = 'user') =>
    asyncHandler(async (req, res, next) => {
        const { authorization } = req.headers;

        if (!authorization?.startsWith("Bearer ")) {
        return next(new Error("Authorization header is required", { cause: 400 }));
        }

        const token = authorization.split(" ")[1];
        if (!token) {
        return next(new Error("Invalid authorization format", { cause: 400 }));
        }

        let secretKey;

        switch (type) {
        case 'admin':
            secretKey = process.env.ADMIN_SIGNATURE;
            break;
        case 'user':
            secretKey = process.env.USER_SIGNATURE;
            break;
        case 'forget':
            secretKey = process.env.FORGET_TOKEN_SECRET;
            break;
        default:
            return next(new Error("Invalid auth type", { cause: 400 }));
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

        // فقط تحقق من .token في حالة user أو admin
        if ((type === 'user' || type === 'admin') && !user.token) {
        return next(new Error("Please login again", { cause: 401 }));
        }

        req.user = user;
        req.userId = user._id;
        next();
    });


    // حماية الوصول للأدوار
    export const authAccessRole = (accessRoles) => {
    return asyncHandler((req, res, next) => {
        accessRoles = Array.isArray(accessRoles) ? accessRoles : Object.values(userRoles);

        if (!accessRoles.includes(req.user.role)) {
        return next(new Error("Not authorized to access this resource", { cause: 403 }));
        }

        next();
    });
    };
