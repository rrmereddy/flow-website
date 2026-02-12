"use client"

import * as React from "react"
import { addDays, format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface DateSelectorProps {
  date: Date
  setDate: (date: Date | undefined) => void
}

export function DateSelector({ date, setDate }: DateSelectorProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  // Prediction Window: Today -> 7 Days from now
  const today = new Date()
  today.setHours(0, 0, 0, 0) // Reset time to start of day
  const maxDate = addDays(today, 7)

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Badge 
          variant="outline" 
          className={cn(
            "bg-slate-900/80 backdrop-blur border-slate-700 text-slate-300 shadow-sm cursor-pointer transition-all",
            "hover:bg-slate-800 hover:text-white hover:border-slate-600",
            isOpen && "bg-slate-800 border-indigo-500/50 text-indigo-300 ring-2 ring-indigo-500/20"
          )}
        >
          <CalendarIcon className="w-3 h-3 mr-2" />
          {date ? format(date, "EEE, MMM d") : <span>Pick a date</span>}
        </Badge>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-slate-950 border-slate-800 text-slate-100" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(newDate) => {
            setDate(newDate)
            setIsOpen(false) // Close on selection
          }}
          disabled={(d) => d < today || d > maxDate} // Disable past & future > 7 days
          initialFocus
          className="p-3"
          classNames={{
            disabled: "cursor-not-allowed",
            head_cell: "text-slate-500",
            caption_label: "text-slate-200 font-medium",
          }}
        />
        <div className="p-3 border-t border-slate-800 bg-slate-900/50">
          <p className="text-[10px] text-center text-slate-500 font-medium uppercase tracking-wide">
            Prediction Window: 7 Days
          </p>
        </div>
      </PopoverContent>
    </Popover>
  )
}
