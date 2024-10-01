import mongoose, {Schema,Document} from "mongoose"

export interface ITask extends Document {
    name:String;
    stage:number;
    userId:mongoose.Types.ObjectId;
    priority?:string;
    deadline:Date
}

const taskSchema: Schema = new Schema({
    name:{
        type:String,
        required:true,
        unique: true,
    },
    stage: {
        type: Number,
        required: true,
        enum: [0, 1, 2, 3], 
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User", 
    },
    priority: {
        type: String,
        enum: ["Low", "Medium", "High"], 
    },
    deadline: {
        type: Date,
    },

},{timestamps:true})


const Task = mongoose.model<ITask>("Task", taskSchema);
export default Task;