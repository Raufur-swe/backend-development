import dns from "dns";
import express from "express";
import mongoose from "mongoose";
import User from "./model/user.model.js";
const app = express();
app.use(express.json());
const port = 3000;
const pass = "raufur1";
const mongoURL =
  "mongodb+srv://raufur271_db_user:raufur1@cluster0.jtzeff5.mongodb.net/?appName=Cluster0";
// Change DNS
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURL);
    console.log("MongoDB connected");
  } catch (error) {
    console.log("Failed to connect db");
    console.log(error);
  }
};

// creating user for db
app.post("/create", async (req, res) => {
  try {
    let { name, age, password, userName } = req.body;
    const newUser = await User.create({
      name,
      age,
      password,
      userName,
    });
    return res.status(201).json({ massage: "User created succesfully" });
  } catch (error) {
    res.status(400).json({ massage: error });
  }
});
//all users
app.get("/users", async (req, res) => {
  try {
    const user = await User.find();
    res.send(user);
  } catch (error) {
    console.log("no users", error);
  }
});
//find a user
app.get("/read/:userName", async (req, res) => {
  try {
    const users = await User.findOne({ userName: req.params.userName });
    return res.status(201).json(users);
  } catch (error) {
    res.status(400).json({ massage: error });
  }
});

// update user
// app.put("/update/:id",async(req,res)=>{
//   try {
//     let {name ,userName} =req.body
//   let id = req.params.id
//   const user = await User.findByIdAndUpdate(id ,{name ,userName},{ returnDocument: "after"})
//   res.status(201).json(user,{massageL:"update successfully"})
//   } catch (error) {
//     res.status(400).json({ massage: error });
//   }
// })

// unique method of update . we want update username by its name
app.put("/update", async (req, res) => {
  try {
    let { name, userName } = req.body;
    let id = req.params.id;
    const user = await User.updateOne(
      { name }, // update by name
      { userName },//` update username
      { returnDocument: "after" },
    );
    res.status(201).json(user, { massageL: "update successfully" });
  } catch (error) {
    res.status(400).json({ massage: error });
  }
});

// delete
app.delete("/delete", async (req, res) => {
  try {
    let { userName } = req.body;
    console.log(req.body);
    console.log(userName);
    const user = await User.deleteOne({ userName });
    res.status(201).json(user, { massages: "delete successfully" });
  } catch (error) {
    res.status(400).json({ massage: error });
  }
});

app.listen(port, () => {
  connectDB();
  console.log(`server is listening at port ${port}`);
});
