import express from "express";
import dotenv from "dotenv"
import dns from "dns"
import connctDb from "./congig/db.js";
import cors from "cors"
import taskRoutes from "./routes/task.router.js"
import { debug } from "console";
debug:true

dotenv.config()
const app = express();
const port = 5000;
dns.setServers(["1.1.1.1", "8.8.8.8"]);
app.use(express.json())
app.use(cors())

app.get("/",(req ,res)=>{
    res.send("server is running")
})
app.use("/api/task",taskRoutes)
app.listen(port, () => {
    console.log(`server is running at ${port}`);
    connctDb()
});
