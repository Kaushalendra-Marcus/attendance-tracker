import Footer from "@/components/footer";
import { Hero } from "@/components/hero";
import { Navigation } from "@/components/navigation";


export default function Home() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <Footer />
    </div>
  )
}