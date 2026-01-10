"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireDevice = requireDevice;
const token_1 = require("../lib/token");
const customError_1 = require("./errors/customError");
const oAuth_1 = require("../lib/utils/oAuth");
function requireDevice(req, _res, next) {
    var _a;
    const fromHeader = (_a = req.get('x-device-id')) !== null && _a !== void 0 ? _a : undefined;
    const fromQuery = (0, oAuth_1.firstQuery)(req.query.device_id);
    const deviceId = fromHeader !== null && fromHeader !== void 0 ? fromHeader : fromQuery;
    if (!deviceId) {
        throw new customError_1.BadRequestError('deviceId가 필요합니다');
    }
    req.deviceId = deviceId;
    req.deviceIdHash = (0, token_1.sha256)(deviceId);
    next();
}
