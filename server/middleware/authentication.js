import jwt from "jsonwebtoken";
import { catchAsyncError } from "./catchAsyncError.js";
import ErrorHandler from "../utils/errorHandler.js";
import { adminModel } from "../model/admin.model.js";

export const adminAuthentication = catchAsyncError(async (req, res, next) => {

    const { token } = req.cookies;

    if (!token)
        return next(new ErrorHandler("Login first!", 401));

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) return next(new ErrorHandler("Invalid or expired session!", 401));

    const admin = await adminModel.findById(decoded._id);

    if (!admin) return next(new ErrorHandler("Admin not found!", 404));

    req.admin = admin;

    next();
});
