import mongoose from "mongoose";
let isConnected = false;
export const connectToDB = async () => {
    mongoose.set('strictQuery', true)
    
    if (!process.env.MONGODB_URL) {
        throw new Error("MongoDB URL is missing in environment variables");
    }
    if (isConnected) {
        console.log("Mogodb is already connected");
        return;
    }
    try {
        await mongoose.connect(process.env.MONGODB_URL)
        isConnected = true;
        console.log("Mongodb is connected");
    } catch (error: any) {
        console.log(error);
    }
}
