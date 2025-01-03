import express from 'express'
const router = express.Router()
import dotenv from 'dotenv'
dotenv.config()
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import userModel from '../models/userModel.js'
import conversationModel from '../models/conversationModel.js'
import blockedJwtModel from '../models/blockJwt.js'
import isLoggedIn from '../controllers/isLoggedIn.js'
import {v2 as cloudinary} from 'cloudinary'
import {CloudinaryStorage} from 'multer-storage-cloudinary'
import multer from 'multer'



 












// let cloud_name= process.env.cloud_name
// let api_key= process.env.api_key
// let api_secret= process.env.api_secret
// console.log(cloud_name, api_key, api_secret, process.env.PORT, process.env.user_secret_key)


cloudinary.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret,
  });


 




const storage= new CloudinaryStorage({
    cloudinary:cloudinary,
    params:{
        folder:'upload/chating-app/registration/user',
        allowed_formats:['jpeg', 'jpg', 'png']
    }
})


const upload= multer({storage})





















    


router.post("/registration", upload.single("image"),async (req, res) => {



    try{


        
    let { username, email, password, phoneNo } = req.body;

    if (username == "" && email == "" && phoneNo == "" && password == "" && !username && !email && !phoneNo && !password) {
        return res.status(500).json({ status: "failed", msg: 'required all fields' })
    }


    let existingUser= await userModel.findOne({phoneNo:phoneNo})

    if(existingUser){
        return res.send({status:"present", msg:"Already present"})
    }


    



    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, async (err, hash) => {

            if(req.file){
                let createdUser = await userModel.create({
                    imageUrl: req.file.path,
                    username,
                    email,
                    phoneNo,
                    password: hash
                })
                let token = jwt.sign({ id: createdUser._id, phoneNo, password: createdUser.password, email }, process.env.user_secret_key)
                return res.status(200).cookie("userToken", token).send({ status: "success",msg:"The user is successfully registered", createdUser })
               


            }else{
                let createdUser = await userModel.create({
                    username,
                    email,
                    phoneNo,
                    password: hash
                })


                console.log(process.env.user_secret_key)
 
                let token = jwt.sign({ id: createdUser._id, phoneNo, password: createdUser.password, email }, process.env.user_secret_key)
                return res.status(200).cookie("userToken", token).send({ status: "success",msg:"The user is successfully registered", createdUser })
               
            }
         

           
           

        })
    })





    }catch(error){
        return res.send({status:"error", msg:"Something went wrong in the server in try catch of registration route for user"})
    }


})





















router.post("/login", async (req, res) => {
   


    try{
        let { phoneNo, password } = req.body;

        // console.log(phoneNo, password)

        if (phoneNo == "" && password == "" && !phoneNo && !password) {
            return res.json({ status: "emptyField", msg: "Required all fields" })
        }
    
    
    
    
        let exisitingUser = await userModel.findOne({ phoneNo: phoneNo })
        if (!exisitingUser) {
            return res.json({ status: "failed", msg: "Please sign in again." })
        }
    
    
    
    
    
        let result = await bcrypt.compare(password, exisitingUser.password)
        if (result) {
            let token = jwt.sign({ id: exisitingUser._id, phoneNo, password: exisitingUser.password, email: exisitingUser.email }, process.env.user_secret_key)
            res.status(200).cookie("userToken", token).send({ status: "success", msg: "successfully logged in" })
        }
    
    
    
    }catch(error){
        res.send({status:"error", msg:"Something went wrong in the server. so please restart it and try again"})
    }




})




















router.get("/logout", async (req, res)=>{
    try{

        let userJwtToken= req.cookies.userToken

        if(!userJwtToken){
            return res.send({status:"failed", msg:"jwt is not found in frontend cookie"})
        }else{
            await blockedJwtModel.create({
                token:userJwtToken
            })

            return res.clearCookie("userToken").send({status:"success", msg:"The user is successfully logout and jwt is blocked"})
        }

    }catch(err){
        return res.send({status:"error", msg:"something went wrong in server", origin:"comming from try catch of logout route"})
    }
})



















router.post("/getAllCurrentConversationMsg",isLoggedIn, async (req, res) => {


    try {

        let { recieverId } = req.body;
        let userJwtToken = req.cookies.userToken;

        if (!userJwtToken) {
            return res.send({ status: "failed", msg: "jwt token is not found. login for jwt token" })
        }

        let decodedToken = jwt.verify(userJwtToken, process.env.user_secret_key)
        if (!decodedToken) {
            return res.send({ status: "failed", msg: "there is something wrong in jwt token . please login again" })
        }


        let currentUserId = decodedToken.id;

        let existingConversation = await conversationModel.findOne({ participants: { $all: [currentUserId, recieverId] } })
        if (!existingConversation) {
            return res.send({ status: "empty", msg: "conversation not found" })
        }


        if(existingConversation.messages.length  == 0){
            return res.send({ status: "empty", msg: "conversation is empty but found successfully" }) 
        }

        let allCurrentConversationMessagesArray = await existingConversation.populate("messages");
        // await conversationModel.save()         // we save only when we change something but here we only get the copy of messages array id and then populate it
        res.send({ status: 'success', allCurrentConversationMessagesArray, currentUserId, msg: "The messeges is successfully found" })


    } catch (error) {
        console.log(error)
        return res.send({ status: 'error', msg: "there is something went wrong in this route", error })
    }


})






 

 








router.get("/getActiveUser",isLoggedIn, async (req, res) => {
    try {


        let token = req.cookies.userToken;
        if (!token) {
            return res.send({ status: "failed", msg: "login again. no token is present" })
        }




        let decodedToken = jwt.verify(token, process.env.user_secret_key)
        if (!decodedToken) {
            return res.send({ status: "failed", msg: "some error in token decoded process. login agian" })
        }





        if (decodedToken) {
            let currentUserId= decodedToken.id;
            let users = await userModel.find()
            if (users) {
                return res.send({ status: "success", AllUsersArray: users, currentUserId })
            }

            res.send("something went wrong in /api/userRoutes/getActiveUser")
        }


    } catch (err) {
        return res.send({ status: "error", error: err, msg: "from tryCatch of getActiveUser" })
    }
})





































export default router;