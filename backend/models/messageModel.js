import mongoose from 'mongoose'



const messageSchema= new mongoose.Schema({
    senderId:{
        type:String
    },
    recieverId:{
        type:String
    },
    message:{
        type:String
    },
    date:{
        type:Date,
        default:Date.now
    },
    deliveryStatus:{
        type:String,
        default:"not"
    }
},{timestamps:true})




export default mongoose.model("message", messageSchema)