import mongoose from "mongoose"

const connectDB = async() =>{
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}`)
        console.log(`Mongodb Connected to ${connectionInstance.connection.host}`)
    } catch (error) {
        console.log("Mongodb Connection Failed",error)
        process.exit(1)
    }
}

export default connectDB