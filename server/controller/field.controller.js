import { Field } from "../model/field.model.js";
import { Form } from "../model/form.model.js";
import { catchAsyncError } from "../middleware/catchAsyncError.js";
import ErrorHandler from "../utils/errorHandler.js";


export const createField = catchAsyncError(async (req, res, next) => {
    const { formId } = req.params;
    const { label, name, type, required, options, validation, order, conditionalFields } = req.body;

    if (!label || !name || !type)
        return next(new ErrorHandler("Label, name, and type are required", 400));

    const form = await Form.findById(formId);
    if (!form) return next(new ErrorHandler("Form not found", 404));

    const field = await Field.create({
        formId,
        label,
        name,
        type,
        required,
        options,
        validation,
        order,
        conditionalFields
    });

    form.fields.push(field._id);
    await form.save();

    res.status(201).json({
        success: true,
        message: "Field created successfully",
        field
    });
});



export const updateField = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    const updates = req.body;

    const field = await Field.findById(id);
    if (!field) return next(new ErrorHandler("Field not found", 404));

    // Apply only provided updates
    Object.keys(updates).forEach((key) => {
        field[key] = updates[key];
    });

    await field.save();

    res.status(200).json({
        success: true,
        message: "Field updated successfully",
        field
    });
});



export const deleteField = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;

    const field = await Field.findById(id);
    if (!field) return next(new ErrorHandler("Field not found", 404));

    await Field.findByIdAndDelete(id);

    // Optional: Remove from parent form
    await Form.findByIdAndUpdate(field.formId, { $pull: { fields: field._id } });

    res.status(200).json({
        success: true,
        message: "Field deleted successfully"
    });
});
