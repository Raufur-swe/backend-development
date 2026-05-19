import dns from "dns";
import express from "express";
import mongoose from "mongoose";
const app = express();
const port = 3000;
const pass = "raufur1";
const mongoURL ="mongodb+srv://raufur271_db_user:raufur1@cluster0.jtzeff5.mongodb.net/?appName=Cluster0";
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
app.listen(port, () => {
  connectDB();
  console.log(`server is listening at port ${port}`);
});
