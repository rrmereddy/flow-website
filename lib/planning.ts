import { TimeSlice, Hotspot } from "@/types/hotspots";

export type ItineraryItem = {
  id: string;
  startTime: string;
  endTime: string;
  location: string;
  reason: string;
  earnings: string; // Fake estimate
  intensity: Hotspot["intensity"];
  coords: { lat: number; lng: number };
};

export function generateShiftPlan(
  data: TimeSlice[],
  startHour: number,
  endHour: number
): ItineraryItem[] {
  const plan: ItineraryItem[] = [];
  
  let currentBlock: {
    hotspot: Hotspot | null;
    start: number;
    end: number;
  } | null = null;

  // Loop through selected hours
  for (let h = startHour; h < endHour; h++) {
    // 1. Find the BEST hotspot for this hour
    // (Sort by intensity: critical > high > medium > low)
    const hourData = data.find((d) => d.hour === h);
    if (!hourData) continue;

    const bestSpot = hourData.hotspots.sort((a, b) => {
      const score = { critical: 4, high: 3, medium: 2, low: 1 };
      return score[b.intensity] - score[a.intensity];
    })[0]; // Grab top 1

    // If no data for this hour, skip or generic
    if (!bestSpot) continue;

    // 2. Grouping Logic
    if (currentBlock && currentBlock.hotspot?.id === bestSpot.id) {
      // Same spot as last hour? Extend the block.
      currentBlock.end = h + 1;
    } else {
      // New spot? Push old block and start new one.
      if (currentBlock) {
        plan.push(formatBlock(currentBlock));
      }
      currentBlock = { hotspot: bestSpot, start: h, end: h + 1 };
    }
  }

  // Push the final block
  if (currentBlock) {
    plan.push(formatBlock(currentBlock));
  }

  return plan;
}

function formatBlock(block: any): ItineraryItem {
  const formatTime = (h: number) => {
    const period = h >= 12 && h < 24 ? "PM" : "AM";
    const disp = h % 12 || 12;
    return `${disp} ${period}`;
  };

  // Fake earnings math ($25/hr base + multipliers)
  const duration = block.end - block.start;
  const multiplier = block.hotspot.intensity === "critical" ? 2 : 1.5;
  const lowEst = Math.round(duration * 20 * multiplier);
  const highEst = Math.round(duration * 30 * multiplier);

  return {
    id: block.hotspot.id + Math.random(),
    startTime: formatTime(block.start),
    endTime: formatTime(block.end),
    location: getReadableName(block.hotspot),
    reason: block.hotspot.reason || "High Demand Zone",
    earnings: `$${lowEst} - $${highEst}`,
    intensity: block.hotspot.intensity,
    coords: { lat: block.hotspot.lat, lng: block.hotspot.lng },
  };
}

function getReadableName(spot: Hotspot) {
  // Map IDs to pretty names if needed, or use reason
  if (spot.id.includes("northgate")) return "Northgate District";
  if (spot.id.includes("stadium")) return "Kyle Field";
  if (spot.id.includes("airport")) return "Easterwood Airport";
  if (spot.id.includes("mall")) return "Post Oak Mall";
  return "City Center";
}
