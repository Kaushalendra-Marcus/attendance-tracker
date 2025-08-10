"use client";
import { useUser } from "@/app/context/useContext";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus, FiSave, FiChevronDown, FiTrash2 } from "react-icons/fi";
import { Navigation } from "@/components/navigation";
import Footer from "@/components/footer";

type Subject = {
    name: string;
    type: string;
};

type DaySchedule = {
    day: string;
    subjects: Subject[];
};

type TimetableData = Record<string, Subject[]>;

type ApiResponse = {
    success: boolean;
    data?: {
        days: DaySchedule[];
    };
};

const Page = () => {
    const [selectedDay, setSelectedDay] = useState("");
    const [timetable, setTimetable] = useState<TimetableData>({});
    const [message, setMessage] = useState({ text: "", type: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const { rollNo, branch } = useUser();

    // 1. Fetch timetable on load
    useEffect(() => {
        const fetchTimetable = async () => {
            try {
                const res = await fetch(`/api/timetable?rollNo=${rollNo}&branch=${branch}`);
                const data: ApiResponse = await res.json();

                if (data.success && data.data) {
                    // Convert array of days to object format
                    const timetableData = data.data.days.reduce((acc: TimetableData, day: DaySchedule) => {
                        acc[day.day] = day.subjects;
                        return acc;
                    }, {});

                    setTimetable(timetableData);
                }
            } catch (error) {
                setMessage({ text: "Failed to load timetable", type: "error" });
            } finally {
                setIsLoading(false);
            }
        };

        if (rollNo && branch) fetchTimetable();
    }, [rollNo, branch]);

    const handleDayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const day = e.target.value;
        setSelectedDay(day);

        // Initialize empty array if day doesn't exist
        if (!timetable[day]) {
            setTimetable(prev => ({
                ...prev,
                [day]: [{ name: "", type: "subject" }]
            }));
        }
    };

    // 2. Modify only selected day's data
    const handlePeriodChange = (index: number, field: keyof Subject, value: string) => {
        setTimetable(prev => ({
            ...prev,
            [selectedDay]: prev[selectedDay].map((period, i) =>
                i === index ? { ...period, [field]: value } : period
            )
        }));
    };

    const handleAddPeriod = () => {
        setTimetable(prev => ({
            ...prev,
            [selectedDay]: [...(prev[selectedDay] || []), { name: "", type: "subject" }]
        }));
    };

    const handleRemovePeriod = (index: number) => {
        setTimetable(prev => {
            const updatedPeriods = prev[selectedDay].filter((_, i) => i !== index);
            return {
                ...prev,
                [selectedDay]: updatedPeriods.length ? updatedPeriods : undefined
            } as TimetableData;
        });
    };

    // 3. Submit complete timetable
    const handleSubmit = async () => {
  setIsSubmitting(true);
  try {
    // 1. ensure day is valid & has subjects
    const days = Object.entries(timetable)
      .filter(([day, subjects]) => day && subjects?.length)     // <-- here
      .map(([day, subjects]) => ({
        day: day.toLowerCase(),                                // force lowercase
        subjects: subjects.filter(s => s.name.trim())
      }))
      .filter(d => ["monday","tuesday","wednesday","thursday","friday","saturday"].includes(d.day));

    if (!days.length) {
      setMessage({ text: "Please add at least one valid day", type: "error" });
      setIsSubmitting(false);
      return;
    }

    const res = await fetch("/api/timetable/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rollNo, branch, days }),
    });

    if (!res.ok) throw new Error("Failed to update");
    setMessage({ text: "Timetable updated!", type: "success" });
  } catch {
    setMessage({ text: "Update failed", type: "error" });
  } finally {
    setIsSubmitting(false);
  }
};

 return (
    <div>
    <div className="min-h-screen relative overflow-hidden bg-black">
      <div className="absolute inset-0">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:50px_50px]" />
            </div>

            {[...Array(50)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute rounded-full"
                    initial={{
                        x: Math.random() * 100,
                        y: Math.random() * 100,
                        width: Math.random() * 10 + 1,
                        height: Math.random() * 10 + 1,
                        background: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 255, ${Math.random() * 0.5 + 0.1})`,
                        filter: `blur(${Math.random() * 2}px)`,
                    }}
                    animate={{
                        y: [null, Math.random() * 200 - 100],
                        x: [null, Math.random() * 200 - 100],
                        opacity: [0.1, 1, 0.1],
                    }}
                    transition={{
                        duration: Math.random() * 20 + 10,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "easeInOut"
                    }}
                />
            ))}

      <Navigation />
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-gradient-to-br from-purple-900 via-black to-indigo-900 flex items-center justify-center z-20"
        >
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-purple-300/30"
              initial={{
                x: Math.random() * 100,
                y: Math.random() * 100,
                width: Math.random() * 4 + 2,
                height: Math.random() * 4 + 2,
              }}
              animate={{
                y: [null, Math.random() * 100 - 50],
                opacity: [0.2, 1, 0.2],
              }}
              transition={{
                duration: Math.random() * 4 + 3,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
            />
          ))}
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="relative"
          >
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="text-7xl mb-4"
            >
              🏃‍♂️
            </motion.div>
            <motion.div
              animate={{ x: [-2, 2, -2] }}
              transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
              className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-5xl opacity-60"
            >
              👨‍🏫
            </motion.div>
            <motion.h2
              animate={{ opacity: [1, 0.6, 1] }}
              transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
              className="text-white text-2xl font-bold tracking-wider drop-shadow-lg"
            >
              Escaping Professor…
            </motion.h2>
          </motion.div>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="absolute bottom-20"
          >
            <div className="w-12 h-12 rounded-full border-4 border-purple-400 border-t-transparent" />
          </motion.div>
        </motion.div>
      )}

      <main className="relative z-10 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-bold text-white mb-2">Edit Your Timetable</h1>
            <p className="text-purple-200">Set up your weekly class schedule</p>
          </motion.div>

          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-purple-800/30 backdrop-blur-sm border border-purple-700/50 rounded-xl p-6 mb-6"
          >
            {/* Day Selector */}
            <div className="mb-6">
              <label className="block text-purple-200 mb-2 font-medium">Select Day</label>
              <div className="relative">
                <select
                  value={selectedDay}
                  onChange={handleDayChange}
                  className="appearance-none bg-purple-900/40 border border-purple-700/50 text-white rounded-lg px-4 py-3 pr-10 w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select a day</option>
                  {["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"].map((d) => (
                    <option key={d} value={d}>
                      {d.charAt(0).toUpperCase() + d.slice(1)}
                    </option>
                  ))}
                </select>
                <FiChevronDown className="absolute right-3 top-3.5 text-purple-300" />
              </div>
            </div>

            {/* Periods */}
            <AnimatePresence>
              {selectedDay && timetable[selectedDay] && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4 mb-6"
                >
                  <label className="block text-purple-200 mb-2 font-medium">
                    {selectedDay.charAt(0).toUpperCase() + selectedDay.slice(1)} Schedule
                  </label>

                  {timetable[selectedDay].map((period, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end"
                    >
                      <div className="md:col-span-7">
                        <input
                          type="text"
                          placeholder="Subject/Lab Name"
                          value={period.name}
                          onChange={(e) => handlePeriodChange(index, "name", e.target.value)}
                          className="bg-purple-900/40 border border-purple-700/50 text-white rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-purple-400/70"
                        />
                      </div>
                      <div className="md:col-span-4">
                        <div className="relative">
                          <select
                            value={period.type}
                            onChange={(e) => handlePeriodChange(index, "type", e.target.value)}
                            className="appearance-none bg-purple-900/40 border border-purple-700/50 text-white rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                          >
                            <option value="subject">Subject</option>
                            <option value="lab">Lab</option>
                          </select>
                          <FiChevronDown className="absolute right-3 top-3.5 text-purple-300" />
                        </div>
                      </div>
                      <div className="md:col-span-1">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleRemovePeriod(index)}
                          className="text-red-600 hover:text-white p-2"
                        >
                          <FiTrash2 />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Add Period Button */}
            {selectedDay && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddPeriod}
                className="flex items-center gap-2 text-purple-200 hover:text-white mb-6 px-4 py-2 rounded-lg hover:bg-purple-700/30 transition-colors"
              >
                <FiPlus className="text-lg" />
                <span>Add Period</span>
              </motion.button>
            )}

            {/* Submit Button */}
            <div className="flex justify-end">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleSubmit}
                disabled={isSubmitting || !Object.keys(timetable).length}
                className="bg-white text-purple-900 hover:bg-purple-100 px-6 py-3 rounded-lg flex items-center gap-2 transition-all font-medium disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin">↻</span>
                    Creating...
                  </>
                ) : (
                  <>
                    <FiSave />
                    Edit Timetable
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>

          {/* Message Display */}
          {message.text && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-lg border ${
                message.type === "success"
                  ? "bg-green-900/40 border-green-700/50"
                  : "bg-red-900/40 border-red-700/50"
              } text-white text-center`}
            >
              {message.text}
            </motion.div>
          )}
        </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
export default Page;