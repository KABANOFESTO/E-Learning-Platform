"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
const auth_service_1 = require("../services/auth.service");
const auth_validator_1 = require("../validators/auth.validator");
async function register(req, res) {
    try {
        const { error, value } = auth_validator_1.registerSchema.validate(req.body);
        if (error)
            return res.status(400).json({ error: error.details[0].message });
        let profilePicture = value.profilePicture;
        if (req.file && req.file.path) {
            profilePicture = req.file.path;
        }
        const user = await (0, auth_service_1.registerUser)({ ...value, profilePicture });
        res.status(201).json({ user });
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
}
async function login(req, res) {
    try {
        const { error, value } = auth_validator_1.loginSchema.validate(req.body);
        if (error)
            return res.status(400).json({ error: error.details[0].message });
        const { token, user } = await (0, auth_service_1.loginUser)(value);
        res.status(200).json({ token, user });
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
}
