import mongoose from 'mongoose';
import 'dotenv/config';
const mongoURI = process.env.MONGODB_URI;
if (!mongoURI) {
    throw new Error('MONGODB_URI is not defined in environment variables');
}
export const connectDB = async () => {
    try {
        await mongoose.connect(mongoURI);
        console.log('Database connected');
    }
    catch (error) {
        console.error('Database connection error:', error);
        process.exit(1); // Exit process with failure
    }
};
