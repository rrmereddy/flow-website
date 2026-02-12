import { TimeSlice, Hotspot } from "@/types/hotspots";

export type ItineraryItem = {
  id: string;
  startTime: string;
  endTime: string;
  location: string;
  reason: string;
  earnings: string;
  intensity: Hotspot["intensity"];
  coords: { lat: number; lng: number };
};

// Define the shape of a block internally
type ShiftBlock = {
  hotspot: Hotspot;
  start: number;
  end: number;
};

export function generateShiftPlan(
  data: TimeSlice[],
  startHour: number,
  endHour: number
): ItineraryItem[] {
  const plan: ItineraryItem[] = [];
  
  // FIX: Explicitly typed, removed " | null" from hotspot since we ensure it exists
  let currentBlock: ShiftBlock | null = null;

  for (let h = startHour; h < endHour; h++) {
    const hourData = data.find((d) => d.hour === h);
    if (!hourData) continue;

    // Sort to find best spot
    const bestSpot = hourData.hotspots.sort((a, b) => {
      const score = { critical: 4, high: 3, medium: 2, low: 1 };
      return score[b.intensity] - score[a.intensity];
    })[0];

    // If no data for this hour, skip
    if (!bestSpot) continue;

    // Grouping Logic
    if (currentBlock && currentBlock.hotspot.id === bestSpot.id) {
      currentBlock.end = h + 1;
    } else {
      if (currentBlock) {
        plan.push(formatBlock(currentBlock));
      }
      // Since bestSpot is confirmed to exist here, this assignment is safe
      currentBlock = { hotspot: bestSpot, start: h, end: h + 1 };
    }
  }

  if (currentBlock) {
    plan.push(formatBlock(currentBlock));
  }

  return plan;
}

// FIX: Replaced 'any' with the specific 'ShiftBlock' type
function formatBlock(block: ShiftBlock): ItineraryItem {
  const formatTime = (h: number) => {
    const period = h >= 12 && h < 24 ? "PM" : "AM";
    const disp = h % 12 || 12;
    return `${disp} ${period}`;
  };

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
  if (spot.id.includes("northgate")) return "Northgate District";
  if (spot.id.includes("stadium")) return "Kyle Field";
  if (spot.id.includes("airport")) return "Easterwood Airport";
  if (spot.id.includes("mall")) return "Post Oak Mall";
  return "City Center";
}
