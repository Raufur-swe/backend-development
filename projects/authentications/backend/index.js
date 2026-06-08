import express from "express"
import dotenv from "dotenv"
import dns from "dns"
import connectDb from "./config/db.js"

// dns server
dns.setServers(["1.1.1.1" , "8.8.8.8"])
dotenv.config()

//connect db
await connectDb()

const app = express()
app.use(express.json())

// import routes
import UserRoutes from "./routes/user.routes.js"
app.use("/api/auth" , UserRoutes)

const PORT = process.env.PORT || 5000
app.listen(PORT,()=>{
    console.log(`server is running at the port ${PORT}`)
    
})


