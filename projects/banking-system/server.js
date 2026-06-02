import app from "./src/app.js";
import dotenv from "dotenv"
import connectDb from "./src/config/db.js";
import dns from "dns";
dotenv.config()

dns.setServers(["1.1.1.1", "8.8.8.8"])


app.listen(3000, async () => {
    await connectDb()
    console.log("Server is running on port 3000");
})