"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MdFeedback } from "react-icons/md";
import Link from "next/link";

const FeedbackBubble = () => {
    const [show, setShow] = useState(false);

    useEffect(() => {
        const t1 = setTimeout(() => setShow(true), 3000);
        return () => clearTimeout(t1);
    }, []);

    return (
        <div>
            { show && (
                    <Link href="/feedback">
                        <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="fixed bottom-4 right-4 z-50 w-10 h-10 lg:w-14 lg:h-14 bg-gray-900/90 hover:scale-75 backdrop-blur-sm border border-gray-700 rounded-full flex items-center justify-center text-gray-200 shadow-lg shadow-black/50 cursor-pointer"
                        >
                            <MdFeedback className="text-lg text-red-600" />
                        </motion.div>
                    </Link>
                )
            }
        </div>
    );
};

export default FeedbackBubble;