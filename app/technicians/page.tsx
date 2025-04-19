"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { MapPin, Star, Filter, Tv, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AuthStatus } from "@/components/auth-status"
import { geocodeLocation, getNearbyTechnicians, type Coordinates } from "./location-service"

// Sample data for technicians
const technicians = [
  {
    id: 1,
    name: "Alex Johnson",
    rating: 4.8,
    reviews: 124,
    location: "Downtown",
    specialties: ["Smartphone", "Laptop", "Tablet"],
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 2,
    name: "Sarah Williams",
    rating: 4.9,
    reviews: 89,
    location: "Westside",
    specialties: ["TV", "Audio", "Gaming Console"],
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 3,
    name: "Michael Chen",
    rating: 4.7,
    reviews: 56,
    location: "Northside",
    specialties: ["Laptop", "Desktop", "Printer"],
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 4,
    name: "Jessica Lee",
    rating: 4.6,
    reviews: 42,
    location: "Eastside",
    specialties: ["Smartphone", "Tablet", "Smartwatch"],
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 5,
    name: "David Rodriguez",
    rating: 4.9,
    reviews: 112,
    location: "Southside",
    specialties: ["TV", "Home Theater", "Smart Home"],
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 6,
    name: "Emily Wilson",
    rating: 4.8,
    reviews: 78,
    location: "Midtown",
    specialties: ["Laptop", "Desktop", "Networking"],
    image: "/placeholder.svg?height=100&width=100",
  },
]

