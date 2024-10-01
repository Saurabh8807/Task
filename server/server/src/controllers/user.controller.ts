import { Request, Response } from "express";
import User, { IUser } from "../models/user.model"; 
import bcrypt from "bcryptjs";
import { isValidObjectId } from 'mongoose';



export const getUserById = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        console.log(id)

        if (!isValidObjectId(id)) {
            return res.status(400).json({ message: "Invalid user ID format" });
        }

        const user: IUser | null = await User.findById(id).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ user, message: "User fetched successfully" });
    } catch (error: any) {
        console.error("Error fetching user:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getAllUsers = async (req: Request, res: Response): Promise<any> => {
    try {
        const users = await User.find().select("-password")
        return res.status(200).json({ users, message: "All users fetched successfully" });
    } catch (error: any) {
        console.error("Error fetching users:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const updateUserById = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        const updatedData = req.body;

        if (updatedData.password) {
            const salt = await bcrypt.genSalt(10);
            updatedData.password = await bcrypt.hash(updatedData.password, salt);
        }

        const user: IUser | null = await User.findByIdAndUpdate(id, updatedData, { new: true, runValidators: true })

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ user, message: "User updated successfully" });
    } catch (error: any) {
        console.error("Error updating user:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const deleteUserById = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;

        const user: IUser | null = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ message: "User deleted successfully" });
    } catch (error: unknown) {
        console.error("Error deleting user:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};