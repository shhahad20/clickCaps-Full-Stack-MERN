"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Category = void 0;
const mongoose_1 = require("mongoose");
const categorySchema = new mongoose_1.Schema({
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
exports.Category = (0, mongoose_1.model)('Category', categorySchema);
