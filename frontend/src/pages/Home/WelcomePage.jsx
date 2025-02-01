import { Header } from "../../components/header"
import { Hero } from "../../components/hero"
import { Panels } from "../../components/panels"
import { Footer } from "../../components/footer"

export default function App() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <main className="w-full px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-2">6 MONTH PROJECT SEMESTER</h1>
        <p className="text-center text-muted-foreground mb-12">Welcome to online module for evaluation</p>
        <Panels />
      </main>
      <Footer />
    </div>
  )
}
