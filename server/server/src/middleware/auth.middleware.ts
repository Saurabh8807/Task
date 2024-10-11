import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.model";

export interface CustomRequest extends Request {
  user?: any;
}

const verifyJwt = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.cookies.accessToken || req.headers.authorization?.split(" ")[1];

    if (!token) {
      res.status(401).json({ message: "No token provided. Access denied." });
      return ;
    }

    const decoded: any = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!);

    const user = await User.findById(decoded.id).select("-password"); 

    if (!user) {
      res.status(401).json({ message: "Invalid token. User not found." });
      return ;
    }

    req.user = user; 
    console.log("verify jwt passed")
    // next();
  } catch (error: any) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ message: "Invalid or expired token" });
      return ;
    }
    res.status(500).json({ message: "Internal server error" });
    return ;
  }
};

export default verifyJwt;
