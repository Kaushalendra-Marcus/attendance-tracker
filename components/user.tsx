"use client"
import { useUser } from "@/app/context/useContext"
import Link from "next/link"

const User = () => {
  const { name, rollNo, branch } = useUser()

  if (!name) {
    return (
      <Link
        href="/sign-in"
        className="w-full text-left mt-4 text-sm font-semibold bg-black/80 text-white hover:text-white px-4 py-2 rounded-xl border border-gray-800 hover:bg-gradient-to-br from-purple-600/40 to-indigo-500/40 transition-all duration-300"

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