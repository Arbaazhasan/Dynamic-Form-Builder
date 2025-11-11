import { config } from "dotenv";
import express from "express";
import errorMiddleware from "./middleware/Error.js";
import db_connect from "./data/db_connect.js";

import adminAuthRouter from "./router/admin.auth.router.js"

config({
    path: "./data/config.env"
})

db_connect();

const app = express();

app.use(express.json())

const PORT = process.env.PORT || 5000;

app.use("/api/v1/admin", adminAuthRouter)

app.listen(PORT, () => {
    console.log(`Server running on port : ${PORT}`);
});

app.use(errorMiddleware)