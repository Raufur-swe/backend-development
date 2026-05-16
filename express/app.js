// creating my first servere
import express from "express"

const app = express()
const PORT = 3000;
// route
app.get("/",(req,res)=>{
    return res.end("This is Home page with the help of express js")
})
app.get("/about",(req,res)=>{
    return res.end("This is about page with the help of express js")
})
//server is listing or creating first server
app.listen(PORT,()=>{
    console.log(`server is running at the ${PORT}`);
    
})