import mongoose from "mongoose";

const formSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    fields: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Field"
        }
    ],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin",
        required: true
    },
}, { timestamps: true });

export const Form = mongoose.model("Form", formSchema);
