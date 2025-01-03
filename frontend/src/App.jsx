import React, { useContext, useEffect } from 'react'
import {Routes, Route} from 'react-router-dom'
import UserHome from './routes/UserRoutes/UserHome/UserHome'
import Home from './routes/HomeRoute/Home'
import UserRegistration from './routes/UserRoutes/Registration/Registration'
import UserLogin from './routes/UserRoutes/Login/Login'
import UserDisplayContainer from './routes/UserRoutes/UserDisplayContainer/UserDisplayContainer.jsx'
import UsersChatContainer from './routes/UserRoutes/UsersChatContainer/UsersChatContainer.jsx'

const App = () => {
    
  
  return (
    <Routes>
      <Route path='/' element={<Home/>}   />


      <Route path='/userRegistration' element={<UserRegistration/>}  />
      <Route path='/userLogin' element={<UserLogin/>}  />
      <Route path='/userHome' element={<UserHome/>}  />
      <Route path='/userDisplayContainer' element={<UserDisplayContainer/>}   />
      <Route path='/userChatContainer' element={<UsersChatContainer/>}  />



    </Routes>
  )
}

export default App