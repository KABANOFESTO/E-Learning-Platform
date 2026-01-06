"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
const PREFIX = process.env.PREFIX || '/api/v1';
app.use(express_1.default.json());
app.use(`${PREFIX}/auth`, auth_routes_1.default);
app.get('/', (req, res) => res.send('E-Learning Platform API'));
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
exports.default = app;
