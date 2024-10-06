import { Request, Response } from "express";
import User, { IUser } from "../models/user.model"; 
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { uploadOnCloudinary } from "../utils/cloudinary"
import { CustomRequest } from "../middleware/auth.middleware";


export const registerUser = async (req: Request, res: Response): Promise<any> => {
  try {
      const { username, email, contact, password } = req.body;
      if([contact, email, username, password].some((field) => field?.trim() === "")){
        res.status(400).json("invalid fields")
     }
      const existingUser : IUser | null = await User.findOne({ email });
      if (existingUser) {
          return res
            .status(409)
            .json({ message: "User with this email already exists" });
      }

      const files = req.files as { [fieldname: string]: Express.Multer.File[] };

      const avatarLocalPath = files?.profilePic ? files.profilePic[0] : null;

      if (!avatarLocalPath) {
          return res.status(400).json({ message: "Profile picture is required." });
      }

      const avatar = await uploadOnCloudinary(avatarLocalPath.path); 
      const profilePicUrl : string | undefined = avatar?.url
      console.log(profilePicUrl)
      const user: IUser = new User({
          username,
          email,
          contact,
          password,
          profilePicUrl, 
      });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      const createdUser = await user.save();

      // const accessToken = await createdUser.generateAccessToken();
      // const refreshToken = await createdUser.generateRefreshToken();

      const options = {
          httpOnly: true,
          secure: true,
      };

      // createdUser.refreshToken = refreshToken;
      await createdUser.save();

      return res
          .status(201)
          // .cookie("accessToken", accessToken, options)
          // .cookie("refreshToken", refreshToken, options)    
          .json({ user: { id: createdUser._id, username: createdUser.username, email: createdUser.email, profilePic: profilePicUrl,contact:user.contact }, message: "User registered successfully" });
  } catch (error: any) {
      console.error("Error registering user:", error);
      return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const { email, password } = req.body;
        console.log(email)

        const user: IUser | null = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();

        const options = {
            httpOnly: true,
            secure: true, 
        };

        user.refreshToken = refreshToken;
        await user.save();

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json({ user: { id: user._id, username: user.username, email: user.email,profilePic:user.profilePicUrl,contact:user.contact }, message: "Login successful" });

    } catch (error: any) {
        console.error("Error logging in user:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const logoutUser = async (req: CustomRequest, res: Response): Promise<any> => {
    try {
        const userId = req.user._id; 
        console.log(req)

        const user: IUser | null  = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        user.refreshToken = ""; 
        await user.save();

        return res
            .status(200)
            .clearCookie("accessToken")
            .clearCookie("refreshToken")
            .json({ message: "Logout successful" });
    } catch (error: any) {
        console.error("Error logging out user:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const refreshAccessToken = async (req: Request, res: Response): Promise<any> => {
    try {
      const incomingRefreshToken =
        req.cookies?.refreshToken || req.body?.refreshToken;
  
      if (!incomingRefreshToken) {
        return res.status(401).json({ message: "No refresh token provided." });
      }
  
      const decodedToken: any = jwt.verify(
        incomingRefreshToken,
        process.env.REFRESH_TOKEN_SECRET as string
      );
  
      const user: IUser | null = await User.findById(decodedToken.id)
  
      if (!user) {
        return res.status(401).json({ message: "Invalid refresh token. User not found." });
      }
  
      if (incomingRefreshToken !== user.refreshToken) {
        return res.status(401).json({ message: "Invalid refresh token." });
      }
  
      const accessToken = await user.generateAccessToken();
      // const refreshToken = await user.generateRefreshToken();

      return res
        .status(200)
        .cookie("accessToken", accessToken, { httpOnly: true, secure: true })
        .cookie("refreshToken", incomingRefreshToken, {
          httpOnly: true,
          secure: true,
        })
        .json({
          user,
          accessToken,
          incomingRefreshToken,
          message: "Refresh token successful",
        });
    } catch (error: any) {
      console.error("Error refreshing token:", error);
      return res.status(401).json({ message: error.message || "Invalid refresh token." });
    }
  };