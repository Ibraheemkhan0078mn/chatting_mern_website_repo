import mongoose from 'mongoose'



const userSchema= new mongoose.Schema({
    imageUrl:{
        type:String
    },
    username:{
        type:String
    },
    email:{
        type:String
    }, 
    password:{
        type:String
    },
    phoneNo:{
        type:Number
    },
    socketId:{
        type:String
    },
    status:{
        type:String,
        default:"offline"
    },
    date:{
        type:Date,
        default:Date.now
    }
}, {timestamps:true})






export default mongoose.model("user", userSchema)








