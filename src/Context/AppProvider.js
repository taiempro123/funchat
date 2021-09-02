import React from "react";
import { useFireStore } from "../hooks/useFireStore";
import { AuthContext } from "./AuthProvider";



export const AppContext = React.createContext();

export default function AppProvider({children}) {
    const {user : {uid}} = React.useContext(AuthContext);
    const [isAddRoomVisible, setIsAddRoomVisible ] = React.useState(false);
    const [isInviteMemberVisible, setIsInviteMemberVisible] = React.useState(false);
    const [selectedRoomId, setSelectedRoomId] = React.useState(''); 


    const roomsCondition = React.useMemo(() => {
      return {
        fieldName : 'members',
        operator : 'array-contains',
        compareValue : uid
      }
    },[uid])
  
  
    const rooms = useFireStore('rooms',roomsCondition);


    const roomSelected = React.useMemo(
      () => rooms.find((room) => room.id === selectedRoomId) || {},
      [rooms, selectedRoomId]
    );

    const membersCondition = React.useMemo(() => {
      return {
        fieldName : 'uid',
        operator : 'in',
        compareValue : roomSelected.members
      }
    },[roomSelected.members])
  
  
    const members = useFireStore('users',membersCondition);

  return (
    <AppContext.Provider 
    value = {{
      rooms,
      isAddRoomVisible,
      roomSelected,
      members,
      isInviteMemberVisible, 
      setIsInviteMemberVisible,
      setIsAddRoomVisible,
      selectedRoomId,
      setSelectedRoomId,
    }} 
    
    
    >
      {children }
    </AppContext.Provider>
  )
 

  
}
