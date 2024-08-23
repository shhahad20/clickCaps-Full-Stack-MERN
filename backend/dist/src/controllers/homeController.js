import ApiError from '../errors/ApiError.js';
export const home = async (req, res, next) => {
    try {
        res.status(200).json({
            message: `Hello there`,
        });
    }
    catch (error) {
        next(ApiError.internal('Something went bad.'));
    }
};
