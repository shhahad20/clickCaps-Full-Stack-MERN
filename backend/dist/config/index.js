"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dev = void 0;
require("dotenv/config");
exports.dev = {
    app: { port: Number(process.env.PORT) || 3002 },
    db: {
        url: process.env.MOGODB_URL
    },
};
