"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const mongoose_1 = require("mongoose");
const productSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true,
    },
    category: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Category', required: true },
    image: {
        type: String,
        default: 'public/images/productsImages/default.webp',
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    quantity: {
        type: Number,
        default: 1,
        require: true,
    },
    sold: {
        type: Number,
        default: 0,
    },
    shipping: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });
exports.Product = (0, mongoose_1.model)('Product', productSchema);
exports.default = exports.Product;
