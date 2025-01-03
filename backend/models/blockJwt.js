import mongoose from "mongoose";




const blockedJstSchema = new mongoose.Schema({

    token: {
        type: String,
        required: true 
    },
    date:{
        type:Date,
        default:Date.now
    }


},{timestamps:true});




const blockedJwtModel = mongoose.model("blockedJwt",blockedJstSchema);


export default blockedJwtModel;