"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = registerUser;
exports.loginUser = loginUser;
const user_model_1 = require("../models/user.model");
const role_enum_1 = require("../models/role.enum");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwt_config_1 = require("../config/jwt.config");
async function registerUser({ name, email, password, profilePicture }) {
    const existingUser = await user_model_1.prisma.user.findUnique({ where: { email } });
    if (existingUser)
        throw new Error('Email already in use');
    const hashedPassword = await bcrypt_1.default.hash(password, 10);
    const user = await user_model_1.prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            profilePicture: profilePicture || '',
            role: role_enum_1.Role.LEARNER,
        },
    });
    return user;
}
async function loginUser({ email, password }) {
    const user = await user_model_1.prisma.user.findUnique({ where: { email } });
    if (!user)
        throw new Error('Invalid credentials');
    const valid = await bcrypt_1.default.compare(password, user.password);
    if (!valid)
        throw new Error('Invalid credentials');
    const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role }, jwt_config_1.JWT_SECRET, { expiresIn: jwt_config_1.JWT_EXPIRES_IN });
    return { token, user };
}
