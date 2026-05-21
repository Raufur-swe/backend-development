import mongoose, { Schema } from "mongoose";
const taskSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
    },
    complete: {
        type: Boolean,
        default: false
    },
}, { timestamps: true });
const Task = mongoose.model("Task", taskSchema);
export default Task;
//# sourceMappingURL=task.model.js.map