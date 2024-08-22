import ApiError from '../errors/ApiError.js';
export const home = async (req, res, next) => {
    console.log("Hi ctrl");
    try {
        console.log("Hi");
        res.status(200).json({
            message: `Hello there`,
        });
    }
    catch (error) {
        console.log("I'm error from ctrl");
        next(ApiError.internal('Something went bad.'));
    }
};
