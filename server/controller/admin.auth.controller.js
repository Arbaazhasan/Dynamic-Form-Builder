import { catchAsyncError } from "../middleware/catchAsyncError.js";
import { adminModel } from "../model/admin.model.js";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ErrorHandler from "../utils/errorHandler.js";

export const registerAdmin = catchAsyncError(async (req, res, next) => {

    const { name, email, password } = req.body;

    if (!name || !email || !password) return next(new ErrorHandler("All fields are required", 400));

    const isAdminExists = await adminModel.findOne({ email });

    if (isAdminExists) return next(new ErrorHandler("Email already registered", 400))

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await adminModel.create({
        name,
        email,
        password: hashedPassword,
    });

    const token = jwt.sign({ _id: admin._id }, process.env.JWT_SECRET);

    res.status(201).cookie("token", token, {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
    }).json({
        success: true,
        message: "Successfully registered.",
        admin: {
            id: admin._id,
            name: admin.name,
            email: admin.email,
        }
    });
});



export const loginAdmin = catchAsyncError(async (req, res, next) => {

    const { email, password } = req.body;

    if (!email || !password) return next(new ErrorHandler("Email and password are required", 400));


    const admin = await adminModel.findOne({ email }).select("+password");

    if (!admin) return next(new ErrorHandler("Invalid email or password", 400));

    const isPasswordMatch = await bcrypt.compare(password, admin.password);

    if (!isPasswordMatch) return next(new ErrorHandler("Invalid email or password", 400));

    const token = jwt.sign({ _id: admin._id }, process.env.JWT_SECRET);

    res.status(200).cookie("token", token, {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
    }).json({
        success: true,
        message: "Login successful.",
        admin: {
            id: admin._id,
            name: admin.name,
            email: admin.email,
        }
    });
});



export const logoutAdmin = catchAsyncError(async (req, res, next) => {

    res.cookie("token", null, {
        httpOnly: true,
        expires: new Date(0),
    });

    res.status(200).json({
        success: true,
        message: "Logged out successfully.",
    });
});
