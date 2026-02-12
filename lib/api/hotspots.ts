import { Hotspot, TimeSlice } from "@/types/hotspots";

// --- COORDINATES CONSTANTS ---
const COORDS = {
  KYLE_FIELD: { lat: 30.6102, lng: -96.3398 },
  NORTHGATE: { lat: 30.6171, lng: -96.3455 },
  POST_OAK_MALL: { lat: 30.5962, lng: -96.2931 },
  AIRPORT: { lat: 30.5887, lng: -96.3638 },
  DOWNTOWN_BRYAN: { lat: 30.6728, lng: -96.3697 },
  SCENIC_DRIVE: { lat: 30.6300, lng: -96.3500 } // Generic residential
};

/**
 * Simulates an API call to your backend prediction engine.
 * Returns 24 hours of data for the specific requested date.
 */
export async function getPredictedHotspots(date: Date): Promise<TimeSlice[]> {
  // Simulate network delay (300ms)
  await new Promise((resolve) => setTimeout(resolve, 300));

  const dayOfWeek = date.getDay(); // 0 = Sun, 6 = Sat
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  const isFriday = dayOfWeek === 5;

  const data: TimeSlice[] = [];

  // Generate 24 hours of data (from 6 AM today to 5 AM tomorrow)
  for (let i = 6; i <= 29; i++) {
    const hour = i % 24;
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    const ampm = hour < 12 ? "AM" : "PM";
    
    let spots: Hotspot[] = [];

    // --- LOGIC: Varies by Day of Week ---

    // 1. Morning Rush (7AM - 9AM) - Weekdays Only
    if (!isWeekend && i >= 7 && i <= 9) {
      spots.push({ id: `am-campus-${i}`, ...COORDS.KYLE_FIELD, intensity: "high", radius: 150, reason: "Class Start" });
      spots.push({ id: `am-airport-${i}`, ...COORDS.AIRPORT, intensity: "medium", radius: 100, reason: "Commuter Flights" });
    }

    // 2. Lunch Rush (11AM - 1PM) - Every day
    if (i >= 11 && i <= 13) {
      spots.push({ id: `lunch-ng-${i}`, ...COORDS.NORTHGATE, intensity: isWeekend ? "high" : "medium", radius: 100, reason: "Lunch Rush" });
      if (isWeekend) {
        spots.push({ id: `lunch-mall-${i}`, ...COORDS.POST_OAK_MALL, intensity: "high", radius: 120, reason: "Weekend Shopping" });
      }
    }

    // 3. Evening/Events (6PM - 9PM)
    if (i >= 18 && i <= 21) {
      if (isFriday || dayOfWeek === 6) {
        // Football/Game Logic for Fri/Sat
        spots.push({ id: `game-${i}`, ...COORDS.KYLE_FIELD, intensity: "critical", radius: 300, reason: "Game Day Traffic" });
        spots.push({ id: `pregame-${i}`, ...COORDS.NORTHGATE, intensity: "high", radius: 150, reason: "Pre-Game" });
      } else {
        // Standard Weekday Dinner
        spots.push({ id: `dinner-${i}`, ...COORDS.POST_OAK_MALL, intensity: "medium", radius: 100, reason: "Dinner Service" });
      }
    }

    // 4. Nightlife (10PM - 2AM)
    if (i >= 22 || i <= 26) {
      if (isFriday || dayOfWeek === 6) {
        spots.push({ id: `party-${i}`, ...COORDS.NORTHGATE, intensity: "critical", radius: 250, reason: "Bar District" });
        spots.push({ id: `bryan-${i}`, ...COORDS.DOWNTOWN_BRYAN, intensity: "high", radius: 150, reason: "Downtown Bryan" });
      } else if (dayOfWeek === 4) { // Thursday is college party night too
        spots.push({ id: `thurs-party-${i}`, ...COORDS.NORTHGATE, intensity: "high", radius: 150, reason: "Thirsty Thursday" });
      }
    }

    data.push({
      hour: i,
      label: `${displayHour} ${ampm}`,
      hotspots: spots
    });
  }

  return data;
}
