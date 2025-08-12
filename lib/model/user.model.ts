import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    rollno: { type: String, required: true },
    password: { type: String, required: true },
    branch: {
        type: String, requrired: true, enum: [
            "Civil Engineering",
            "Mechanical Engineering",
            "Electrical Engineering",
            "Electronics and Telecommunication Engineering",
            "Computer Science and Engineering",
            "Information Technology",
            "Biochemical Engineering",
            "Food Technology",
            "Plastic Technology",
            "Leather Technology",
            "Oil Technology",
            "Paint Technology",
            "Chemical Engineering",
            "Basic Sciences"
        ]
    }
})
const User = mongoose.models.UsersDetails || mongoose.model('UsersDetails', userSchema)

export default User