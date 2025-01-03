import React, { useContext } from 'react'
import './UserHomeNavbar.css'
import MyContext from '../../../context/context'
import userBlankImg from '../../../assets/userImg.jpeg'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'


const UserNavbar = ({pageTitle}) => {

    let {currentUserData}= useContext(MyContext)
    let navigate= useNavigate()



    async function handleLogoutIconClick(e){
        e.preventDefault()
        let response= await axios.get(`${import.meta.env.VITE_Bakend_Base_Url}/api/userRoutes/logout`, {withCredentials:true});

        if(response.data){

            if(response.data.status=="failed"){
                alert(response.data.msg)
            }else if(response.data.status=="success"){
                alert(response.data.msg)
                navigate("/userLogin")
            }else if(response.data.status=="error"){
                alert(response.data.msg)
            }

        }else{
            alert("Something went wrong in logout")
        }

    }




    return (
        <div className='UserHomeNavbar'>




            <div className="userMainData">
                <img src={currentUserData ?    (!currentUserData.imageUrl?userBlankImg:currentUserData.imageUrl)       : userBlankImg}     alt="" />
                <h2>{currentUserData ? currentUserData.username : "username"}</h2>
            </div>


            <div className="currentPageTitle">
                <h2>{pageTitle}</h2>
            </div>


            <div className="userHomeNavIcon">
                <i className="ri-logout-box-line" onClick={handleLogoutIconClick}></i>
                <i className="ri-menu-line"></i>
            </div>



        </div>
    )
}

export default UserNavbar