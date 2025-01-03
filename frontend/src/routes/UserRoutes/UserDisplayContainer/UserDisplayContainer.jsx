import React, { useContext, useEffect, useState } from 'react'
import './UserDisplayContainer.css'
import axios from 'axios'
import MyContext from '../../../context/context'
import Cookie from 'js-cookie'
import { useNavigate } from 'react-router-dom'
import 'remixicon/fonts/remixicon.css';
import UserNavbar from '../../../components/userRouteComponents/UserHomeNav/UserHomeNavbar'
import userBlankImg from '../../../assets/userImg.jpeg'





const UserDisplayContainer = () => {


    let {
        setMainContainerMode,
        setRecieverIdForChat,
        currentUserId,
        setCurrentUserId,
        setCurrentReciepentUserName,
        setAllUserArray,
        allUserArray,
        setCurrentRecieverData } = useContext(MyContext)



    let navigate = useNavigate()























    // get all users from database to display on the container 
    // also get the id of current user
    useEffect(() => {
        async function getAllusers() {
            let response = await axios.get(`${import.meta.env.VITE_Bakend_Base_Url}/api/userRoutes/getActiveUser`, { withCredentials: true })
            if (response.data.status == "success") {
                console.log(response.data)
                setAllUserArray(response.data.AllUsersArray)
                setCurrentUserId(response.data.currentUserId)

            } else {
                console.log(response.data)
                console.log("user is not fetched form beckend")
            }
        }
        getAllusers()
    }, [])



















    // function to handle click on each user whcih is displayed in main container
    // here, we also set and store the reciever id which we want to chat in usestate and then we use it in UserHome.jsx
    async function handleEachUserDivClick(e) {
        let stringifyData = e.currentTarget.getAttribute("data-value")
        let parseData = JSON.parse(stringifyData)

        setCurrentRecieverData(parseData)
        setRecieverIdForChat(parseData._id)
        setCurrentReciepentUserName(parseData.username)
        setMainContainerMode("chatMode")


        navigate("/userChatContainer")

    }














    return (
        <div className='UserDisplay'>







            {/* this is div is just for the background image */}
            <div className="bgcDiv"></div>




            <div className="userDisplayNavbarContainer">
                <UserNavbar pageTitle={"All Users"} />
            </div>





            {/* checking that is the array of user is not empty means if there is no users present yet then display empty else display the users */}
            {/* this is for to avoid the error due to empty array of user which is feched from the database */}



            <div className="userDisplayContainer">

                {allUserArray.length > 0

                    ?

                    allUserArray.map((eachUser, index) => {



                        return <div key={index} className='eachUserDiv'
                            style={eachUser._id == currentUserId ? { visibility: "hidden" } : { visibility: 'visible' }}
                            data-value={JSON.stringify(eachUser)}
                            onClick={handleEachUserDivClick} >


                            <div className="eachUserImageDiv">
                                <img src={ eachUser.imageUrl   ||    userBlankImg } alt="" />
                            </div>

                            <div className="eachUserName">
                                {eachUser.username}
                            </div>

                        </div>
                    })

                    :

                    <div></div>
                }




            </div>





        </div>
    )







}









export default UserDisplayContainer;