import ApiError from '../errors/ApiError.js';
// const apiErrorHandler = (err: typeof ApiError, req: Request, res: Response, next: NextFunction) => {
//   if (err instanceof ApiError) {
//     res.status(err.code).json({ msg: err.message })
//     return
//   }
//   res.status(500).json({ msg: 'Something went wrong.' })
// }
const apiErrorHandler = (err, req, res, next) => {
    let error = err;
    if (!(err instanceof ApiError)) {
        error = ApiError.internal('Something went wrong.');
    }
    const { status = 500, message, data } = error;
    res.status(status).json({ msg: message, data });
};
export default apiErrorHandler;
