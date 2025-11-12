import { Form } from "../model/form.model.js";
import { catchAsyncError } from "../middleware/catchAsyncError.js";
import { Field } from "../model/field.model.js";
import ErrorHandler from "../utils/errorHandler.js";


// Create Form
export const createForm = catchAsyncError(async (req, res, next) => {
    const { title, description, fields } = req.body;

    if (!title) return next(new ErrorHandler("Form title is required", 400));
    if (!fields || !Array.isArray(fields) || fields.length === 0)
        return next(new ErrorHandler("At least one field is required", 400));

    const form = await Form.create({
        title,
        description,
        createdBy: req.admin._id,
    });

    const createdFields = await Promise.all(
        fields.map(async (fieldData) => {
            const newField = await Field.create({
                ...fieldData,
                formId: form._id,
            });
            return newField._id;
        })
    );

    form.fields = createdFields;
    await form.save();

    res.status(201).json({
        success: true,
        message: "Form created successfully",
        form,
    });
});


export const updateForm = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    const updates = req.body;

    const form = await Form.findById(id);

    if (!form) {
        return next(new ErrorHandler("Form not found", 404));
    }

    Object.keys(updates).forEach((key) => {
        if (updates[key] !== undefined) {
            form[key] = updates[key];
        }
    });

    await form.save();

    res.status(200).json({
        success: true,
        message: "Form updated successfully",
        form,
    });
});


export const deleteForm = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;

    const form = await Form.findById(id);
    if (!form) return next(new ErrorHandler("Form not found", 404));

    if (form.createdBy.toString() !== req.admin._id.toString()) {
        return next(new ErrorHandler("Unauthorized", 403));
    }

    await Field.deleteMany({ formId: form._id });

    await form.deleteOne();

    res.status(200).json({
        success: true,
        message: "Form deleted successfully",
    });
});



export const getAllForms = catchAsyncError(async (req, res, next) => {
    const forms = await Form.find({ createdBy: req.admin._id })
        .populate("fields") 
        .sort({ createdAt: -1 })

    if (!forms || forms.length === 0) {
        return next(new ErrorHandler("No forms found", 404));
    }

    res.status(200).json({
        success: true,
        count: forms.length,
        forms,
    });
});



export const getSingleForm = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;

    const form = await Form.findById(id).populate("fields");

    if (!form) {
        return next(new ErrorHandler("Form not found", 404));
    }

    res.status(200).json({
        success: true,
        form,
    });
});

