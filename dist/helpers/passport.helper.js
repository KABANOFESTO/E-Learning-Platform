"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_jwt_1 = require("passport-jwt");
const user_model_1 = require("../models/user.model");
const jwt_config_1 = require("../config/jwt.config");
const opts = {
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: jwt_config_1.JWT_SECRET,
};
passport_1.default.use(new passport_jwt_1.Strategy(opts, async (jwt_payload, done) => {
    try {
        const user = await user_model_1.prisma.user.findUnique({ where: { id: jwt_payload.userId } });
        if (user)
            return done(null, user);
        return done(null, false);
    }
    catch (err) {
        return done(err, false);
    }
}));
exports.default = passport_1.default;
