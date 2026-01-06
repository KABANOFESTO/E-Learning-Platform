"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const cloudinary_helper_1 = require("../helpers/cloudinary.helper");
const router = (0, express_1.Router)();
router.post('/register', cloudinary_helper_1.upload.single('profilePicture'), auth_controller_1.register);
router.post('/login', auth_controller_1.login);
exports.default = router;
