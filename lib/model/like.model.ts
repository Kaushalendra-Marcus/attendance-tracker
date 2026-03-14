import mongoose from "mongoose"

const likeSchema = new mongoose.Schema({
    fromRollNo: { type: String, required: true },
    fromName: { type: String, required: true },
    toRollNo: { type: String, required: true },
    toName: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
})

// One person can like another only once
likeSchema.index({ fromRollNo: 1, toRollNo: 1 }, { unique: true })

const Like = mongoose.models.Like || mongoose.model("Like", likeSchema)
export default Like
