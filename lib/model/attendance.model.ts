import mongoose from "mongoose";
import User from "./user.model";
const attendaceSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    date: {
        type: String,
        required : true
    },
    records: [{
        name: { type: String, required: true },
        type: { type: String, required: true, enum: ["subject", "lab"] },
        isPresent: { type: Boolean, required: true },
    }]
})
const Attendace = mongoose.models.Attendance || mongoose.model('Attendance', attendaceSchema)
export default Attendace;