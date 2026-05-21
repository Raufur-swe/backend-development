import mongoose, { Schema } from "mongoose";
import type { ITask } from "../interfaces/task.interface.js";

const taskSchema = new Schema<ITask>({
    title:{
        type : String,
        required : true,
        trim:true
    },
    description:{
        type :String,
        required : true,

    },
    complete:{
        type : Boolean,
        default: false
    },
},{timestamps:true})


const Task = mongoose.model<ITask>("Task",taskSchema);

export default Task