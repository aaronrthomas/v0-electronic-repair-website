// This is a simplified location service that won't throw unexpected errors

export type Coordinates = {
  latitude: number
  longitude: number
}

export type LocationData = {
  coordinates: Coordinates
  address: string
}

// Mock database of locations with simplified structure
const locationDatabase: Record<string, LocationData> = {
  "new york": {
    coordinates: { latitude: 40.7128, longitude: -74.006 },
    address: "New York, NY",
  },
  "los angeles": {
    coordinates: { latitude: 34.0522, longitude: -118.2437 },
    address: "Los Angeles, CA",
  },
  chicago: {
    coordinates: { latitude: 41.8781, longitude: -87.6298 },
    address: "Chicago, IL",
  },
  houston: {
    coordinates: { latitude: 29.7604, longitude: -95.3698 },
    address: "Houston, TX",
  },
  phoenix: {
    coordinates: { latitude: 33.4484, longitude: -112.074 },
    address: "Phoenix, AZ",
  },
  philadelphia: {
    coordinates: { latitude: 39.9526, longitude: -75.1652 },
    address: "Philadelphia, PA",
  },
  "san antonio": {
    coordinates: { latitude: 29.4241, longitude: -98.4936 },
    address: "San Antonio, TX",
  },
  "san diego": {
    coordinates: { latitude: 32.7157, longitude: -117.1611 },
    address: "San Diego, CA",
  },
  dallas: {
    coordinates: { latitude: 32.7767, longitude: -96.797 },
    address: "Dallas, TX",
  },
}

// Simplified geocode function that won't throw errors
export function geocodeLocation(locationString: string): LocationData {
  // Default coordinates (center of US) if location not found
  const defaultLocation: LocationData = {
    coordinates: { latitude: 39.8283, longitude: -98.5795 },
    address: locationString || "Unknown Location",
  }

  if (!locationString) {
    return defaultLocation
  }

  // Normalize the input
  const normalizedLocation = locationString.toLowerCase().trim()

  // Check if we have this location in our database
  for (const [key, data] of Object.entries(locationDatabase)) {
    if (normalizedLocation.includes(key)) {
      return data
    }
  }

  // If not found, return a location with random nearby coordinates
  return {
    coordinates: {
      latitude: 37 + (Math.random() * 10 - 5),
      longitude: -95 + (Math.random() * 10 - 5),
    },
    address: locationString,
  }
}

// Function to calculate distance between two coordinates (in miles)
export function calculateDistance(coord1: Coordinates, coord2: Coordinates): number {
  // Simple distance calculation for demo purposes
  // In a real app, you would use the Haversine formula
  const latDiff = Math.abs(coord1.latitude - coord2.latitude)
  const lonDiff = Math.abs(coord1.longitude - coord2.longitude)

  // Rough approximation: 1 degree of latitude ≈ 69 miles
  // 1 degree of longitude varies, but we'll use a simple approximation
  const distance = Math.sqrt(Math.pow(latDiff * 69, 2) + Math.pow(lonDiff * 55, 2))

  return Math.round(distance * 10) / 10 // Round to 1 decimal place
}

// Function to get nearby technicians based on location and max distance
export function getNearbyTechnicians(allTechnicians: any[], userLocation: Coordinates, maxDistance = 20): any[] {
  if (!userLocation || !allTechnicians || !allTechnicians.length) {
    return allTechnicians || []
  }

  return allTechnicians
    .map((tech) => {
      // Generate consistent random coordinates for each technician based on their ID
      const seed = tech.id || Math.random()
      const techCoordinates = {
        latitude: userLocation.latitude + Math.sin(seed) * 0.1,
        longitude: userLocation.longitude + Math.cos(seed) * 0.1,
      }

      // Calculate distance
      const distance = calculateDistance(userLocation, techCoordinates)

      // Return technician with updated distance
      return {
        ...tech,
        distance,
        coordinates: techCoordinates,
      }
    })
    .filter((tech) => tech.distance <= maxDistance)
    .sort((a, b) => a.distance - b.distance) // Sort by distance
}
