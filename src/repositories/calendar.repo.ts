import type { calendar_v3 } from 'googleapis';
import { CalendarEventParams } from '../types/calendar';

export async function createCalendarEvent(
  calendar: calendar_v3.Calendar,
  { calendarId = 'primary', event }: Omit<CalendarEventParams, 'eventId'>
) {
  return calendar.events.insert({
    calendarId,
    requestBody: event
  });
}

export async function updateCalendarEvent(
  calendar: calendar_v3.Calendar,
  { calendarId = 'primary', eventId, event }: CalendarEventParams
) {
  return calendar.events.patch({
    calendarId,
    eventId,
    requestBody: event
  });
}

export async function deleteCalendarEvent(
  calendar: calendar_v3.Calendar,
  { calendarId = 'primary', eventId }: Omit<CalendarEventParams, 'event'>
) {
  return calendar.events.delete({
    calendarId,
    eventId
  });
}
