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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeOAuthState = decodeOAuthState;
exports.getGoogleToken = getGoogleToken;
exports.getGoogleProfile = getGoogleProfile;
exports.setAuthCookies = setAuthCookies;
exports.stripPassword = stripPassword;
exports.firstQuery = firstQuery;
exports.requireQuery = requireQuery;
const customError_1 = require("../../middlewares/errors/customError");
function decodeOAuthState(state) {
    const fallback = process.env.FRONTEND_OAUTH_REDIRECT_URL;
    let redirectTo = fallback;
    let deviceId = null;
    const raw = state;
    if (!raw || typeof raw !== 'string')
        return { redirectTo, deviceId };
    try {
        const decoded = JSON.parse(Buffer.from(raw, 'base64url').toString('utf8'));
        if (typeof (decoded === null || decoded === void 0 ? void 0 : decoded.redirectTo) === 'string')
            redirectTo = decoded.redirectTo;
        if (typeof (decoded === null || decoded === void 0 ? void 0 : decoded.deviceId) === 'string')
            deviceId = decoded.deviceId;
    }
    catch (err) {
        console.warn('state 파싱 실패', { err: String(err) });
    }
    return { redirectTo, deviceId };
}
function getGoogleToken(code) {
    return __awaiter(this, void 0, void 0, function* () {
        const clientId = process.env.GOOGLE_CLIENT_ID;
        const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
        const redirectUri = process.env.GOOGLE_REDIRECT_URI;
        if (!clientId || !clientSecret || !redirectUri) {
            throw new Error();
        }
        const tokenRes = yield fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                code: String(code),
                client_id: clientId,
                client_secret: clientSecret,
                redirect_uri: redirectUri,
                grant_type: 'authorization_code'
            })
        });
        const tokenJson = yield tokenRes.json();
        if (!tokenRes.ok) {
            console.error('Google token error:', tokenJson);
            throw new customError_1.BadRequestError('잘못된 요청입니다');
        }
        return {
            googleAccessToken: tokenJson.access_token,
            googleRefreshToken: tokenJson.refresh_token,
            scopeStr: tokenJson.scope || ''
        };
    });
}
function getGoogleProfile(googleAccessToken) {
    return __awaiter(this, void 0, void 0, function* () {
        const userinfoRes = yield fetch('https://openidconnect.googleapis.com/v1/userinfo', {
            headers: { Authorization: `Bearer ${googleAccessToken}` }
        });
        const profile = yield userinfoRes.json();
        if (!userinfoRes.ok) {
            console.error('Google userinfo error:', profile);
            throw new customError_1.BadRequestError('잘못된 요청입니다');
        }
        return profile;
    });
}
function setAuthCookies(res, { accessToken, refreshToken }) {
    res.cookie('access-token', accessToken, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 30 * 60 * 1000,
        path: '/'
    });
    res.cookie('refresh-token', refreshToken, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: '/'
    });
}
// 제네릭 활용한 타입선언...이렇게도 할 수 있구나
function stripPassword(user) {
    const { passwordHashed: _passwordHashed } = user, rest = __rest(user, ["passwordHashed"]);
    return rest;
}
function firstQuery(v) {
    if (typeof v === 'string')
        return v;
    if (Array.isArray(v))
        return typeof v[0] === 'string' ? v[0] : undefined;
    return undefined;
}
function requireQuery(value, name) {
    const v = Array.isArray(value) ? value[0] : value;
    // qs가 객체로 파싱한 케이스(ParsedQs)는 문자열로 쓸 수 없으니 거절
    if (typeof v !== 'string' || v.trim() === '') {
        throw new customError_1.BadRequestError(`${name}가 필요합니다`);
    }
    return v;
}
