'use client'

import { useState, useMemo, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import {
  Navigation,
  Play,
  Pause,
  Zap,
  Loader2,
  Clock,
  DollarSign,
  CheckCircle2,
  MapPin,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { toast } from 'sonner' // Assuming you have sonner/toast installed
import { TimeSlice } from '@/types/hotspots'
import { getPredictedHotspots } from '@/lib/api/hotspots'
import { generateShiftPlan, ItineraryItem } from '@/lib/planning'
import { DateSelector } from '@/components/map/DateSelector'
import { cn } from '@/lib/utils'

const DriverMap = dynamic(() => import('@/components/map/DriverMap'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full animate-pulse items-center justify-center bg-slate-950 text-slate-700">
      Loading Map...
    </div>
  ),
})

export default function DriverMapPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [timelineData, setTimelineData] = useState<TimeSlice[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [timeIndex, setTimeIndex] = useState(12)
  const [isPlaying, setIsPlaying] = useState(false)

  // Wizard State
  const [shiftRange, setShiftRange] = useState([17, 22])
  const [isGenerating, setIsGenerating] = useState(false)
  const [itinerary, setItinerary] = useState<ItineraryItem[] | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)

  useEffect(() => {
    async function loadData() {
      setIsLoading(true)
      try {
        const data = await getPredictedHotspots(selectedDate)
        setTimelineData(data)
      } catch (error) {
        console.error('Failed to fetch hotspots', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [selectedDate])

  const currentData = useMemo(() => {
    if (!timelineData || timelineData.length === 0) return null
    return timelineData[timeIndex]
  }, [timelineData, timeIndex])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPlaying && timelineData.length > 0) {
      interval = setInterval(() => {
        setTimeIndex((prev) => (prev + 1) % timelineData.length)
      }, 500)
    }
    return () => clearInterval(interval)
  }, [isPlaying, timelineData.length])

  const handleGeneratePlan = () => {
    setIsGenerating(true)
    // REALISM: Keep this 1.5s delay. Complex routing takes time.
    setTimeout(() => {
      const plan = generateShiftPlan(timelineData, shiftRange[0], shiftRange[1])
      setItinerary(plan)
      setIsGenerating(false)
    }, 1500)
  }

  const handleStartLeg = () => {
    if (!itinerary) return

    // 1. Get the destination coordinates from the first leg of the trip
    const { lat, lng } = itinerary[0].coords
    const destinationName = encodeURIComponent(itinerary[0].location)

    // 2. Construct the Universal Google Maps URL
    // "dir" = Directions
    // "api=1" = Use the latest API version
    // "destination" = Where we are going
    const mapUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=${destinationName}`

    setSheetOpen(false) // Close the sheet UI

    // 3. Trigger the Toast with the REAL link
    toast.success(`Navigating to ${itinerary[0].location}`, {
      description: 'Drive safe! High demand expected in 10 mins.',
      action: {
        label: 'Open Maps',
        // This will launch the native app on mobile or new tab on desktop
        onClick: () => window.open(mapUrl, '_blank'),
      },
    })
  }

  const formatHour = (val: number) => {
    const period = val >= 12 && val < 24 ? 'PM' : 'AM'
    const disp = val % 12 || 12
    return `${disp} ${period}`
  }

  return (
    <div className="relative flex h-screen flex-col overflow-hidden bg-slate-950 text-slate-100">
      {/* TOP HUD - Z-Index 10 */}
      <div className="pointer-events-none absolute top-0 right-0 left-0 z-10 bg-gradient-to-b from-slate-950/90 to-transparent p-4 pt-6">
        <div className="pointer-events-auto mx-auto max-w-xl space-y-3">
          <div className="flex items-center justify-between">
            <DateSelector
              date={selectedDate}
              setDate={(d) => d && setSelectedDate(d)}
            />
            <div className="h-6">
              {currentData?.hotspots.some(
                (h) => h.intensity === 'critical'
              ) && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/20 px-3 py-1 text-xs font-bold tracking-wider text-red-200 uppercase shadow-sm"
                >
                  <Zap className="h-3 w-3 fill-red-400" />
                  High Surge
                </motion.div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-2xl border border-slate-700 bg-slate-900/80 p-4 shadow-xl backdrop-blur-xl">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              disabled={isLoading}
              className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-indigo-600 text-white shadow-md transition-colors hover:bg-indigo-500 disabled:opacity-50"
            >
              {isPlaying ? (
                <Pause className="h-4 w-4 fill-current" />
              ) : (
                <Play className="ml-0.5 h-4 w-4 fill-current" />
              )}
            </button>
            <div className="flex-1 space-y-2">
              <div className="mb-1 flex items-end justify-between">
                <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                  Timeline
                </span>
                <span className="font-mono text-xl font-black tracking-tight text-white">
                  {currentData?.label || '--:--'}
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

      <div className="absolute inset-0 z-0">
        {isLoading ? (
          <div className="flex h-full w-full items-center justify-center bg-slate-950">
            <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
          </div>
        ) : (
          <DriverMap hotspots={currentData?.hotspots || []} />
        )}
      </div>

      {/* --- BOTTOM SHEET --- */}
      {/* FIX: Changed z-[400] to z-10 so it stays BEHIND the open sheet */}
      <div className="absolute right-4 bottom-8 left-4 z-10">
        <div className="mx-auto max-w-md">
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button
                size="lg"
                className="h-14 w-full cursor-pointer border-t border-white/20 bg-gradient-to-r from-indigo-600 to-violet-600 text-lg font-bold text-white shadow-2xl shadow-indigo-500/20 hover:from-indigo-500 hover:to-violet-500"
              >
                <Navigation className="mr-2 h-5 w-5" />
                Plan My Day
              </Button>
            </SheetTrigger>

            <SheetContent
              side="bottom"
              className="z-50 max-h-[85vh] overflow-y-auto rounded-t-[24px] border-slate-800 bg-slate-950 p-0 text-slate-100"
            >
              <SheetHeader className="border-b border-slate-800/50 p-6 pb-2 text-left">
                <SheetTitle className="flex items-center gap-2 text-2xl font-bold text-white">
                  {itinerary ? (
                    <>
                      <CheckCircle2 className="h-6 w-6 text-green-500" /> Your
                      Shift Plan
                    </>
                  ) : (
                    'Route Optimizer'
                  )}
                </SheetTitle>
                <p className="text-sm text-slate-400">
                  {itinerary
                    ? 'Optimized for maximum earnings based on predictive data.'
                    : 'Select your shift hours to generate a plan.'}
                </p>
              </SheetHeader>

              <div className="p-6">
                {!itinerary ? (
                  <div className="space-y-8 py-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-slate-300">
                          Shift Hours
                        </label>
                        <span className="rounded bg-indigo-500/10 px-2 py-1 font-mono font-bold text-indigo-400">
                          {formatHour(shiftRange[0])} -{' '}
                          {formatHour(shiftRange[1])}
                        </span>
                      </div>
                      <Slider
                        value={shiftRange}
                        min={6}
                        max={29}
                        step={1}
                        minStepsBetweenThumbs={2}
                        onValueChange={setShiftRange}
                        className="cursor-pointer py-4"
                      />
                      <div className="flex justify-between text-[10px] font-bold tracking-widest text-slate-600 uppercase">
                        <span>6 AM</span>
                        <span>12 PM</span>
                        <span>6 PM</span>
                        <span>12 AM</span>
                        <span>4 AM</span>
                      </div>
                    </div>

                    {/* Stats Preview: Instant Math (REALISTIC) */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
                        <Clock className="mb-2 h-5 w-5 text-indigo-500" />
                        <div className="text-2xl font-bold text-white">
                          {shiftRange[1] - shiftRange[0]}h
                        </div>
                        <div className="text-xs text-slate-500">Duration</div>
                      </div>
                      <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
                        <DollarSign className="mb-2 h-5 w-5 text-green-500" />
                        <div className="text-2xl font-bold text-white">
                          ${(shiftRange[1] - shiftRange[0]) * 22}-
                          {(shiftRange[1] - shiftRange[0]) * 28}
                        </div>
                        <div className="text-xs text-slate-500">
                          Est. Earnings
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={handleGeneratePlan}
                      disabled={isGenerating}
                      className="h-12 w-full cursor-pointer bg-indigo-600 text-lg font-bold text-white hover:bg-indigo-500"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Calculating Best Route...
                        </>
                      ) : (
                        'Generate Itinerary'
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="relative ml-3 space-y-8 border-l-2 border-slate-800 pb-4">
                      {itinerary.map((item) => (
                        <div key={item.id} className="relative pl-8">
                          <div
                            className={cn(
                              'absolute top-0 -left-[9px] h-4 w-4 rounded-full border-2 border-slate-950',
                              item.intensity === 'critical'
                                ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]'
                                : item.intensity === 'high'
                                  ? 'bg-orange-500'
                                  : 'bg-indigo-500'
                            )}
                          />

                          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 transition-colors hover:bg-slate-900">
                            <div className="mb-2 flex items-start justify-between">
                              <div>
                                <span className="mb-1 block text-xs font-bold tracking-wider text-indigo-400 uppercase">
                                  {item.startTime} - {item.endTime}
                                </span>
                                <h3 className="flex items-center gap-2 text-lg font-bold text-white">
                                  {item.location}
                                </h3>
                              </div>
                              <Badge
                                variant="outline"
                                className={cn(
                                  'text-[10px] font-bold tracking-wider uppercase',
                                  item.intensity === 'critical'
                                    ? 'border-red-500/30 bg-red-500/10 text-red-400'
                                    : 'border-slate-700 text-slate-400'
                                )}
                              >
                                {item.intensity} Demand
                              </Badge>
                            </div>

                            <p className="mb-3 text-sm text-slate-400">
                              {item.reason}
                            </p>

                            <div className="flex items-center gap-4 border-t border-slate-800/50 pt-3 text-xs font-medium text-slate-500">
                              <span className="flex items-center gap-1 text-green-400">
                                <DollarSign className="h-3 w-3" />{' '}
                                {item.earnings}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" /> 2.4 mi away
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-3 pt-2">
                      <Button
                        variant="outline"
                        className="flex-1 cursor-pointer border-slate-700 text-slate-300 hover:bg-slate-800"
                        onClick={() => setItinerary(null)}
                      >
                        Back
                      </Button>
                      <Button
                        onClick={handleStartLeg}
                        className="flex-[2] cursor-pointer bg-green-600 font-bold text-white hover:bg-green-500"
                      >
                        <Navigation className="mr-2 h-4 w-4" /> Start First Leg
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  )
}
