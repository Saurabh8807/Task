import { Request, Response } from "express";
import Task, { ITask } from "../models/task.model";
import { IUser } from "../models/user.model";
import { CustomRequest } from "../middleware/auth.middleware"; 

export const createTask = async (req: CustomRequest, res: Response): Promise<any> => {
  const { name, priority, deadline } = req.body;
  const userId = req.user._id; 

  try {
    const existingTask = await Task.findOne({ name, userId });
    if (existingTask) {
      return res.status(400).json({ message: "Task with this name already exists." });
    }

    const newTask: ITask = new Task({ name, stage: 0, userId, priority, deadline }); 
    await newTask.save();

    return res.status(201).json({ message: "Task created successfully", task: newTask });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ message: "Failed to create task", error: error.message });
  }
};

export const getUserTasks = async (req: CustomRequest, res: Response): Promise<any> => {
    const userId = req.user._id; 

    if(!userId){
        return res.status(401).json({ message: "token not valid" });

    }
    try {
        const tasks = await Task.find({ userId }).populate("userId");


        return res.status(200).json(tasks);
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({ message: "Failed to retrieve tasks", error: error.message });
    }
};

export const updateTask = async (req: CustomRequest, res: Response): Promise<any> => {
    const { id } = req.params; 
    const userId = req.user._id; 
    const updatedData = req.body;

    try {
        const task = await Task.findOne({ _id: id, userId }); 
        if (!task) {
            return res.status(404).json({ message: "Task not found or not owned by user" });
        }

        if (updatedData.name !== undefined) {
            task.name = updatedData.name;
        }
        if (updatedData.priority !== undefined) {
            task.priority = updatedData.priority;
        }
        if (updatedData.deadline !== undefined) {
            task.deadline = updatedData.deadline;
        }

        await task.save();

        return res.status(200).json({ message: "Task updated successfully", task });
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({ message: "Failed to update task", error: error.message });
    }
};

export const deleteTask = async (req: CustomRequest, res: Response): Promise<any> => {
    const { id } = req.params;
    const userId = req.user._id; 

    try {
        const deletedTask = await Task.findOneAndDelete({ _id: id, userId }); 
        if (!deletedTask) {
            return res.status(404).json({ message: "Task not found or not owned by user" });
        }

        return res.status(200).json({ message: "Task deleted successfully" });
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({ message: "Failed to delete task", error: error.message });
    }
};

export const completeTask = async (req: CustomRequest, res: Response): Promise<any> => {
    const { id } = req.params;
    const userId = req.user._id; 

    try {
        const task = await Task.findOne({ _id: id, userId });
        if (!task) {
            return res.status(404).json({ message: "Task not found or not owned by user" });
        }

        task.stage = 3; 
        await task.save();

        return res.status(200).json({ message: "Task completed successfully", task });
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({ message: "Failed to complete task", error: error.message });
    }
};

export const moveTask = async (req: CustomRequest, res: Response): Promise<any> => {
    const { id, direction } = req.params; 
    const userId = req.user._id; 

    console.log(req.user)
    console.log(id,direction)

    try {
        const task = await Task.findOne({ _id: id, userId }); 
        if (!task) {
            return res.status(404).json({ message: "Task not found or not owned by user" });
        }

        const newStage = direction === 'forward' ? task.stage + 1 : task.stage - 1;
        
        if (newStage < 0 || newStage > 3) {
            return res.status(400).json({ message: "Invalid stage movement" });
        }

        task.stage = newStage;
        await task.save();

        return res.status(200).json({ message: "Task stage updated successfully", task });
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({ message: "Failed to move task", error: error.message });
    }
};
