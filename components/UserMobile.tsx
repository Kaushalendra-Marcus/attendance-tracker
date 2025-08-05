"use client"
import { useUser } from "@/app/context/useContext"

const UserMobile = () => {
  const { name, rollNo, branch } = useUser()
  
  return (
    <div className="w-full text-white bg-black/80 p-4 rounded-xl border-1 border-gray-800">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-8 w-8 text-purple-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-white">{name}</p>
            <p className="text-xs font-medium text-purple-200">{rollNo} • {branch}</p>
          </div>
        </div>
        
      </div>
    </div>
  )
}

export default UserMobile