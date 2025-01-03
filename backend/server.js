

import express from 'express'
import dotEnv from 'dotenv'
dotEnv.config()
import app from "./App.js";


import http from 'http'
// import https from 'https'
// import fs from 'fs'

import { Server } from "socket.io";
import jwt from 'jsonwebtoken'


import UserModel from './models/userModel.js';
import userModel from './models/userModel.js';
import messageModel from './models/messageModel.js';
import conversationModel from './models/conversationModel.js';











// this is the self certificate of https to make the all request with https not with http
// const options = {
//     key: fs.readFileSync('path/to/localhost-key.pem'),
//     cert: fs.readFileSync('path/to/localhost-cert.pem'),
// };

const server = http.createServer(app)









try {






    // cors ko alag se cors dena parhe ga

    console.log(process.env.VITE_Frontend_Base_Url)

    const io = new Server(server, {
        cors: {
            origin: process.env.VITE_Frontend_Base_Url   ||  "http://localhost:5173"
        }
    })























    io.on("connection", (socket) => {
        console.log("socket.io is connected")


        let socketId = socket.id;
        let userId = null;







        socket.on("updateSocketId", async (data) => {
            // console.log(data.userToken)
            if (data.userToken) {
                let decodedToken = jwt.verify(data.userToken, process.env.user_secret_key)

                if (decodedToken) {
                    // console.log(decodedToken)
                    userId = decodedToken.id;   // to make it accessable for disconnection
                    let existingUser = await userModel.findOne({ _id: userId })

                    if (!existingUser) {
                        return socket.emit("updateSocketIdResponse", { status: "failed", msg: "user not found in the database" })
                    } else {
                        // await userModel.findOneAndUpdate({socketId:socketId}, {status:"online"})
                        await userModel.findOneAndUpdate({ _id: userId }, { socketId: socketId, status: "online" })
                        let allCurrentUserRelatedConversations = await conversationModel.find({ participants: { $in: [userId] } }).populate("participants")
                        if (!allCurrentUserRelatedConversations) {
                            return socket.emit("updateSocketIdResponse", { status: "success", msg: "socketid and status is updated but no conversation are found", currentUserData: existingUser, allCurrentUserRelatedConversations: [] })
                        } else {

                            return socket.emit("updateSocketIdResponse", { status: "success", msg: "socket id is updated successfuly", currentUserData: existingUser, allCurrentUserRelatedConversations })
                        }
                    }




                } else {
                    return socket.emit("updateSocketIdResponse", { status: "failed", msg: "jwt is not correct" })

                }



            } else {
                return socket.emit("updateSocketIdResponse", { status: "failed", msg: "login again becuase jwt is not correct" })

            }

        })












        // this socket event get the reciever id and msg to send.
        // first it check the reciever id and msg is correctly send means is it not empty and then search the reciever in the database
        // if present then get the sender id (userId) from upper side which is already extracted from jwtToken send in previous socket event from frontend and recieverId from the event.
        // then make message and conversation on the basis of senderid, recieverid and message with basic check that if conversation is present or not etc
        // then search and then populate and then send all messages in selected conversion to frontend in json format with status success

        socket.on("sendingMsg", async (data) => {
            // console.log(data)



            try {











                // console.log(socket.id)
                // taking jwt from cookies of frontend browser and extranting current user id form it.
                let userId;
                if (data.userToken) {
                    let decodedToken = jwt.verify(data.userToken, process.env.user_secret_key)

                    if (decodedToken) {
                        // console.log(decodedToken)
                        userId = decodedToken.id;   // to make it accessable for disconnection
                    } else {
                        return socket.emit("sendingMsgResponse", { status: "failed", msg: "There is somehting wrong in jwt. so please login agian" })
                    }


                } else {
                    return socket.emit("sendingMsgResponse", { status: 'failed', msg: "This user is not logged in " })
                }





















                // we check the reciever that is it present or not and if it is present then 
                // check it out that is the reciever online or offline by taking it socket id ( null=offline, someting=online)
                // if online then send then trigered the event on reciever side to take the message and if it is offline then does not and store the msg in database and also conversation in database
                // also create the message and conversation (if not present on the data recieved in this event (sendingMsg)    )
                // at last give back the all messege of current conversation to frontend by trigring the event in it.
                let reciever = await userModel.findOne({ _id: data.recieverUserId })
                if (!reciever) {
                    return socket.emit("sendingMsgResponse", { status: 'failed', msg: "This user is not found in database" })
                } else {

                    // let recieverSocketId= reciever.socketId
                    // io.to(recieverSocketId).emit("recieveMsg", {senderId:userId, msg:data.msg})


                    let newMessage = await messageModel.create({
                        senderId: userId,
                        recieverId: data.recieverUserId,
                        message: data.msg
                    })




                    // check that if conversation is present then only push the id of message which is created and if not then create the new conversation
                    let existingConversation = await conversationModel.findOne({ participants: { $all: [userId, data.recieverUserId] } })
                    // console.log(existingConversation)
                    if (!existingConversation) {

                        if (userId && data.recieverUserId) {
                            let newConversation = await conversationModel.create({
                                participants: [userId, data.recieverUserId],
                                messages: newMessage._id
                            })
                        } else {
                            return socket.emit("sendingMsgResponse", { status: "failed", msg: "the userid or reciever id is null so please try again " })
                        }


                    } else {
                        existingConversation.messages.push(newMessage._id)
                        await existingConversation.save()
                    }


















                    // to update conversations on the user screen
                    let recieverSocketId = reciever.socketId
                    let allConversation = await conversationModel.find({ participants: { $in: [data.recieverUserId] } }).populate("participants")
                    io.to(recieverSocketId).emit("updateConversation", { status: "success", msg: "all conversation is here", allConversation })
















                    // to search then populate and then send all messages in selected conversion 
                    if (userId && data.recieverUserId) {

                        let currentConversation = await conversationModel.findOne({ participants: { $all: [userId, data.recieverUserId] } })
                        if (!currentConversation) {
                            return socket.emit("sendingMsgResponse", { status: 'failed', msg: "This conversation is not found in database" })
                        } else {
                            let allConversationMessages = await currentConversation.populate("messages")




                            // socket.emit is for to send back the response means to trigered the event from which sendingMsg socket event is trigerred.
                            // io.to().emit() is for to trigereed the socket event is selected user which have socket id that we give to in .to()
                            let recieverSocketId = reciever.socketId
                            io.to(recieverSocketId).emit("recieveMsg", { status: "success", msg: "messege is send successfully", currentUserId: userId, allCurrentConversationMessages: allConversationMessages })
                            // console.log(io.sockets.sockets.has(recieverSocketId));





                            // socket.emit is for to send back the response means to trigered the event from which sendingMsg socket event is trigerred.
                            return socket.emit("sendingMsgResponse", { status: "success", msg: "messege is send successfully", currentUserId: userId, allCurrentConversationMessages: allConversationMessages })

                        }


                    } else {
                        return socket.emit("sendingMsgResponse", { status: "failed", msg: "the userid or reciever id is null so please try again " })
                    }




















                }




            } catch (error) {
                console.log("something went wrong in this socket event ", error)
                return socket.emit("sendingMsgResponse", { status: "error", msg: "someghing went wrong in this socket event" })
            }

        })










        socket.on("disconnect", async () => {
            console.log("socket is disconnected")
            await userModel.findOneAndUpdate({ _id: userId }, { status: "offline", socketId: "" })
        })







    })






} catch (err) {
    console.log("erron in socket.io", err)
}



















const PORT = process.env.PORT
server.listen(PORT || 4500 || 7000 || 3400, () => {
    console.log(`The Server is running on port ${PORT}`)
})












