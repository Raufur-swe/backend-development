import express from "express"
import dotenv from "dotenv"
import dns from "dns"
import connectDb from "./config/db.js"
import { createClient } from "redis"

// dns server
dns.setServers(["1.1.1.1" , "8.8.8.8"])
dotenv.config()

//connect db
await connectDb()

//redis url
const redisUrl = process.env.REDIS_URI
if(!redisUrl){
    console.log("missing url")
    process.exit(1)
}
export const redisClient = createClient({
    url : redisUrl,
})
redisClient.connect().then(()=>console.log("redis conncted")).catch(console.error)



//define express and json
const app = express()
app.use(express.json())

// import routes
import UserRoutes from "./routes/user.routes.js"
app.use("/api/auth" , UserRoutes)


//connect server
const PORT = process.env.PORT || 5000
app.listen(PORT,()=>{
    console.log(`server is running at the port:${PORT}`)
    
})


