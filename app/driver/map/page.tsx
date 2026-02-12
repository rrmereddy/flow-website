"use client"

import { useState, useMemo, useEffect } from "react"
import dynamic from "next/dynamic"
import { motion } from "framer-motion"
import { Calendar as CalendarIcon, Navigation, Play, Pause, Zap, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { TimeSlice } from "@/types/hotspots"
import { getPredictedHotspots } from "@/lib/api/hotspots"
import { DateSelector } from "@/components/map/DateSelector"

// Dynamic Map Import
const DriverMap = dynamic(() => import("@/components/map/DriverMap"), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-slate-950 animate-pulse flex items-center justify-center text-slate-700">Loading Map...</div>
})

export default function DriverMapPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [timelineData, setTimelineData] = useState<TimeSlice[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  const [timeIndex, setTimeIndex] = useState(12) // Start at 6 PM
  const [isPlaying, setIsPlaying] = useState(false)

  // --- 1. FETCH DATA ON DATE CHANGE ---
  useEffect(() => {
    async function loadData() {
      setIsLoading(true)
      try {
        const data = await getPredictedHotspots(selectedDate)
        setTimelineData(data)
      } catch (error) {
        console.error("Failed to fetch hotspots", error)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [selectedDate])

  // --- 2. DERIVED STATE ---
  // Fallback to empty object if data isn't loaded yet
  const currentData = useMemo(() => {
    if (!timelineData || timelineData.length === 0) return null
    return timelineData[timeIndex]
  }, [timelineData, timeIndex])

  // --- 3. PLAYBACK CONTROL ---
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPlaying && timelineData.length > 0) {
      interval = setInterval(() => {
        setTimeIndex((prev) => (prev + 1) % timelineData.length)
      }, 500) 
    }
    return () => clearInterval(interval)
  }, [isPlaying, timelineData.length])

  // Helper to format date display (e.g., "Today, Oct 24")
  const dateLabel = useMemo(() => {
    const today = new Date();
    const isToday = selectedDate.toDateString() === today.toDateString();
    const format = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(selectedDate);
    return isToday ? `Today, ${format}` : format;
  }, [selectedDate])

  return (
    <div className="relative flex flex-col h-screen bg-slate-950 text-slate-100 overflow-hidden">
      
      {/* --- TOP HUD --- */}
      <div className="absolute top-0 left-0 right-0 z-[400] p-4 pt-6 bg-gradient-to-b from-slate-950/90 to-transparent pointer-events-none">
        <div className="max-w-xl mx-auto space-y-3 pointer-events-auto">
          
          <div className="flex items-center justify-between">
            {/* Clickable Badge for Future Date Selection */}
			<DateSelector 
              date={selectedDate} 
              setDate={(d) => d && setSelectedDate(d)} 
            />
            
            <div className="h-6">
              {currentData?.hotspots.some(h => h.intensity === 'critical') && (
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

          {/* Controls Container */}
          <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700 rounded-2xl p-4 shadow-xl flex items-center gap-4">
            
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              disabled={isLoading}
              className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-md hover:bg-indigo-500 transition-colors shrink-0 disabled:opacity-50"
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
                  {currentData?.label || "--:--"}
                </span>
              </div>
              <Slider
                value={[timeIndex]}
                min={0}
                max={timelineData.length > 0 ? timelineData.length - 1 : 23}
                step={1}
                disabled={isLoading}
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
        {isLoading ? (
          <div className="flex items-center justify-center h-full w-full bg-slate-950">
            <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
          </div>
        ) : (
          <DriverMap hotspots={currentData?.hotspots || []} />
        )}
      </div>

      {/* --- BOTTOM SHEET --- */}
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
                {/* Wizard content placeholder */}
                <SheetHeader className="text-left mb-6">
                  <SheetTitle className="text-3xl font-bold text-white">Route Optimizer</SheetTitle>
                  <SheetDescription className="text-slate-400 text-lg">
                    Data Source: {dateLabel} Prediction Model
                  </SheetDescription>
                </SheetHeader>
                 <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-slate-800 rounded-2xl bg-slate-900/50">
                    <span className="text-slate-500 font-medium">Wizard Coming Soon...</span>
                 </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  )
}
