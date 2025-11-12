import mongoose from "mongoose";

const fieldSchema = new mongoose.Schema({
    formId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Form",
        required: true
    },
    label: {
        type: String,
        required: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        enum: [
            "text",
            "textarea",
            "number",
            "email",
            "date",
            "checkbox",
            "radio",
            "select"
        ],
        required: true
    },
    required: {
        type: Boolean,
        default: false
    },
    options: [
        {
            label: { type: String, required: true },
            value: { type: String, required: true },
        },
    ],
    validation: {
        min: Number,
        max: Number,
        regex: String
    },
    order: {
        type: Number,
        default: 0
    },
    conditionalFields: [
        {
            optionValue: String,
            fields: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Field"
                }
            ]
        }
    ]
}, { timestamps: true });

export const Field = mongoose.model("Field", fieldSchema);
