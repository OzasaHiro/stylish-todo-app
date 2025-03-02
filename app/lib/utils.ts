import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return 'No date'
  
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(dateObj)
}

export function getPriorityColor(priority: string) {
  switch (priority.toUpperCase()) {
    case 'LOW':
      return 'bg-blue-400'
    case 'NORMAL':
      return 'bg-green-400'
    case 'HIGH':
      return 'bg-yellow-500'
    case 'URGENT':
      return 'bg-red-500'
    default:
      return 'bg-gray-300'
  }
}

export function getPriorityLabel(priority: string) {
  switch (priority.toUpperCase()) {
    case 'LOW':
      return 'Low'
    case 'NORMAL':
      return 'Normal'
    case 'HIGH':
      return 'High'
    case 'URGENT':
      return 'Urgent'
    default:
      return 'Unknown'
  }
}
