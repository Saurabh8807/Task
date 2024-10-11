import mongoose, {Schema,Document} from "mongoose"

export interface ITask extends Document {
    name:String;
    stage:number;
    userId:mongoose.Types.ObjectId;
    priority?:number;
    deadline:Date
}

const taskSchema: Schema = new Schema({
    name:{
        type:String,
        required:true,
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
        type: Number,
        enum: [0, 1, 2], 
        required:true
    },
    deadline: {
        type: Date,
    },

},{timestamps:true})


const Task = mongoose.model<ITask>("Task", taskSchema);
export default Task;