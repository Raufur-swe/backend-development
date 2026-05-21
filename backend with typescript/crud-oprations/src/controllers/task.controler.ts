import type { Request, Response } from "express";
import Task from "../models/task.model.js";

export const CreateTask = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { title, description } = req.body;

        if (!title || !description) {
            res.status(400).json({
                success: false,
                message: "All fields are required",
            });
            return;
        }

        const task = await Task.create({
            title,
            description,
        });

        res.status(201).json({
            success: true,
            message: "Task created successfully",
            data: task,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: `Internal server error: ${error.message}`,
        });
    }
};

export const updateTask = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params.id;
        const updatedTask = await Task.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        if (!updatedTask) {
            res.status(400).json({
                success: false,
                massage: "faild to update"
            })
        }
        res.status(201).json({
            success: true,
            message: "Task updated successfully",
            data: updatedTask,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: `Internal server error: ${error.message}`,
        });
    }
}

export const deleteTask = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params.id;
        const deletedTask = await Task.findByIdAndDelete(id, req.body,);
        if (!deletedTask) {
            res.status(400).json({
                success: false,
                massage: "faild to update"
            })
        }
        res.status(201).json({
            success: true,
            massage: "delete Successfully"
        })
    } catch (error:any) {
        res.status(500).json({
            success: false,
            message: `Internal server error: ${error.message}`,
        });
    }
}