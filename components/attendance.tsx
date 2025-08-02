// "use client"
// export const TimetableForDay = ({ selectedDate, timetableData }) => {
//     const day = selectedDate.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();
//     const dayTimetable = timetableData[day] || [];

//     return (
//         <div>
//             <h2 className="text-xl font-bold mb-4">Attendance for {selectedDate.toDateString()}</h2>
//             {dayTimetable.length === 0 ? (
//                 <div>No timetable found for this day.</div>
//             ) : (
//                 <form className="space-y-4">
//                     {dayTimetable.map((item, index) => (
//                         <div key={index} className="flex justify-between items-center border-b pb-2">
//                             <div>
//                                 <p className="font-medium">{item.name}</p>
//                                 <p className="text-sm text-gray-500">{item.type}</p>
//                             </div>
//                             <select name={`present-${index}`} className="border p-1 rounded">
//                                 <option value="true">Present</option>
//                                 <option value="false">Absent</option>
//                             </select>
//                         </div>
//                     ))}
//                     <button type="submit" className="mt-4 bg-green-600 text-white px-4 py-2 rounded">Save Attendance</button>
//                 </form>
//             )}
//         </div>
//     );
// };
