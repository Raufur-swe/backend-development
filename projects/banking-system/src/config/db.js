import mongoose from "mongoose"


const connectDb = async ()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("db connect successfully")
    } catch (error) {
         console.log("db connected error" , error)
        process.exit(1)
    }
}

export default connectDb