import { Schema, model } from 'mongoose';
const categorySchema = new Schema({
    title: {
        type: String,
        trim: true,
        unique: true,
        minlength: [2, 'Category title must be at least 2 characters long'],
        maxlength: [50, 'Category title must be at most 50 characters'],
        required: true,
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true,
    },
}, { timestamps: true });
export const Category = model('Category', categorySchema);
