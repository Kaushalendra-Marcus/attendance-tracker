import mongoose from "mongoose";
const timeTableSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    days: [{
        day: {
            type: String,
            enum: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
        },
        subjects: [{
            name: { type: String, required: true },
            type: { type: String, enum: ["subject", "lab"], default: "subject" },
        }]
    }],

})
const TimeTable = mongoose.models.TimeTable || mongoose.model("TimeTable", timeTableSchema)
export default TimeTable