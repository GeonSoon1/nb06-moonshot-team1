import { google } from 'googleapis';
import { getGoogleAccessToken } from '../google.cache.js';
import { createCalendarEvent, updateCalendarEvent } from '../../repositories/calendar.repo.js';
import { setGoogleEventId } from '../../repositories/task.repo.js';

export async function getCalendarClient(userId) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;
  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error('Missing GOOGLE_CLIENT_ID/SECRET/REDIRECT_URI');
  }
  const accessToken = await getGoogleAccessToken(userId);
  const oauth2 = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
  oauth2.setCredentials({ access_token: accessToken });
  return google.calendar({ version: 'v3', auth: oauth2 });
}

function ymdKst(date) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(date); // YYYY-MM-DD
}

function addDays(date, days) {
  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
}

export function taskToEvent(task) {
  const start = ymdKst(task.startDate);
  const endExclusive = ymdKst(addDays(task.endDate, 1)); // ✅ all-day end는 exclusive
  return {
    summary: task.title,
    description: task.description ?? '',
    start: { date: start },
    end: { date: endExclusive }
  };
}

export async function syncCalendarEvent(updatedTask, syncUserId) {
  const calendar = await getCalendarClient(syncUserId);
  const event = taskToEvent(updatedTask);
  if (updatedTask.googleEventId) {
    // 기존 이벤트 수정
    await updateCalendarEvent(calendar, {
      calendarId: 'primary',
      eventId: updatedTask.googleEventId,
      event
    });
  } else {
    // 새 이벤트 생성 + ID 저장
    const resp = await createCalendarEvent(calendar, {
      calendarId: 'primary',
      event
    });
    const googleEventId = resp?.data?.id;
    if (googleEventId) {
      await setGoogleEventId(updatedTask.id, googleEventId);
    }
  }
}
