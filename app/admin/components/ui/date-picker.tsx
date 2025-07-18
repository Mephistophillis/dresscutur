"use client"

import React from 'react'
import { Calendar as CalendarIcon } from 'lucide-react'

import { cn } from "../../../../lib/utils"
import { Button } from './button'
import { Calendar } from './calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './popover'

// Простая функция форматирования даты
function formatDate(date: Date): string {
  const day = date.getDate()
  const month = date.toLocaleString('ru-RU', { month: 'long' })
  const year = date.getFullYear()
  return `${day} ${month} ${year}`
}

export function DatePicker({
  date,
  setDate,
}: {
  date?: Date
  setDate: (date?: Date) => void
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-gray-500"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? formatDate(date) : <span>Выберите дату</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          selected={date}
          onSelect={(selectedDate) => {
            setDate(selectedDate)
          }}
        />
      </PopoverContent>
    </Popover>
  )
} 