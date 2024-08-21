"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ApiError {
    constructor(code, message) {
        this.code = code;
        this.message = message;
        this.code = code;
        this.message = message;
    }
    static badRequest(msg) {
        return new ApiError(400, msg);
    }
    static notFound(msg) {
        return new ApiError(404, msg);
    }
    static exist(msg) {
        return new ApiError(409, msg);
    }
    static unauthorized(msg) {
        return new ApiError(401, msg);
    }
    static internal(msg) {
        return new ApiError(500, msg);
    }
}
exports.default = ApiError;
