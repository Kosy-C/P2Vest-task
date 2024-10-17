"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const DB_config_1 = require("./DB.config");
const adminRoute_1 = __importDefault(require("./routes/adminRoute"));
const userRoute_1 = __importDefault(require("./routes/userRoute"));
const taskRoutes_1 = __importDefault(require("./routes/taskRoutes"));
require('dotenv').config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, morgan_1.default)("dev"));
//this calls the database connection
(0, DB_config_1.connectDB)();
app.use("/admins", adminRoute_1.default);
app.use("/user", userRoute_1.default);
app.use("/", taskRoutes_1.default);
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
exports.default = app;
