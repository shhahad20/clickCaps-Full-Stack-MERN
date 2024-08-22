import ApiError from '../errors/ApiError';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import User from '../models/userSchema.js';
// export const isLoggenIn = async (req: CustomRequest, res: Response, next: NextFunction) => {
//   try {
//     const accessToken = req.cookies.access_token
//     console.log(accessToken)
//     if (!accessToken) {
//       throw ApiError.unauthorized('Plesae Login first')
//     }
//     const decoded = (await jwt.verify(accessToken, process.env.ACCESS_KEY)) as JwtPayload
//     if (!decoded) {
//       throw ApiError.unauthorized('Invaild access token')
//     }
//     req.userId = decoded._id
//     next()
//   } catch (error) {
//     next(error)
//   }
// }
export const isLoggenIn = async (req, res, next) => {
    try {
        const accessToken = req.cookies.access_token;
        if (!accessToken) {
            throw ApiError.unauthorized('Plesae Login first');
        }
        // Check if the ACCESS_KEY environment variable is defined
        if (process.env.ACCESS_KEY) {
            const decoded = (await jwt.verify(accessToken, process.env.ACCESS_KEY));
            if (!decoded) {
                throw ApiError.unauthorized('Invaild access token');
            }
            req.userId = decoded._id;
            next();
        }
        else {
            throw ApiError.internal('ACCESS_KEY environment variable is not defined');
        }
    }
    catch (error) {
        next(error);
    }
};
export const isLoggedOut = async (req, res, next) => {
    try {
        const accessToken = req.cookies.access_token;
        if (accessToken) {
            throw ApiError.unauthorized('You are already Logged in');
        }
        next();
    }
    catch (error) {
        next(error);
    }
};
export const isAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId);
        if (user && user.isAdmin) {
            next();
        }
        else {
            const error = new ApiError(403, `You are not an admin.`);
            throw error;
        }
    }
    catch (error) {
        next(error);
    }
};
