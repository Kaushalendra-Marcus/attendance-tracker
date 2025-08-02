import mongoose, { Schema } from "mongoose";
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    rollno: { type: String, required: true },
    password: { type: String, required: true },
    branch: { type: String, requrired: true, enum: ['CS', 'ME', 'EE', 'IT'] }
})
const User = mongoose.models.UsersDetails || mongoose.model('UsersDetails', userSchema)

export default User