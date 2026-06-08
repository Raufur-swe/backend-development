import mongoose from "mongoose"


const connectDb = async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI),{
            dbName : "MernAuthentication"
        }
        console.log("Databse connect successfully")
    } catch (error) {
        console.log("failed to connect db" ,error)
    }
}

export default connectDb