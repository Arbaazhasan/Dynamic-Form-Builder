import { Form } from "../model/form.model.js";
import { Field } from "../model/field.model.js";
import { Submission } from "../model/submission.model.js";
import { catchAsyncError } from "../middleware/catchAsyncError.js";
import ErrorHandler from "../utils/errorHandler.js";


export const createSubmission = catchAsyncError(async (req, res, next) => {
    const { formId } = req.params;
    const { email, responses } = req.body;

    if (!email) return next(new ErrorHandler("Email is required", 400));
    if (!responses || !Array.isArray(responses) || responses.length === 0)
        return next(new ErrorHandler("Responses are required", 400));

    const form = await Form.findById(formId);
    if (!form) return next(new ErrorHandler("Form not found", 404));

    const existingSubmission = await Submission.findOne({ formId, email });
    if (existingSubmission)
        return next(new ErrorHandler("You have already submitted this form.", 400));

    for (const response of responses) {
        const field = await Field.findById(response.fieldId);
        const value = response.value;

        if (!field || field.formId.toString() !== formId) {
            return next(new ErrorHandler(`Invalid field: ${response.fieldId}`, 400));
        }

        if (field.required && (value === undefined || value === "")) {
            return next(new ErrorHandler(`${field.label} is required.`, 400));
        }

        if (value !== undefined && value !== null) {
            switch (field.type) {
                case "number":
                    if (isNaN(value)) {
                        return next(
                            new ErrorHandler(`${field.label} must be a valid number.`, 400)
                        );
                    }
                    if (field.validation?.min !== undefined && value < field.validation.min) {
                        return next(
                            new ErrorHandler(
                                `${field.label} must be at least ${field.validation.min}.`,
                                400
                            )
                        );
                    }
                    if (field.validation?.max !== undefined && value > field.validation.max) {
                        return next(
                            new ErrorHandler(
                                `${field.label} must be at most ${field.validation.max}.`,
                                400
                            )
                        );
                    }
                    break;

                case "email":
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(value)) {
                        return next(
                            new ErrorHandler(`${field.label} must be a valid email address.`, 400)
                        );
                    }
                    break;

                case "text":
                case "textarea":
                    if (field.validation?.min && value.length < field.validation.min) {
                        return next(
                            new ErrorHandler(
                                `${field.label} must be at least ${field.validation.min} characters long.`,
                                400
                            )
                        );
                    }
                    if (field.validation?.max && value.length > field.validation.max) {
                        return next(
                            new ErrorHandler(
                                `${field.label} must be at most ${field.validation.max} characters long.`,
                                400
                            )
                        );
                    }
                    break;

                case "radio":
                case "select":
                    const validOptions = field.options.map((opt) => opt.value);
                    if (!validOptions.includes(value)) {
                        return next(
                            new ErrorHandler(`Invalid option selected for ${field.label}.`, 400)
                        );
                    }
                    break;

                case "checkbox":
                    if (!Array.isArray(value)) {
                        return next(
                            new ErrorHandler(`${field.label} must be an array of selected options.`, 400)
                        );
                    }
                    const validCheckboxOptions = field.options.map((opt) => opt.value);
                    for (const v of value) {
                        if (!validCheckboxOptions.includes(v)) {
                            return next(
                                new ErrorHandler(`Invalid checkbox option for ${field.label}.`, 400)
                            );
                        }
                    }
                    break;

                case "date":
                    if (isNaN(Date.parse(value))) {
                        return next(
                            new ErrorHandler(`${field.label} must be a valid date.`, 400)
                        );
                    }
                    break;
            }

            if (field.validation?.regex) {
                const regex = new RegExp(field.validation.regex);
                if (!regex.test(value)) {
                    return next(
                        new ErrorHandler(`${field.label} format is invalid.`, 400)
                    );
                }
            }
        }
    }

    const submission = await Submission.create({
        formId,
        email,
        responses,
    });

    res.status(201).json({
        success: true,
        message: "Form submitted successfully!",
        data: submission,
    });
});



export const deleteSubmission = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;

    const submission = await Submission.findById(id);
    if (!submission) return next(new ErrorHandler("Submission not found", 404));

    await submission.deleteOne();

    res.status(200).json({
        success: true,
        message: "Submission deleted successfully",
    });
});

