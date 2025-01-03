import React, { useContext, useEffect, useRef, useState } from 'react'
import './UserHome.css'
import userBlankImg from '../../../assets/userImg.jpeg'
import io from 'socket.io-client'
import MyContext from '../../../context/context'
import Cookie from 'js-cookie'
import { useNavigate } from 'react-router-dom'
import 'remixicon/fonts/remixicon.css';
import UserNavbar from '../../../components/userRouteComponents/UserHomeNav/UserHomeNavbar'














const UserHome = () => {


  let { socketInstanceContextRef,
    mainContainerMode,
    setCurrentUserName,
    setAllConversations,
    allConversations,
    currentUserName,
    currentUserId,
    setCurrentUserId,
    setCurrentReciepentUserName,
    setMainContainerMode,
    setRecieverIdForChat,
    setCurrentUserData,
    currentUserData,
    setCurrentRecieverData
  } = useContext(MyContext)



  let navigate = useNavigate()











  // in this useeffect, i make the fucntion for async task and in this function, i connect socket with backend, store it in useRef for immediate task
  // we store the thing which are want to re-render again and again in usestate and the value which i dont such rerendering and want faster then we store it in useref.
  useEffect(() => {
    console.log("io connection useeffect is running")
    const socket = io(import.meta.env.VITE_Bakend_Base_Url)
    socketInstanceContextRef.current = socket;
    // is function ko async nahi banana, kio ke is se ye sab se akhir me print hoga pir
    updateUserSocketIdFunc()

  }, [])











  // to triger the event to update the socket id in user model and send it jwt token from the cookie
  function updateUserSocketIdFunc() {
    let userToken = Cookie.get('userToken')
    if (userToken) {
      if (socketInstanceContextRef.current) {
        socketInstanceContextRef.current.emit("updateSocketId", { userToken: userToken })
      }
    } else {
      alert("login because token is not present")
    }
  }














  useEffect(() => {
    // console.log("entered in updateConversation useeffect")

    if (socketInstanceContextRef.current) {

      socketInstanceContextRef.current.on("updateConversation", (data) => {
        console.log("update conversation is running")
        let { status, msg, allConversation } = data;
        console.log(data)
        if (allConversation) {
          console.log("entered in updateConversation event")
          setAllConversations(allConversation)
        }
      })

    }

  }, [socketInstanceContextRef.current])













  // for manual connection with connect button present at top of screen without refresh
  async function handleSocketconnection(e) {
    const newSocket = io(import.meta.env.VITE_Bakend_Base_Url)   // coming from react env file
    socketInstanceContextRef.current = newSocket;

    let userToken = Cookie.get('userToken')
    if (userToken) {
      if (socketInstanceContextRef.current) {
        socketInstanceContextRef.current.emit("updateSocketId", { userToken: userToken })
      }
    } else {
      alert("login because token is not present")
    }

  }













  // for mannualy disconnect with disconnect button at the top 
  function handleSocketDisconnection(e) {
    socketInstanceContextRef.current.disconnect()
    socketInstanceContextRef.current = null;
  }














  // This is the reponse socket event of updateSocketId which is trigerred from the backend with the help of socket.io in backend.
  useEffect(() => {
    if (socketInstanceContextRef.current) {
      socketInstanceContextRef.current.on("updateSocketIdResponse", (data) => {
        let { status, msg, currentUserData, allCurrentUserRelatedConversations } = data;
        if (status == "success") {
          console.log(data)
          setCurrentUserData(currentUserData)
          setCurrentUserName(currentUserData.username)
          setCurrentUserId(currentUserData._id)
          setAllConversations(allCurrentUserRelatedConversations)
        } else {
          console.log("something went wrong in fetching username form database")
        }
      })

    } else {
      console.log("socketInstanceContextRef is not present to navigate to userhome to take first this")

    }
  }, [socketInstanceContextRef.current])




















  // function to handle click on each user whcih is displayed in main container
  // here, we also set and store the reciever id which we want to chat in usestate and then we use it in UserHome.jsx
  function handleEachConversationDivClick(e) {
    let stringifyData = e.currentTarget.getAttribute("data-value")
    let parseData = JSON.parse(stringifyData)

    setCurrentRecieverData(parseData)
    // console.log(parseData)
    setRecieverIdForChat(parseData._id)
    setCurrentReciepentUserName(parseData.username)
    setMainContainerMode("chatMode")
    navigate("/userChatContainer")

  }










  function handleAddUserBtnClick(e) {
    navigate("/userDisplayContainer")
  }





























  //  MAIN RETURNED CODE OF THIS COMPONENT
  return (
    <div className="UserHome">


      {/* this is div is just for the background image */}
      <div className="bgcDiv"></div>


      {/* This is the container which contain all the stuff of userHome route */}
      <div className='ConversationDisplayContainer'>








        {/* Navbar of userHome */}
        <div className="userHomeNavContainer">
          <UserNavbar  pageTitle={"Conversations"} />
        </div>




        {/* 
        <div className="connectDisConnectBtnDiv">
          <button className='connectBtn' onClick={handleSocketconnection}>connect</button>
          <button className='disconnectBtn' onClick={handleSocketDisconnection}>Disconnect</button>
        </div>


 */}


        <div className="addUserBtnDiv" onClick={handleAddUserBtnClick}>
        <i className="ri-user-add-fill"></i>
        </div>






        <div className="eachConversationDivContainer">



          {/* checking that is the array of user is not empty means if there is no users present yet then display empty else display the users */}
          {/* this is for to avoid the error due to empty array of user which is feched from the database */}

          {allConversations.length > 0

            ?

            // apply map loop to render all the conversations. also i apply some condition inside this and also apply another map loop for this conditions

            allConversations.map((eachConversation, index) => {



              // filter the phone no of sender means current user with map loop and then use it as name
              let sender;
              let reciever;
              let onlyRecieverUserPhoneNo;

              if (eachConversation.participants) {


                onlyRecieverUserPhoneNo = eachConversation.participants.map((eachParticipant, index) => {
                  if (eachParticipant._id != currentUserId) {
                    reciever = eachParticipant;
                    return eachParticipant.phoneNo
                  } else {
                    sender = eachParticipant;
                  }
                })




              }



              // for rendering all the conversations with the help of map loop

              return <div key={index} className='eachConversationDiv'
                data-value={JSON.stringify(reciever)}
                onClick={handleEachConversationDivClick} >


                <div className="eachConversationImageDiv">
                  <img src={reciever ? (!reciever.imageUrl ? userBlankImg : reciever.imageUrl) : userBlankImg} alt="" />
                </div>

                <div className="eachConversationName">
                  {reciever.username}
                </div>

              </div>
            })

            :

            <div></div>
          }




        </div>







      </div>




    </div>
  )






}









export default UserHome