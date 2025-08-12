"use client"
import { useUser } from "@/app/context/useContext"
import Feedback from "@/components/feedback"
import Footer from "@/components/footer"
import { Navigation } from "@/components/navigation"

const page = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Feedback />
      <Footer />
    </div>
  )
}

export default page
