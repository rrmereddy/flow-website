'use client'

import * as React from 'react'
import { addDays, format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

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
            'cursor-pointer border-slate-700 bg-slate-900/80 text-slate-300 shadow-sm backdrop-blur transition-all',
            'hover:border-slate-600 hover:bg-slate-800 hover:text-white',
            isOpen &&
              'border-indigo-500/50 bg-slate-800 text-indigo-300 ring-2 ring-indigo-500/20'
          )}
        >
          <CalendarIcon className="mr-2 h-3 w-3" />
          {date ? format(date, 'EEE, MMM d') : <span>Pick a date</span>}
        </Badge>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto border-slate-800 bg-slate-950 p-0 text-slate-100"
        align="start"
      >
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
            disabled: 'cursor-not-allowed',
            head_cell: 'text-slate-500',
            caption_label: 'text-slate-200 font-medium',
          }}
        />
        <div className="border-t border-slate-800 bg-slate-900/50 p-3">
          <p className="text-center text-[10px] font-medium tracking-wide text-slate-500 uppercase">
            Prediction Window: 7 Days
          </p>
        </div>
      </PopoverContent>
    </Popover>
  )
}
