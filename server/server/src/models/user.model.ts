import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export interface IUser extends Document {
    _id: string; 
    username: string;
    email: string;
    contact: string;
    password: string;
    profilePicUrl: string;
    refreshToken?: string;
    matchPassword(enteredPassword: string): Promise<boolean>;
    generateAccessToken(): Promise<string>;
    generateRefreshToken(): Promise<string>;
}

const userSchema = new Schema<IUser>({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        // unique: true,
    },
    contact: {
        type: String,
        required: true,
        // unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    profilePicUrl: {
        type: String,
        default: 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg',
    },
    refreshToken: {
        type: String,
        default: null,
    },
}, { timestamps: true });

userSchema.methods.matchPassword = async function (enteredPassword: string): Promise<boolean> {
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.generateAccessToken = async function (): Promise<string> {
        console.log(process.env.ACCESS_TOKEN_EXPIRY);

    return jwt.sign(
        {
            id: this._id,
        },
        process.env.ACCESS_TOKEN_SECRET || '',
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '2h',
            // expiresIn:'3s',
        }
    );
};

userSchema.methods.generateRefreshToken = async function (): Promise<string> {
    return jwt.sign(
        {
            id: this._id,

        },
        process.env.REFRESH_TOKEN_SECRET || '',
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '30d',
        }
    );
};

const User = mongoose.model<IUser>("User", userSchema);
export default User;
