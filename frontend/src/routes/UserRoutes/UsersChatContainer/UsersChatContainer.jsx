import React, { useContext, useEffect, useState } from 'react'
import './UsersChatContainer.css'
import MyContext from '../../../context/context'
import axios from 'axios'
import Cookie from 'js-cookie'
import { useNavigate } from 'react-router-dom'
import 'remixicon/fonts/remixicon.css';
import userBlankImg from '../../../assets/userImg.jpeg'








const UsersChatContainer = () => {



  let [msgToSend, setMsgToSend] = useState("")
  let navigate = useNavigate()


  let { socketInstanceContextRef,
    currentConversationMessagesArray,
    setCurrentConversationMessagesArray,
    currentUserId,
    setCurrentUserId,
    recieverIdForChat,
    currentReciepentUserName,
    currentRecieverData
  } = useContext(MyContext)














  // when userHome starts and which thing are required for other function is feched directly from here
  useEffect(() => {

    async function getAllMsg() {
      let response = await axios.post(`${import.meta.env.VITE_Bakend_Base_Url}/api/userRoutes/getAllCurrentConversationMsg`, { recieverId: recieverIdForChat }, { withCredentials: true })
      if (response.data.status == "failed") {
        alert(response.data.msg)
      } else if (response.data.status == "error") {
        console.log(response.data)
      }else if(response.data.status=="empty"){
        setCurrentConversationMessagesArray([])
      }
      else {
        // console.log(response.data)
        // console.log(response.data.allCurrentConversationMessagesArray.messages)
        let currentUserId = response.data.currentUserId;
        setCurrentUserId(response.data.currentUserId)
        setCurrentConversationMessagesArray(response.data.allCurrentConversationMessagesArray.messages)
        // setCurrentUserId(response.data.currentUserId)
      }
    }

    getAllMsg()

  }, [])






















  // to send recieverid and message to backend in order to send message to another user
  async function handleSendingMsgFunc() {

    try {


      console.log("The send buton to send the message is clicked")

      let recieverId = recieverIdForChat;
      let msg;
      if (!msgToSend == "") {
        msg = msgToSend;

        let userToken = Cookie.get('userToken')
        if (userToken) {
          if (socketInstanceContextRef.current) {
            // console.log("entered in condition")
            socketInstanceContextRef.current.emit("sendingMsg", { recieverUserId: recieverId, msg: msg, userToken: userToken })
          } else {
            // i make the socket connection with userHome.jsx, so if socket is not connected well then i redirect it to userHome form where it first connect the socket
            // then in userHome.jsx, i write the code on the basis of mainContainerMode usestate value
            navigate("/userHome")
          }
        } else {
          alert("login because token is not present")
        }


      } else {
        alert("please enter some message in input first then send")
      }



    } catch (error) {
      console.log("from handlesendingMsgFun of UsersChatContainer.jsx in frontend", error)
    }


  }












  // to recive response from sending socket event

  useEffect(() => {

    try {

      if (socketInstanceContextRef.current) {


        socketInstanceContextRef.current.on("sendingMsgResponse", (data) => {
          // console.log(data)
          if (data.status == "failed") {
            console.log(data)
          } else if (data.status == "error") {
            console.log(data)
          } else {
            // console.log(data.allCurrentConversationMessages.messages)
            setCurrentConversationMessagesArray(data.allCurrentConversationMessages.messages)

          }

        })


      } else {
        console.log("socketInstanceContextRef is not found")

        // i make the socket connection with userHome.jsx, so if socket is not connected well then i redirect it to userHome form where it first connect the socket
        // then in userHome.jsx, i write the code on the basis of mainContainerMode usestate value
        navigate("/userHome")
      }




    } catch (error) {
      console.log(error)
    }

  }, [socketInstanceContextRef.current])



















  // this have socket event which is trigered when someone send send messege and you are also online on app
  useEffect(() => {

    try {
      if (socketInstanceContextRef.current) {
        socketInstanceContextRef.current.on("recieveMsg", (data) => {
          let { status, msg, currentUserId, allCurrentConversationMessages } = data;
          setCurrentConversationMessagesArray(data.allCurrentConversationMessages.messages)
          // console.log(data.allCurrentConversationMessages.messages)

        })


        socketInstanceContextRef.current.on("updateConversation", (data) => {
          console.log(data, "from updateConversation socket event")
        })


      } else {
        console.log("i think, socketInstaceContextRef is not found")

        // i make the socket connection with userHome.jsx, so if socket is not connected well then i redirect it to userHome form where it first connect the socket
        // then in userHome.jsx, i write the code on the basis of mainContainerMode usestate value
        navigate("/userHome")
      }


    } catch (error) {
      console.log(error)
    }

  }, [socketInstanceContextRef.current])



































  return (
    <div>





    {/* this is just for background image setup */}
    <div className="bgcDiv"></div>






      <div className="usersChatConNavbar">
        <i className="ri-arrow-left-line" onClick={() => { navigate("/userHome") }}></i>
        <img src={currentRecieverData ? (!currentRecieverData.imageUrl? userBlankImg:currentRecieverData.imageUrl) : userBlankImg} alt="" />
        <h2>{currentReciepentUserName}</h2>
        <div className='chatPageTitle'>Chat Box</div>
      </div>







      <div className="chatingContainer">
        {currentConversationMessagesArray.length > 0 ?



          currentConversationMessagesArray.map((eachMessage, index) => {
            return <div className="eachMessageDiv"
              style={currentUserId == eachMessage.senderId ? { justifyContent: 'flex-end' } : { justifyContent: 'flex-start' }}
              key={index} >
              <div className="eachMessageContainer">
                <h2>{eachMessage.message}</h2>
              </div>
            </div>
          })





          : <div className='emptyChatDiv'>No messeges present yet!</div>
        }
      </div>







      <div className="sendingMsgContainer">
        <textarea className='sendingTextArea' onChange={(e) => { setMsgToSend(e.target.value) }} value={msgToSend} placeholder='write the message here...'></textarea>
        <button className="sendingBtn" onClick={handleSendingMsgFunc} >Send</button>
      </div>









    </div>
  )
}









export default UsersChatContainer