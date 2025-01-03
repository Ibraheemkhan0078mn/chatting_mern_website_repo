import React, { useRef, useState } from 'react'
import MyContext from './context'

const ContextProvider = ({children}) => {


  let socketInstanceContextRef= useRef(null)
  let [mainContainerMode, setMainContainerMode]= useState("usersDisplay")
  const [recieverIdForChat, setRecieverIdForChat] = useState(null)
  let [currentConversationMessagesArray, setCurrentConversationMessagesArray] = useState([])
  const [allConversations, setAllConversations] = useState([])
  let [currentUserId, setCurrentUserId]= useState(null)
  const [currentUserName, setCurrentUserName] = useState("username")
  const [currentReciepentUserName, setCurrentReciepentUserName] = useState("reciever name")
  let [allUserArray, setAllUserArray]= useState([])

  const [currentUserData, setCurrentUserData] = useState(null)
  const [currentRecieverData, setCurrentRecieverData] = useState(null)






  return (
    <MyContext.Provider value={{ socketInstanceContextRef,
                                  mainContainerMode, setMainContainerMode,
                                  recieverIdForChat, setRecieverIdForChat,
                                  currentConversationMessagesArray, setCurrentConversationMessagesArray,
                                  currentUserId, setCurrentUserId,
                                  currentUserName, setCurrentUserName,
                                  currentReciepentUserName, setCurrentReciepentUserName,
                                  allUserArray, setAllUserArray,
                                  allConversations, setAllConversations,
                                  currentUserData, setCurrentUserData,
                                  currentRecieverData, setCurrentRecieverData
    }}>
        {children}
    </MyContext.Provider>
  )
}

export default ContextProvider