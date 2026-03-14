import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name:     { type: String, required: true, trim: true },
  rollno:   { type: String, required: true, trim: true },
  password: { type: String, required: true },
  branch:   { type: String, required: true, trim: true },
  year:     { type: String, required: false, trim: true, default: "" },
  college:  { type: String, required: false, trim: true, default: "" },
}, { timestamps: true });


userSchema.index({ rollno: 1, college: 1 }, { unique: true });

const User = mongoose.models.UsersDetails || mongoose.model("UsersDetails", userSchema);
export default User;
