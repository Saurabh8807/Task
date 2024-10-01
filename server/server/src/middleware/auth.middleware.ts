import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.model";

// Extend Request interface here
export interface CustomRequest extends Request {
  user?: any; // You can replace 'any' with a specific user type if you have one
}

const verifyJwt = async (req: CustomRequest, res: Response, next: NextFunction): Promise<any> => {
  try {
    const token = req.cookies.accessToken || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided. Access denied." });
    }

    const decoded: any = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!);

    const user = await User.findById(decoded.id).select("-password"); // Exclude password for security

    if (!user) {
      return res.status(401).json({ message: "Invalid token. User not found." });
    }

    // Attach the entire user object to the request
    req.user = user; 

    next();
  } catch (error: any) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default verifyJwt;
