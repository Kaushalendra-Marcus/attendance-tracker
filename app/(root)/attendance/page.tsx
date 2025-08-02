"use client"

import { useUser } from "@/app/context/useContext"
import { useEffect, useState } from "react"
import Calendar from "react-calendar"

const AttendanceMarker = () => {
    const [showCalander, setShowCalander] = useState(false)
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date)
    const [dayName, setDayName] = useState("")
    const [subjects, setSubjects] = useState([])
    const [labs, setLabs] = useState([])
    const { rollNo, branch } = useUser()

    const handleDateChange = (date: any) => {
        setSelectedDate(date)
        setShowCalander(false)
        const Name = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()
        setDayName(Name) // e.g., "monday"
    }

    useEffect(() => {
        if (!rollNo || !branch || !dayName) return;

        const fetchTimeTable = async () => {
            try {
                const res = await fetch(`/api/timetable?rollNo=${rollNo}&branch=${branch}`)
                if (!res.ok) throw new Error("Not Found")

                const data = await res.json()
                console.log(data);
                

                // 🔍 Find day object from data.days array
                const dayObj = data.data.days.find((d: any) => d.day.toLowerCase() === dayName)
                console.log(dayObj);
                

                if (dayObj) {
                    // 🎯 Separate subjects and labs
                    const allSubjects = dayObj.subjects || []
                    const onlySubjects = allSubjects.filter((item: any) => item.type === "subject")
                    const onlyLabs = allSubjects.filter((item: any) => item.type === "lab")

                    setSubjects(onlySubjects)
                    setLabs(onlyLabs)
                } else {
                    setSubjects([])
                    setLabs([])
                }
            } catch (err) {
                console.error("Failed to fetch timetable:", err)
            }
        }

        fetchTimeTable()
    }, [rollNo, branch, dayName]) // <- dayName added

    return (
        <div>
            <div>
                <button onClick={() => setShowCalander(!showCalander)}>
                    {selectedDate ? selectedDate.toDateString() : "Select Date"}
                </button>
                {showCalander && (
                    <div>
                        <Calendar onChange={handleDateChange} value={selectedDate} />
                    </div>
                )}
            </div>

            <div className="mt-4">
                <h3 className="font-bold">Subjects for {dayName}:</h3>
                <ul>
                    {subjects.map((sub: any, idx: number) => (
                        <li key={idx}>📘 {sub.name}</li>
                    ))}
                </ul>

                <h3 className="font-bold mt-2">Labs:</h3>
                <ul>
                    {labs.map((lab: any, idx: number) => (
                        <li key={idx}>🔬 {lab.name}</li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default AttendanceMarker
