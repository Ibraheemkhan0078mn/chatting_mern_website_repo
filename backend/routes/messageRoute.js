import express from 'express'
const router = express.Router()
import jwt from 'jsonwebtoken'
import conversationModel from '../models/conversationModel.js'
import messageModel from '../models/messageModel.js'













router.post("/sendMsg", async (req, res) => {


    try {


        let encryptJwtToken = req.cookies.userToken

        if (!encryptJwtToken) {
            return res.json({ status: "failed", msg: "not loggin" })
        }

        let decodedToken = jwt.verify(encryptJwtToken, process.env.user_secret_key)

        if (!decodedToken) {
            return res.json({ status: "failed", msg: "something went wrong in jwt" })
        }


        // console.log(decodedToken)
        let senderId = decodedToken.id;
        // console.log(senderId)
        let recieverId = req.body.recieverId;
        // console.log(recieverId)
        let message = req.body.msg;



        // $all lagane se array ka order matter nahi kare ga. chahe recieverId pehle hi laga do. ager $all hata diya to order strickly followed kare ge
        // useful for bidirectional data transfer
        let conversation = await conversationModel.findOne({ participants: { $all: [senderId, recieverId] } })

        if (!conversation) {
            conversation = await conversationModel.create({
                participants: [senderId, recieverId]
            })
        }


        let newMsg = await messageModel.create({
            senderId: senderId,
            recieverId: recieverId,
            message: message
        })


        if (newMsg) {
            conversation.messages.push(newMsg._id)
        }



        // conversation aur newMsg ko upper hum ne update kiya hai .push ke baad.
        // change execute kare ge to save bhi kerna parhe ga
        await Promise.all([conversation.save(), newMsg.save()])


        res.send({ status: "success", conversation, newMsg })








    } catch (error) {
        return res.send({ status: "error", msg: "something went wrong in /api/messageRoutes/send tryCatch", error: error })
    }


})






















router.get("/getMsg/:id", async (req, res) => {

    try {

        let encryptJwtToken = req.cookies.userToken

        if (!encryptJwtToken) {
            return res.json({ status: "failed", msg: "not loggin" })
        }

        let decodedToken = jwt.verify(encryptJwtToken, process.env.user_secret_key)

        if (!decodedToken) {
            return res.json({ status: "failed", msg: "something went wrong in jwt" })
        }






        let senderId = decodedToken.id;
        let recieverId = req.params.id;

        let conversation = await conversationModel.findOne({ participants: { $all: [ senderId, recieverId ] } }).populate("messages")

        if (!conversation) {
            return res.send({ status: "failed", msg: "something went wrong in finding conversation with reciever id" })
        }

        // let messagesArray = conversation.populate("messages")

        res.send(conversation.messages)









    } catch (error) {
        return res.send({status:"error", msg:"error from /api/messageRoutes/getMsg/:id", error})
    }

})































export default router;