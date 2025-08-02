"use client";
import { Subjects } from "../constants/subjects/index";
import { useState } from "react";
import { useUser } from "@/app/context/useContext";

const Sheet = () => {
  const [present, setPresent] = useState<{ [key: number]: "P" | "A" }>({});
  const [labPresent, setLabPresent] = useState<{ [key: number]: "P" | "A" }>({});
  const [rotated, setRotated] = useState<{ [key: number]: boolean }>({});
  const [labRotated, setLabRotated] = useState<{ [key: number]: boolean }>({});
  const { branch } = useUser();

  const handleSubjectClick = (index: number) => {
    setPresent((prev) => ({
      ...prev,
      [index]: prev[index] === "P" ? "A" : "P",
    }));
    console.log(present);
    setRotated((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleLabClick = (index: number) => {
    setLabPresent((prev) => ({
      ...prev,
      [index]: prev[index] === "P" ? "A" : "P",
    }));
    setLabRotated((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // Calculate totals
  const totalSubjectsPresent = Object.values(present).filter(v => v === "P").length;
  const totalLabsPresent = Object.values(labPresent).filter(v => v === "P").length;
  const totalClassesPresent = totalSubjectsPresent + (totalLabsPresent * 2); // Labs count as 2 classes
  const totalSubjects = Subjects.find(sub => sub.branch === branch)?.subjects.length || 0;
  const totalLabs = Subjects.find(sub => sub.branch === branch)?.lab.length || 0;
  const totalClasses = totalSubjects + (totalLabs * 2);

  return (
    <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden border border-white/20">
      {Subjects.map((value) =>
        value.branch === branch ? (
          <div key={value.branch} className="p-8">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-white mb-1">Attendance Tracker</h1>
              <p className="text-white/80">Mark your daily attendance</p>
            </div>

            {/* Subjects Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-white mb-3 border-b border-white/10 pb-2">Theory Subjects</h3>
              <div className="space-y-3">
                {value.subjects.map((sub, index) => (
                  <div
                    key={`sub-${index}`}
                    className="flex justify-between items-center p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors duration-200"
                  >
                    <div>
                      <span className="font-medium text-white block">{sub}</span>
                      <span className="text-xs text-white/60">Theory</span>
                    </div>
                    
                    <button
                      className={`
                        rounded-full w-12 h-12 flex items-center justify-center text-white 
                        transition-all duration-500 transform preserve-3d
                        ${present[index] === "P" ? "bg-green-500/90" : "bg-red-500/90"}
                        ${rotated[index] ? "rotate-y-180" : ""}
                        hover:shadow-lg
                      `}
                      onClick={() => handleSubjectClick(index)}
                    >
                      <span className={`${rotated[index] ? 'hidden' : 'block'}`}>
                        {present[index] || "A"}
                      </span>
                      <span className={`${rotated[index] ? 'block' : 'hidden'} transform rotate-y-180`}>
                        {present[index] === "P" ? "A" : "P"}
                      </span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Labs Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-white mb-3 border-b border-white/10 pb-2">Lab Sessions</h3>
              <p className="text-sm text-white/60 mb-3">Note: Each lab session counts as 2 classes</p>
              <div className="space-y-3">
                {value.lab.map((lab, index) => (
                  <div
                    key={`lab-${index}`}
                    className="flex justify-between items-center p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors duration-200"
                  >
                    <div>
                      <span className="font-medium text-white block">{lab}</span>
                      <span className="text-xs text-white/60">Lab</span>
                    </div>
                    
                    <button
                      className={`
                        rounded-full w-12 h-12 flex items-center justify-center text-white 
                        transition-all duration-500 transform preserve-3d
                        ${labPresent[index] === "P" ? "bg-green-500/90" : "bg-red-500/90"}
                        ${labRotated[index] ? "rotate-y-180" : ""}
                        hover:shadow-lg
                      `}
                      onClick={() => handleLabClick(index)}
                    >
                      <span className={`${labRotated[index] ? 'hidden' : 'block'}`}>
                        {labPresent[index] || "A"}
                      </span>
                      <span className={`${labRotated[index] ? 'block' : 'hidden'} transform rotate-y-180`}>
                        {labPresent[index] === "P" ? "A" : "P"}
                      </span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary Section */}
            <div className="mt-6 pt-4 border-t border-white/10">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                  <p className="text-xs text-white/60 mb-1">Theory Classes</p>
                  <p className="font-medium text-white">
                    {totalSubjectsPresent} / {totalSubjects}
                  </p>
                </div>
                <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                  <p className="text-xs text-white/60 mb-1">Lab Classes (×2)</p>
                  <p className="font-medium text-white">
                    {totalLabsPresent} / {totalLabs}
                  </p>
                </div>
              </div>

              <div className="mb-2 flex justify-between text-sm text-white/80">
                <span>Total Classes Attended: {totalClassesPresent}</span>
                <span>Total Classes: {totalClasses}</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2.5 mb-2">
                <div
                  className="bg-gradient-to-r from-purple-500 to-purple-600 h-2.5 rounded-full"
                  style={{
                    width: `${Math.min(100, (totalClassesPresent / totalClasses) * 100)}%`
                  }}
                ></div>
              </div>
              <div className="text-right">
                <span className="text-sm font-medium text-white">
                  {Math.round((totalClassesPresent / totalClasses) * 100)}% Attendance
                </span>
              </div>
            </div>
          </div>
        ) : null
      )}
    </div>
  );
};

export default Sheet;