import type { calendar_v3 } from 'googleapis';

type CalendarEventParams = {
  calendarId?: string;
  eventId: string;
  event: calendar_v3.Schema$Event;
};
