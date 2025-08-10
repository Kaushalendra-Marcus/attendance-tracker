"use client";
import { useUser } from "@/app/context/useContext";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus, FiSave, FiChevronDown, FiTrash2 } from "react-icons/fi";
import { Navigation } from "@/components/navigation";
import Footer from "@/components/footer";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Page = () => {
  const [selectedDay, setSelectedDay] = useState("");
  const [timetable, setTimetable] = useState<{ [key: string]: { name: string; type: string }[] | undefined }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { rollNo } = useUser();

  const handleDayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDay = e.target.value;
    setSelectedDay(newDay);

    if (!timetable[newDay]) {
      setTimetable((prev) => ({
        ...prev,
        [newDay]: [{ name: "", type: "subject" }],
      }));
    }
  };

  const handlePeriodChange = (index: number, field: "name" | "type", value: string) => {
    const updated = [...(timetable[selectedDay] || [])];
    updated[index][field] = value;
    setTimetable((prev) => ({
      ...prev,
      [selectedDay]: updated,
    }));
  };

  const handleAddPeriod = () => {
    const updated = [...(timetable[selectedDay] || []), { name: "", type: "subject" }];
    setTimetable((prev) => ({
      ...prev,
      [selectedDay]: updated,
    }));
  };

  const handleRemovePeriod = (index: number) => {
    const updated = [...(timetable[selectedDay] || [])];
    updated.splice(index, 1);
    setTimetable((prev) => ({
      ...prev,
      [selectedDay]: updated.length ? updated : undefined,
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const days = Object.entries(timetable)
        .filter(([subjects]) => subjects?.length)
        .map(([day, subjects]) => ({
          day,
          subjects: subjects?.filter(s => s.name.trim()) || []
        }));

      if (!days.length) {
        toast.error("Please add at least one day with subjects");
        return;
      }

      const response = await fetch("/api/timetable/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rollNo, days }),
      });

      if (!response.ok) throw new Error("Failed to create timetable");
      
      toast.success("Timetable created successfully!");
    } catch (err) {
      const error = err as Error;
      toast.error(error.message || "Failed to create timetable");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>
      
      
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-purple-900/60 via-purple-700/60 to-purple-500/60 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-bold text-white mb-2">Create Your Timetable</h1>
            <p className="text-purple-200">Set up your weekly class schedule</p>
          </motion.div>

          {/* Main Form */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-purple-800/30 backdrop-blur-sm border border-purple-700/50 rounded-xl p-6 mb-6"
          >
            {/* Day Selection */}
            <div className="mb-6">
              <label className="block text-purple-200 mb-2 font-medium">Select Day</label>
              <div className="relative">
                <select
                  value={selectedDay}
                  onChange={handleDayChange}
                  className="appearance-none bg-purple-900/40 border border-purple-700/50 text-white rounded-lg px-4 py-3 pr-10 w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select a day</option>
                  <option value="monday">Monday</option>
                  <option value="tuesday">Tuesday</option>
                  <option value="wednesday">Wednesday</option>
                  <option value="thursday">Thursday</option>
                  <option value="friday">Friday</option>
                  <option value="saturday">Saturday</option>
                </select>
                <FiChevronDown className="absolute right-3 top-3.5 text-purple-300" />
              </div>
            </div>

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
                  <span className="flex items-center gap-2">
                    <span className="animate-spin">↻</span>
                    Creating...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <FiSave />
                    Create Timetable
                  </span>
                )}
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Page;