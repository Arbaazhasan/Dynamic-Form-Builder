import { config } from "dotenv";
import express from "express";
import errorMiddleware from "./middleware/Error.js";
import db_connect from "./data/db_connect.js";
import cookieParser from "cookie-parser";

import adminAuthRouter from "./router/admin.auth.router.js"
import formsRouter from "./router/form.router.js"
import fieldRouter from "./router/field.router.js"
import submissionRouter from "./router/submission.router.js"


config({
    path: "./data/config.env"
})

db_connect();

const app = express();

app.use(express.json())
app.use(cookieParser())

const PORT = process.env.PORT || 5000;

app.use("/api/v1/admin", adminAuthRouter)
app.use("/api/v1/forms", formsRouter)
app.use("/api/v1/field", fieldRouter)
app.use("/api/v1/submission", submissionRouter)

app.listen(PORT, () => {
    console.log(`Server running on port : ${PORT}`);
});

app.use(errorMiddleware)