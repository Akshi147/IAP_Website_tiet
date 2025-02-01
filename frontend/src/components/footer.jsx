import { Facebook, Twitter, Linkedin, Youtube } from "lucide-react"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"

export function Footer() {
  return (
    <footer className="bg-background border-t py-12">
      <div className="container mx-auto px-4 grid md:grid-cols-4 gap-8">
        <div>
          <h3 className="font-semibold mb-4">About TIET</h3>
          <p className="text-sm text-muted-foreground">
            Thapar Institute of Engineering and Technology has consistently been a pioneer in engineering education,
            research and innovation.
          </p>
          <div className="flex gap-4 mt-4">
            <Facebook className="w-5 h-5" />
            <Twitter className="w-5 h-5" />
            <Linkedin className="w-5 h-5" />
            <Youtube className="w-5 h-5" />
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-4">Quick Links</h3>
          <div className="space-y-2">
            <p className="text-sm">About IAP Cell</p>
            <p className="text-sm">Academic Calendar</p>
            <p className="text-sm">Resources</p>
            <p className="text-sm">FAQs</p>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-4">Contact Info</h3>
          <div className="space-y-2">
            <p className="text-sm">Patiala, Punjab 147004, India</p>
            <p className="text-sm">+91-175-2393021</p>
            <p className="text-sm">info@thapar.edu</p>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-4">Newsletter</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Subscribe to our newsletter for updates and announcements.
          </p>
          <div className="flex gap-2">
            <Input placeholder="Enter your email" />
            <Button>Subscribe</Button>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
        © 2025 Thapar Institute of Engineering and Technology. All rights reserved.
      </div>
    </footer>
  )
}

