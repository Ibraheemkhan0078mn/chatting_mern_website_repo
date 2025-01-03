import mongoose from "mongoose";




const conversationSchema= new mongoose.Schema({
    participants:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref: "user"
        }
    ],
    messages:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"message"
        }
    ],
    conversationType:{
        type:String
    }
},{timestamps:true})









export default mongoose.model("conversation", conversationSchema)