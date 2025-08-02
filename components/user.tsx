"use client"
import { useUser } from "@/app/context/useContext"
import Link from "next/link"

const User = () => {
  const { name, rollNo, branch } = useUser()
  
  if (!name) {
    return (
      <Link 
        href="/sign-in" 
        className="text-sm font-medium text-purple-200 hover:text-white px-3 py-2 rounded-md"
      >
        Sign In
      </Link>
    )
  }

  return (
    <div className="flex items-center space-x-4">
      <div className="flex-shrink-0">
        <div className="h-10 w-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-medium">
          {name.charAt(0).toUpperCase()}
        </div>
      </div>
      <div className="text-left">
        <p className="text-sm font-medium text-white">{name}</p>
        <p className="text-xs text-purple-200">
          {rollNo && `${rollNo} • `}{branch || 'Student'}
        </p>
      </div>
    </div>
  )
}

export default User