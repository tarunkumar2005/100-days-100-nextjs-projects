import { Booking } from "@/types/event"

export const storageKeys = {
  USER_ID: 'eventBooking_userId',
  BOOKINGS: 'eventBooking_bookings',
}

export function getUserId(): string {
  if (typeof window === 'undefined') return ''
  let userId = localStorage.getItem(storageKeys.USER_ID)
  if (!userId) {
    userId = `user_${Math.random().toString(36).substr(2, 9)}`
    localStorage.setItem(storageKeys.USER_ID, userId)
  }
  return userId
}

export function getBookings(): Booking[] {
  if (typeof window === 'undefined') return []
  const bookings = localStorage.getItem(storageKeys.BOOKINGS)
  return bookings ? JSON.parse(bookings) : []
}

export function addBooking(booking: Booking): void {
  if (typeof window === 'undefined') return
  const bookings = getBookings()
  bookings.push(booking)
  localStorage.setItem(storageKeys.BOOKINGS, JSON.stringify(bookings))
}