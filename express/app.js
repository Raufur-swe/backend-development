// creating my first servere
import express from "express"

const app = express()
const PORT = 3000;
app.use(express.json()) // express middleware
// route
app.get("/",(req,res)=>{
    return res.end("This is Home page with the help of express js")
})
app.get("/about",(req,res)=>{
    return res.end("This is about page with the help of express js")
})

//req.params
let employee = [
  {
    "id": 1,
    "name": "John Doe",
    "age": 29,
    "department": "Engineering",
    "position": "Software Developer",
    "salary": 65000,
    "email": "john.doe@example.com",
    "isActive": true
  },
  {
    "id": 2,
    "name": "Sarah Smith",
    "age": 34,
    "department": "Human Resources",
    "position": "HR Manager",
    "salary": 72000,
    "email": "sarah.smith@example.com",
    "isActive": true
  },
  {
    "id": 3,
    "name": "Michael Johnson",
    "age": 27,
    "department": "Marketing",
    "position": "Marketing Executive",
    "salary": 54000,
    "email": "michael.johnson@example.com",
    "isActive": false
  },
  {
    "id": 4,
    "name": "Emily Davis",
    "age": 31,
    "department": "Finance",
    "position": "Financial Analyst",
    "salary": 68000,
    "email": "emily.davis@example.com",
    "isActive": true
  },
  {
    "id": 5,
    "name": "David Wilson",
    "age": 38,
    "department": "Sales",
    "position": "Sales Manager",
    "salary": 75000,
    "email": "david.wilson@example.com",
    "isActive": true
  }
]
app.get("/employee",(req,res)=>{
    return res.json(employee)
})
app.get("/employee/:id",(req , res)=>{
    let id = req.params.id
    let existUser = employee.find((employee)=>employee.id == id)
    if(!existUser){
          console.log(`No such employee of ${id}`)
        return res.end(`No such employee of ${id}`)
    }
    res.json(existUser)
})


//req.quuery 
app.get("/search",(req , res)=>{
    let query = req.query
    console.log(query);
    
     return res.end('this is query peramiter page ')    
})

// custom middleware
let password = 1234
app.use((req ,res ,next)=>{
  if(req.body.password !== password){
    res.send("invalid credentials")
  }
  next()
})
app.post("/middleware" ,(req ,res)=>{
  console.log(req.body);
  return res.send({success : true})
  
})
//server is listing or creating first server
app.listen(PORT,()=>{
    console.log(`server is running at the ${PORT}`);
    
})