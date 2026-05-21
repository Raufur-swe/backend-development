import mongoose from "mongoose"

const connctDb = async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URL as string)
        console.log("Database connected successfully")
    } catch (error) {
        console.log("db connected error" , error)
        process.exit(1)
    }
}
export default connctDb