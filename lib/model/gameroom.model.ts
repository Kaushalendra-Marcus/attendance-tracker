import mongoose from "mongoose"

const playerSchema = new mongoose.Schema({
    rollNo: { type: String, required: true },
    name: { type: String, required: true },
    score: { type: Number, default: 0 },
    answeredIds: { type: [Number], default: [] },
    lastSeen: { type: Date, default: Date.now },
})

const questionSchema = new mongoose.Schema({
    id: Number,
    question: String,
    options: [String],
    answer: String,
    tags: [String],
})

const gameRoomSchema = new mongoose.Schema({
    roomCode: { type: String, required: true, unique: true },
    status: { type: String, enum: ["waiting", "playing", "finished"], default: "waiting" },
    tags: { type: [String], default: [] },
    questions: [questionSchema],
    currentQuestion: { type: Number, default: 0 },
    questionStartedAt: { type: Date },
    players: [playerSchema],
    createdAt: { type: Date, default: Date.now },
})

const GameRoom = mongoose.models.GameRoom || mongoose.model("GameRoom", gameRoomSchema)
export default GameRoom
