import fs from 'fs';
const myLogger = (req, res, next) => {
    const filePath = './src/logs/requests.txt';
    const currentDate = new Date();
    const date = currentDate.toLocaleDateString();
    const time = currentDate.toLocaleTimeString();
    const msg = `Method: ${req.method}, Path: ${req.path}, Date: ${date}, Time: ${time}\n`;
    fs.appendFile(filePath, msg, (err) => {
        if (err) {
            return next(new Error('FAILED TO LOG'));
        }
        next();
    });
};
export default myLogger;
