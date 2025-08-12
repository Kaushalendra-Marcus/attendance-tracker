"use client";
import { useState, ChangeEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSend, FiPaperclip } from "react-icons/fi";

export default function FeedbackPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [feedback, setFeedback] = useState("");
    const [message, setMessage] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [isSending, setIsSending] = useState(false);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFile(e.target.files?.[0] || null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSending(true);
        setMessage("Sending...");

        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('email', email);
            formData.append('feedback', feedback);
            if (file) {
                formData.append('file', file);
            }

            const res = await fetch("/api/feedback", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();
            setMessage(data.message || "Thank you for your feedback!");
            
            if (res.ok) {
                setName("");
                setEmail("");
                setFeedback("");
                setFile(null)
            }
        } catch (error) {
            setMessage("Failed to send feedback");
            console.log(error);
            
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="pt-2 pb-4 relative overflow-hidden">
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:50px_50px]" />
            </div>
            <div className="absolute inset-0">
                <motion.div className="absolute inset-0"
                    animate={{
                        background: [
                            'radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%',
                            'radial-gradient(circle at 80% 50%, rgba(255, 119, 198, 0.3) 0%, transparent 50%)',
                            'radial-gradient(circle at 50% 20%, rgba(120, 119, 255, 0.3) 0%, transparent 50%)',
                        ]
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "linear"
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black/50 to-indigo-900/20" />
            </div>
            <main className="relative z-10 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-lg"
                >
                    <h1 className="text-3xl font-bold text-white mb-6 text-center tracking-widest">
                        Feedback
                    </h1>
                    <form
                        onSubmit={handleSubmit}
                        className="bg-gray-900/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 space-y-6"
                    >
                        <div>
                            <label className="block text-xs text-gray-400 mb-1">Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter your name"
                                required
                                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-400"
                            />
                        </div>

                        <div>
                            <label className="block text-xs text-gray-400 mb-1">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@gmail.com"
                                required
                                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-400"
                            />
                        </div>

                        <div>
                            <label className="block text-xs text-gray-400 mb-1">Feedback</label>
                            <textarea
                                rows={4}
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                placeholder="Your feedback shapes our future updates - what features would you love to see next?"
                                required
                                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-400 resize-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-400 mb-1">
                                Attachment (optional)
                            </label>
                            <label className="flex items-center justify-center w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg cursor-pointer hover:bg-gray-800/70">
                                <FiPaperclip className="mr-2" />
                                {file ? file.name : "Choose a file"}
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                            </label>
                            {file && (
                                <button
                                    type="button"
                                    onClick={() => setFile(null)}
                                    className="mt-2 text-xs text-red-400 hover:text-red-300"
                                >
                                    Remove file
                                </button>
                            )}
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            disabled={isSending}
                            className="w-full bg-purple-700/20 border border-purple-600/30 text-white py-3 rounded-lg font-medium hover:bg-purple-700/60 transition flex items-center justify-center"
                        >
                            {isSending ? (
                                <span className="animate-spin">↻</span>
                            ) : (
                                <>
                                    <FiSend className="inline mr-2" />
                                    Submit
                                </>
                            )}
                        </motion.button>

                        <AnimatePresence>
                            {message && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className={`text-center text-sm ${message.includes("Thank")
                                        ? "text-red-400"
                                        : "text-green-400"
                                        }`}
                                >
                                    {message}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </form>
                </motion.div>
            </main>
        </div>
    );
}