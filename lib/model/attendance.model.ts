import mongoose from "mongoose";
import User from "./user.model";
const attendaceSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    day: {
        type: String, // monday,tuesday
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    records: [{
        name: { type: String, required: true },
        type: { type: String, required: true, enum: ["subject", "lab"] },
        isPresent: { type: Boolean, required: true },
    }]
})
const Attendace = mongoose.models.attendance || mongoose.model('Attendance', attendaceSchema)
export default Attendace;