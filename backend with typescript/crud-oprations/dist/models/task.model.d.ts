import mongoose from "mongoose";
import type { ITask } from "../interfaces/task.interface.js";
declare const Task: mongoose.Model<ITask, {}, {}, {}, mongoose.Document<unknown, {}, ITask, {}, mongoose.DefaultSchemaOptions> & ITask & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}, any, ITask>;
export default Task;
//# sourceMappingURL=task.model.d.ts.map