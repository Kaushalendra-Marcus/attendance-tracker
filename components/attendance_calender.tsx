// // components/AttendanceCalendar.jsx
// "use client";
// import { useState } from "react";

// const AttendanceCalendar = ({ timetableData }) => {
//   const [selectedDate, setSelectedDate] = useState(null);

//   const dates = Array.from({ length: 30 }, (_, i) => {
//     const date = new Date();
//     date.setDate(date.getDate() - i);
//     return date;
//   });

//   return (
//     <div className="flex gap-4">
//       {/* Date List */}
//       <div className="w-1/4 border-r pr-4 h-screen overflow-y-auto">
//         <h2 className="text-xl font-semibold mb-2">Select a Date</h2>
//         {dates.map((d, index) => (
//           <div
//             key={index}
//             className={`p-2 cursor-pointer rounded ${selectedDate?.toDateString() === d.toDateString() ? "bg-blue-200" : ""}`}
//             onClick={() => setSelectedDate(d)}
//           >
//             {d.toDateString()}
//           </div>
//         ))}
//       </div>

//       {/* Timetable */}
//       <div className="w-3/4">
//         {selectedDate ? (
//           <TimetableForDay selectedDate={selectedDate} timetableData={timetableData} />
//         ) : (
//           <div className="text-gray-500">Please select a date to mark attendance.</div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AttendanceCalendar;
