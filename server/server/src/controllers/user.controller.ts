import { Request, Response } from "express";
import User, { IUser } from "../models/user.model"; 
import bcrypt from "bcryptjs";
import { isValidObjectId } from 'mongoose';
import { uploadOnCloudinary } from "../utils/cloudinary"



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
        const updatedData: Partial<IUser> = req.body; // Use Partial<IUser> to allow for optional fields

        // Hash the password if it is being updated
        if (updatedData.password) {
            const salt = await bcrypt.genSalt(10);
            updatedData.password = await bcrypt.hash(updatedData.password, salt);
        }

        // Check if files are provided for updating the profile picture
        if (req.files) {
            const files = req.files as { [fieldname: string]: Express.Multer.File[] };
            const avatarLocalPath = files?.profilePic ? files.profilePic[0] : null;

            if (avatarLocalPath) {
                const avatar = await uploadOnCloudinary(avatarLocalPath.path); // Assuming this function uploads to Cloudinary and returns the URL
                const profilePicUrl: string | undefined = avatar?.url;

                // Only update profilePicUrl if a new picture is provided
                updatedData.profilePicUrl = profilePicUrl;
            }
        }

        // Optionally, handle incoming refresh token (if needed)
        const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
        if (incomingRefreshToken) {
            updatedData.refreshToken = incomingRefreshToken;
        }

        console.log("updatedData:", updatedData);
        const user: IUser | null = await User.findByIdAndUpdate(id, updatedData, { new: true, runValidators: true });

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