import express from "express";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js"
import accountRouter from "./routes/account.routes.js"

const app = express();
app.use(express.json())
app.use(cookieParser())


// routes
//auth :
app.use("/api/auth", authRouter)

//account :
app.use("/api/accounts" , accountRouter)

export default app;