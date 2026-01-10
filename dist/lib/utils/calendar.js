"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCalendarClient = getCalendarClient;
exports.ymdKst = ymdKst;
exports.taskToEvent = taskToEvent;
exports.syncCalendarEvent = syncCalendarEvent;
const googleapis_1 = require("googleapis");
const google_cache_1 = require("../google.cache");
const calendar_repo_1 = require("../../repositories/calendar.repo");
const task_repo_1 = require("../../repositories/task.repo");
function getCalendarClient(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const clientId = process.env.GOOGLE_CLIENT_ID;
        const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
        const redirectUri = process.env.GOOGLE_REDIRECT_URI;
        if (!clientId || !clientSecret || !redirectUri) {
            throw new Error('Missing GOOGLE_CLIENT_ID/SECRET/REDIRECT_URI');
        }
        const accessToken = yield (0, google_cache_1.getGoogleAccessToken)(userId);
        const oauth2 = new googleapis_1.google.auth.OAuth2(clientId, clientSecret, redirectUri);
        oauth2.setCredentials({ access_token: accessToken });
        return googleapis_1.google.calendar({ version: 'v3', auth: oauth2 });
    });
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
function taskToEvent(task) {
    var _a;
    const start = ymdKst(task.startDate);
    const endExclusive = ymdKst(addDays(task.endDate, 1));
    return {
        summary: task.title,
        description: (_a = task.description) !== null && _a !== void 0 ? _a : '',
        start: { date: start },
        end: { date: endExclusive }
    };
}
function syncCalendarEvent(updatedTask, syncUserId) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const calendar = yield getCalendarClient(syncUserId);
        const event = taskToEvent(updatedTask);
        if (updatedTask.googleEventId) {
            // 기존 이벤트 수정
            yield (0, calendar_repo_1.updateCalendarEvent)(calendar, {
                calendarId: 'primary',
                eventId: updatedTask.googleEventId,
                event
            });
        }
        else {
            // 새 이벤트 생성 + ID 저장
            const resp = yield (0, calendar_repo_1.createCalendarEvent)(calendar, {
                calendarId: 'primary',
                event
            });
            const googleEventId = (_a = resp === null || resp === void 0 ? void 0 : resp.data) === null || _a === void 0 ? void 0 : _a.id;
            if (googleEventId) {
                yield (0, task_repo_1.setGoogleEventId)(updatedTask.id, googleEventId);
            }
        }
    });
}
