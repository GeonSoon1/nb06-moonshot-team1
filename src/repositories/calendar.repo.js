export async function createCalendarEvent(calendar, { calendarId = 'primary', event }) {
  return calendar.events.insert({
    calendarId,
    requestBody: event
  });
}

export async function updateCalendarEvent(calendar, { calendarId = 'primary', eventId, event }) {
  return calendar.events.patch({
    calendarId,
    eventId,
    requestBody: event
  });
}

export async function deleteCalendarEvent(calendar, { calendarId = 'primary', eventId }) {
  return calendar.events.delete({
    calendarId,
    eventId
  });
}
