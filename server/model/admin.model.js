import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 3,
            maxlength: 50,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        password: {
            type: String,
            required: true,
            select: false,
            minlength: 6,
        },

        formIds: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Form",
            },
        ],
    },
    {
        timestamps: true,
    }
);

export const Admin = mongoose.model("Admin", adminSchema);
