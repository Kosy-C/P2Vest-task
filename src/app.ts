import express from "express";
import logger from "morgan";
import { connectDB } from "./DB.config";
import adminRouter from "./routes/adminRoute";
import userRouter from "./routes/userRoute";
import taskRouter from "./routes/taskRoutes";

require ('dotenv').config();

const app = express();

app.use(express.json());
app.use(logger("dev"));

//this calls the database connection
connectDB();

app.use("/admins", adminRouter);
app.use("/user", userRouter);
app.use("/", taskRouter);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
});

export default app;