export default function TechniciansPage() {
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get("category")

  const [location, setLocation] = useState("")
  const [locationInput, setLocationInput] = useState("")
  const [userCoordinates, setUserCoordinates] = useState<Coordinates | null>(null)
  const [maxDistance, setMaxDistance] = useState(10)
  const [selectedCategories, setSelectedCategories] = useState(categoryParam ? [categoryParam] : [])
  const [filteredTechnicians, setFilteredTechnicians] = useState(technicians)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Initialize with default location and technicians
  useEffect(() => {
    // Set a default location
    const defaultLocation = "San Francisco, CA"
    setLocation(defaultLocation)

    // Get coordinates for default location
    const locationData = geocodeLocation(defaultLocation)
    setUserCoordinates(locationData.coordinates)

    // Update technicians with distance from default location
    const techsWithDistance = getNearbyTechnicians(technicians, locationData.coordinates, 100)
    setFilteredTechnicians(techsWithDistance)
  }, [])

  // Handle manual location setting
  const handleLocationInput = (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      if (!locationInput.trim()) {
        setError("Please enter a location")
        setIsLoading(false)
        return
      }

      // Get location data
      const locationData = geocodeLocation(locationInput)

      // Update state
      setLocation(locationData.address)
      setUserCoordinates(locationData.coordinates)

      // Update technicians with distance from new location
      const techsWithDistance = getNearbyTechnicians(technicians, locationData.coordinates, 100)
      setFilteredTechnicians(techsWithDistance)

      // Clear input
      setLocationInput("")
    } catch (err) {
      console.error("Error setting location:", err)
      setError("Error finding location. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Filter technicians based on selected filters
  useEffect(() => {
    if (!userCoordinates) return

    // Start with all technicians with distance
    const techsWithDistance = getNearbyTechnicians(technicians, userCoordinates, 100)

    // Apply filters
    let filtered = techsWithDistance.filter((tech) => tech.distance <= maxDistance)

    // Filter by category
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((tech) =>
        tech.specialties.some((specialty) =>
          selectedCategories.some((category) => specialty.toLowerCase().includes(category.toLowerCase())),
        ),
      )
    }

    setFilteredTechnicians(filtered)
  }, [maxDistance, selectedCategories, userCoordinates])

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) => {
      if (prev.includes(category)) {
        return prev.filter((c) => c !== category)
      } else {
        return [...prev, category]
      }
    })
  }

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
          </nav>
          <AuthStatus />
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Mobile filter button */}
            <div className="md:hidden w-full mb-4">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <Filter className="mr-2 h-4 w-4" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <SheetHeader>
                    <SheetTitle>Filter Technicians</SheetTitle>
                    <SheetDescription>Narrow down your search results</SheetDescription>
                  </SheetHeader>
                  <div className="py-4 space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium">Your Location</h3>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">{location || "Set your location"}</span>
                      </div>

                      {error && (
                        <Alert variant="destructive" className="py-2">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>{error}</AlertDescription>
                        </Alert>
                      )}

                      <form onSubmit={handleLocationInput} className="space-y-2">
                        <Input
                          id="location-input-mobile"
                          placeholder="Enter your location"
                          className="text-sm"
                          value={locationInput}
                          onChange={(e) => setLocationInput(e.target.value)}
                          disabled={isLoading}
                        />
                        <Button type="submit" variant="outline" size="sm" className="w-full" disabled={isLoading}>
                          {isLoading ? "Setting location..." : "Set Location"}
                        </Button>
                      </form>

                      {location && (
                        <div className="mt-2 text-xs text-green-600 flex items-center">
                          <span className="mr-1">✓</span> Location set to {location}
                        </div>
                      )}
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium">Distance</h3>
                      <div className="space-y-2">
                        <Slider
                          defaultValue={[10]}
                          max={20}
                          step={1}
                          onValueChange={(value) => setMaxDistance(value[0])}
                        />
                        <div className="flex justify-between">
                          <span className="text-xs text-gray-500">0 mi</span>
                          <span className="text-xs text-gray-500">{maxDistance} mi</span>
                          <span className="text-xs text-gray-500">20 mi</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium">Device Categories</h3>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="smartphone-mobile"
                            checked={selectedCategories.includes("smartphone")}
                            onCheckedChange={() => handleCategoryChange("smartphone")}
                          />
                          <Label htmlFor="smartphone-mobile">Smartphones</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="laptop-mobile"
                            checked={selectedCategories.includes("laptop")}
                            onCheckedChange={() => handleCategoryChange("laptop")}
                          />
                          <Label htmlFor="laptop-mobile">Computers & Laptops</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="tv-mobile"
                            checked={selectedCategories.includes("tv")}
                            onCheckedChange={() => handleCategoryChange("tv")}
                          />
                          <Label htmlFor="tv-mobile">TVs</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="audio-mobile"
                            checked={selectedCategories.includes("audio")}
                            onCheckedChange={() => handleCategoryChange("audio")}
                          />
                          <Label htmlFor="audio-mobile">Audio Equipment</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="printer-mobile"
                            checked={selectedCategories.includes("printer")}
                            onCheckedChange={() => handleCategoryChange("printer")}
                          />
                          <Label htmlFor="printer-mobile">Printers</Label>
                        </div>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Desktop sidebar filters */}
            <div className="hidden md:block w-64 space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Filters</h3>
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Your Location</h4>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{location || "Set your location"}</span>
                  </div>

                  {error && (
                    <Alert variant="destructive" className="py-2">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <form onSubmit={handleLocationInput} className="space-y-2">
                    <Input
                      id="location-input"
                      placeholder="Enter your location"
                      className="text-sm"
                      value={locationInput}
                      onChange={(e) => setLocationInput(e.target.value)}
                      disabled={isLoading}
                    />
                    <Button type="submit" variant="outline" size="sm" className="w-full" disabled={isLoading}>
                      {isLoading ? "Setting location..." : "Set Location"}
                    </Button>
                  </form>

                  {location && (
                    <div className="mt-2 text-xs text-green-600 flex items-center">
                      <span className="mr-1">✓</span> Location set to {location}
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Distance</h4>
                  <div className="space-y-2">
                    <Slider defaultValue={[10]} max={20} step={1} onValueChange={(value) => setMaxDistance(value[0])} />
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-500">0 mi</span>
                      <span className="text-xs text-gray-500">{maxDistance} mi</span>
                      <span className="text-xs text-gray-500">20 mi</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Device Categories</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="smartphone"
                        checked={selectedCategories.includes("smartphone")}
                        onCheckedChange={() => handleCategoryChange("smartphone")}
                      />
                      <Label htmlFor="smartphone">Smartphones</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="laptop"
                        checked={selectedCategories.includes("laptop")}
                        onCheckedChange={() => handleCategoryChange("laptop")}
                      />
                      <Label htmlFor="laptop">Computers & Laptops</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="tv"
                        checked={selectedCategories.includes("tv")}
                        onCheckedChange={() => handleCategoryChange("tv")}
                      />
                      <Label htmlFor="tv">TVs</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="audio"
                        checked={selectedCategories.includes("audio")}
                        onCheckedChange={() => handleCategoryChange("audio")}
                      />
                      <Label htmlFor="audio">Audio Equipment</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="printer"
                        checked={selectedCategories.includes("printer")}
                        onCheckedChange={() => handleCategoryChange("printer")}
                      />
                      <Label htmlFor="printer">Printers</Label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Technician listings */}
            <div className="flex-1">
              <div className="mb-6">
                <h1 className="text-2xl font-bold mb-2">Electronic Repair Technicians</h1>
                <p className="text-gray-500">
                  {filteredTechnicians.length} technicians found {location ? `near ${location}` : ""}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTechnicians.map((tech) => (
                  <Card key={tech.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="p-6">
                        <div className="flex items-start gap-4">
                          <Image
                            src={tech.image || "/placeholder.svg"}
                            alt={tech.name}
                            width={60}
                            height={60}
                            className="rounded-full"
                          />
                          <div>
                            <h3 className="font-semibold">{tech.name}</h3>
                            <div className="flex items-center gap-1 mt-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm font-medium">{tech.rating}</span>
                              <span className="text-sm text-gray-500">({tech.reviews} reviews)</span>
                            </div>
                            <div className="flex items-center gap-1 mt-1">
                              <MapPin className="h-4 w-4 text-gray-500" />
                              <span className="text-sm text-gray-500">
                                {tech.location} • {tech.distance?.toFixed(1) || "?"} miles
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4">
                          <h4 className="text-sm font-medium mb-2">Specialties</h4>
                          <div className="flex flex-wrap gap-2">
                            {tech.specialties.map((specialty) => (
                              <Badge key={specialty} variant="secondary">
                                {specialty}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t bg-gray-50 p-4">
                      <Button className="w-full">Contact Technician</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>

              {filteredTechnicians.length === 0 && (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium mb-2">No technicians found</h3>
                  <p className="text-gray-500">Try adjusting your filters or location</p>
                </div>
              )}
            </div>
          </div>
        </div>
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
