"use client"

import { useState, useMemo, useEffect } from "react"
import dynamic from "next/dynamic"
import { motion } from "framer-motion"
import { 
  Calendar as CalendarIcon, 
  Navigation, 
  Play, 
  Pause,
  Zap,
  Clock
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Hotspot } from "@/components/map/DriverMap"

const DriverMap = dynamic(() => import("@/components/map/DriverMap"), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-slate-950 animate-pulse flex items-center justify-center text-slate-700">Loading Map...</div>
})

const COORDS = {
  KYLE_FIELD: { lat: 30.6102, lng: -96.3398 },
  NORTHGATE: { lat: 30.6171, lng: -96.3455 },
  POST_OAK_MALL: { lat: 30.5962, lng: -96.2931 },
  AIRPORT: { lat: 30.5887, lng: -96.3638 },
  DOWNTOWN_BRYAN: { lat: 30.6728, lng: -96.3697 }
}

type TimeSlice = {
  hour: number
  label: string
  hotspots: Hotspot[]
}

const generateDayData = (): TimeSlice[] => {
  const data: TimeSlice[] = []
  
  for (let i = 6; i <= 29; i++) {
    const hour = i % 24
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
    const ampm = hour < 12 ? "AM" : "PM"
    
    let spots: Hotspot[] = []

    if (i >= 7 && i <= 9) {
      spots.push({ id: "campus-am", ...COORDS.KYLE_FIELD, intensity: "high", radius: 120, reason: "Class Start" })
    }
    if (i >= 11 && i <= 13) {
      spots.push({ id: "northgate-lunch", ...COORDS.NORTHGATE, intensity: "medium", radius: 100, reason: "Lunch Rush" })
    }
    if (i >= 18 && i <= 21) {
      spots.push({ id: "stadium", ...COORDS.KYLE_FIELD, intensity: "critical", radius: 250, reason: "A&M vs LSU" })
    }
    if (i >= 23 || i <= 26) {
      spots.push({ id: "northgate-bars", ...COORDS.NORTHGATE, intensity: "critical", radius: 200, reason: "Bar Close" })
    }

    data.push({
      hour: i,
      label: `${displayHour} ${ampm}`,
      hotspots: spots
    })
  }
  return data
}

const TIMELINE_DATA = generateDayData()

export default function DriverMapPage() {
  const [timeIndex, setTimeIndex] = useState(12) 
  const [isPlaying, setIsPlaying] = useState(false)

  const currentData = useMemo(() => TIMELINE_DATA[timeIndex], [timeIndex])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPlaying) {
      interval = setInterval(() => {
        setTimeIndex((prev) => (prev + 1) % TIMELINE_DATA.length)
      }, 500) 
    }
    return () => clearInterval(interval)
  }, [isPlaying])

  return (
    <div className="relative flex flex-col h-screen bg-slate-950 text-slate-100 overflow-hidden">
      
      {/* --- TOP HUD (Fixed Gradient) --- */}
      {/* Changed to slate-950/90 to match dark theme */}
      <div className="absolute top-0 left-0 right-0 z-[400] p-4 pt-6 bg-gradient-to-b from-slate-950/90 to-transparent pointer-events-none">
        <div className="max-w-xl mx-auto space-y-3 pointer-events-auto">
          
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="bg-slate-900/80 backdrop-blur border-slate-700 text-slate-300 shadow-sm">
              <CalendarIcon className="w-3 h-3 mr-2" />
              Today, Oct 24
            </Badge>
            
            <div className="h-6">
              {currentData.hotspots.some(h => h.intensity === 'critical') && (
                 <motion.div 
                   initial={{ opacity: 0, scale: 0.9 }}
                   animate={{ opacity: 1, scale: 1 }}
                   className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/20 text-red-200 border border-red-500/30 text-xs font-bold uppercase tracking-wider shadow-sm"
                 >
                   <Zap className="w-3 h-3 fill-red-400" />
                   High Surge
                 </motion.div>
               )}
            </div>
          </div>

          {/* Controls Container (Dark Mode Styles) */}
          <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700 rounded-2xl p-4 shadow-xl flex items-center gap-4">
            
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-md hover:bg-indigo-500 transition-colors shrink-0"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 fill-current" />
              ) : (
                <Play className="w-4 h-4 fill-current ml-0.5" />
              )}
            </button>

            <div className="flex-1 space-y-2">
              <div className="flex justify-between items-end mb-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Timeline</span>
                <span className="text-xl font-black font-mono tracking-tight text-white">
                  {currentData.label}
                </span>
              </div>
              <Slider
                value={[timeIndex]}
                min={0}
                max={TIMELINE_DATA.length - 1}
                step={1}
                onValueChange={(val) => {
                  setTimeIndex(val[0])
                  setIsPlaying(false)
                }}
                className="cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* --- REAL MAP LAYER --- */}
      <div className="absolute inset-0 z-0">
        <DriverMap hotspots={currentData.hotspots} />
      </div>

      {/* --- BOTTOM SHEET TRIGGER --- */}
      <div className="absolute bottom-8 left-4 right-4 z-[400]">
        <div className="max-w-md mx-auto">
          <Sheet>
            <SheetTrigger asChild>
              <Button 
                size="lg" 
                className="w-full h-14 text-lg font-bold shadow-2xl shadow-indigo-500/20 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white border-t border-white/20"
              >
                <Navigation className="w-5 h-5 mr-2" />
                Plan My Day
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[80vh] rounded-t-[24px] bg-slate-950 border-slate-800 text-slate-100 p-0">
              <div className="p-8">
                <SheetHeader className="text-left mb-6">
                  <SheetTitle className="text-3xl font-bold text-white">Route Optimizer</SheetTitle>
                  <SheetDescription className="text-slate-400 text-lg">
                    Select your shift hours and we'll calculate the highest earning path.
                  </SheetDescription>
                </SheetHeader>
                 <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-slate-800 rounded-2xl bg-slate-900/50">
                    <Clock className="w-10 h-10 text-slate-600 mb-2" />
                    <span className="text-slate-500 font-medium">Shift Setup Wizard</span>
                 </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  )
}
