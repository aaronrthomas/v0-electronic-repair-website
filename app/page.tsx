import Link from "next/link"
import { MapPin, Search, Smartphone, Laptop, Tv, Headphones, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { AuthStatus } from "@/components/auth-status"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between py-4">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <Tv className="h-6 w-6" />
            <span>ElectroFix</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="/" className="text-sm font-medium">
              Home
            </Link>
            <Link href="/technicians" className="text-sm font-medium">
              Find Technicians
            </Link>
            <Link href="/about" className="text-sm font-medium">
              About Us
            </Link>
            <Link href="/contact" className="text-sm font-medium">
              Contact
            </Link>
            <Link href="/consultation" className="text-sm font-medium">
              Consultation Booth
            </Link>
          </nav>
          <AuthStatus />
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Find Expert Electronic Repair Services Near You
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                  Connect with skilled technicians who can fix your devices quickly and affordably.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    type="search"
                    placeholder="Search by device or issue..."
                    className="w-full bg-white pl-8 rounded-lg border border-gray-300"
                  />
                </div>
                <Button className="w-full" type="submit">
                  <MapPin className="mr-2 h-4 w-4" />
                  Find Nearby Technicians
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">What Do You Need Fixed?</h2>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">Browse technicians by device category</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mt-8">
                <Link href="/technicians?category=smartphone">
                  <Card className="cursor-pointer hover:bg-gray-50 transition-colors">
                    <CardContent className="flex flex-col items-center justify-center p-6">
                      <Smartphone className="h-12 w-12 mb-4 text-gray-700" />
                      <h3 className="text-lg font-medium">Smartphones</h3>
                    </CardContent>
                  </Card>
                </Link>
                <Link href="/technicians?category=laptop">
                  <Card className="cursor-pointer hover:bg-gray-50 transition-colors">
                    <CardContent className="flex flex-col items-center justify-center p-6">
                      <Laptop className="h-12 w-12 mb-4 text-gray-700" />
                      <h3 className="text-lg font-medium">Computers</h3>
                    </CardContent>
                  </Card>
                </Link>
                <Link href="/technicians?category=tv">
                  <Card className="cursor-pointer hover:bg-gray-50 transition-colors">
                    <CardContent className="flex flex-col items-center justify-center p-6">
                      <Tv className="h-12 w-12 mb-4 text-gray-700" />
                      <h3 className="text-lg font-medium">TVs</h3>
                    </CardContent>
                  </Card>
                </Link>
                <Link href="/technicians?category=audio">
                  <Card className="cursor-pointer hover:bg-gray-50 transition-colors">
                    <CardContent className="flex flex-col items-center justify-center p-6">
                      <Headphones className="h-12 w-12 mb-4 text-gray-700" />
                      <h3 className="text-lg font-medium">Audio</h3>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">How It Works</h2>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                  Get your electronics fixed in three simple steps
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                <div className="flex flex-col items-center space-y-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200">
                    <span className="text-xl font-bold">1</span>
                  </div>
                  <h3 className="text-xl font-bold">Search</h3>
                  <p className="text-gray-500">Find technicians near you who specialize in your device type</p>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200">
                    <span className="text-xl font-bold">2</span>
                  </div>
                  <h3 className="text-xl font-bold">Connect</h3>
                  <p className="text-gray-500">Contact technicians directly to discuss your repair needs</p>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200">
                    <span className="text-xl font-bold">3</span>
                  </div>
                  <h3 className="text-xl font-bold">Get Fixed</h3>
                  <p className="text-gray-500">Schedule a repair and get your device working again</p>
                </div>
              </div>
              <div className="mt-8">
                <Link href="/consultation">
                  <Button size="lg" className="gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Try Our Virtual Consultation Booth
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t bg-gray-50">
        <div className="container flex flex-col gap-4 py-10 md:flex-row md:gap-8">
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-2 font-bold text-xl">
              <Tv className="h-6 w-6" />
              <span>ElectroFix</span>
            </div>
            <p className="text-sm text-gray-500">
              Connecting you with expert technicians for all your electronic repair needs.
            </p>
          </div>
          <div className="flex flex-col md:flex-row gap-8 md:gap-12">
            <div className="space-y-2">
              <h4 className="font-medium">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/about" className="text-gray-500 hover:text-gray-900">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-500 hover:text-gray-900">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="text-gray-500 hover:text-gray-900">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/privacy" className="text-gray-500 hover:text-gray-900">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-gray-500 hover:text-gray-900">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="border-t py-6">
          <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-xs text-gray-500">© 2024 ElectroFix. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
