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
exports.googleAccessTokenCache = void 0;
exports.getGoogleAccessToken = getGoogleAccessToken;
const lru_cache_1 = require("lru-cache");
const prismaClient_1 = require("./prismaClient");
const customError_1 = require("../middlewares/errors/customError");
const crypto_token_1 = require("./crypto.token");
exports.googleAccessTokenCache = new lru_cache_1.LRUCache({
    max: 5000, // 유저 수에 맞게 조절
    ttlAutopurge: true
});
// ttlAutopurge: true - 시간이 지나서 만료된 항목을 캐시가 알아서 제거(purge)
// 그래서 캐시에 “만료된 찌꺼기”가 오래 남아있지 않게 됨.
// 메모리 관리가 더 깔끔해짐.
// 동시에 여러 요청이 들어오면 refresh가 중복 호출되는 걸 막기 위한 “single-flight”
// userId별로 refresh 중인 Promise를 저장했다가 같이 기다리게 함
const inFlightRefresh = new Map(); // key -> Promise<string>, 불필요한 중복 호출, 느려짐 방지
// Map
// 역할: 키 → 값 저장
// 특징:
// 용량 제한 없음(계속 넣으면 메모리 계속 먹음)
// 만료(TTL) 없음(직접 지워야 함)
// 오래된 것 자동 삭제 없음
// 언제 쓰나: 간단히 테스트/소규모, 직접 만료 로직을 짤 때
function refreshGoogleAccessToken(refreshToken) {
    return __awaiter(this, void 0, void 0, function* () {
        const clientId = process.env.GOOGLE_CLIENT_ID;
        const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
        if (!clientId || !clientSecret)
            throw new Error('Missing GOOGLE_CLIENT_ID/SECRET');
        const resRefresh = yield fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                client_id: clientId,
                client_secret: clientSecret,
                refresh_token: refreshToken,
                grant_type: 'refresh_token'
            })
        });
        const json = yield resRefresh.json();
        if (!resRefresh.ok) {
            // ok가 true/false 되는 기준
            // tokenRes.ok === true → HTTP 상태 코드가 200~299 (성공 응답)
            // tokenRes.ok === false → 그 외 전부 (예: 400, 401, 403, 500 등)
            // 대표 케이스: invalid_grant (사용자가 권한 철회, refresh 토큰 무효화 등)
            throw new customError_1.UnauthorizedError(`Google refresh failed`);
        } //구글 연동 실패니 다시 로그인하라!
        // { access_token, expires_in, scope?, token_type? }
        if (!json.access_token || typeof json.expires_in !== 'number') {
            throw new customError_1.UnauthorizedError('Google refresh response missing fields');
        } //정상적인 토큰을 받았다고 믿기 어려움!
        return { accessToken: json.access_token, expiresInSec: json.expires_in, scope: json.scope };
    });
}
/* 캐시 기반 access token 획득
 * - 캐시에 유효 토큰 있으면 그대로 사용
 * - 없거나 만료면 DB에서 refreshTokenEnc 복호화 → refresh → 캐시에 저장
 * - access_token은 DB에 저장하지 않음
 */
//
//==============================================
function setCacheGoogleToken(userId, cacheKey) {
    return __awaiter(this, void 0, void 0, function* () {
        const account = yield prismaClient_1.prisma.oAuthAccount.findFirst({
            where: { userId, provider: 'GOOGLE' },
            select: { refreshTokenEnc: true }
        });
        if (!(account === null || account === void 0 ? void 0 : account.refreshTokenEnc)) {
            throw new customError_1.UnauthorizedError('Google not connected (missing refresh token)');
        }
        const refreshToken = (0, crypto_token_1.decryptToken)(account.refreshTokenEnc);
        if (!refreshToken) {
            throw new customError_1.UnauthorizedError('Refresh token decrypt failed');
        }
        const { accessToken, expiresInSec } = yield refreshGoogleAccessToken(refreshToken);
        //date.now는 밀리초 단위
        //구글이 주는 expires_in은 (초) 단위값 을 줆, 그래서 *1000으로 밀리초 단위로 변환
        //현재시각 + 1시간 = 밀리초 단위 값
        const expiresAtMs = Date.now() + expiresInSec * 1000;
        //엑세스 토큰을 메모리 캐시에 저장하기
        //캐시키는 getGoogleAccessToken함수에서 설정해서 사용
        exports.googleAccessTokenCache.set(cacheKey, { token: accessToken, expiresAtMs }, { ttl: Math.max(1, expiresInSec - 60) * 1000 } // 실제 값보다 60초 일찍 캐시에서 만료 처리, 네트워크 지연이나 서버 시간 오차 등의 이유로
        );
        return accessToken;
    });
}
// 캐시에서 구글 리프레시 토큰으로 엑세스 토큰 발급받는 흐름! (바로 밑의 함수)
// 캐시키로 캐시에 있는 access token 확인
// 있어? 그럼, 그 토큰 그대로 써! ( ttl로 남은시간이 60초가 되면 캐시 삭제됨, ttl을 신뢰한다는 가정하에?)
// 지금 같은 키로 refresh 중인 Promise가 있나?
// 있으면 그 Promise 결과 기다려서 같이 써!
// 위에 다 아니면
// DB에서 구글 refresh token 복호화해서 가져오고
// 구글에 grant_type=refresh_token으로 요청해서 새 access token 발급
// 그걸 캐시에 set 하고 반환!
function getGoogleAccessToken(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const cacheKey = `google:access:${userId}`;
        const cached = exports.googleAccessTokenCache.get(cacheKey);
        // 캐시에 저장할 때는 “키(key)”가 필요함. (사물함 번호 같은)
        // 여기서는 유저마다 토큰이 다르니까, 유저별로 고유한 키를 만듦.
        // 예를 들어 userId = 24
        // cacheKey = "google:access:24"
        // google: 이런 접두사는 그냥 관례임.
        // 같은 캐시에 다른 데이터도 넣을 수 있으니 이름 공간을 분리하려고 붙임.
        if (cached === null || cached === void 0 ? void 0 : cached.token) {
            return cached.token;
        }
        // single-flight: 이미 refresh 중이면 그 Promise를 기다림
        const inFlight = inFlightRefresh.get(cacheKey);
        if (inFlight)
            return yield inFlight;
        const refreshPromise = setCacheGoogleToken(userId, cacheKey);
        inFlightRefresh.set(cacheKey, refreshPromise);
        try {
            return yield refreshPromise;
        }
        finally {
            inFlightRefresh.delete(cacheKey);
        }
    });
}
