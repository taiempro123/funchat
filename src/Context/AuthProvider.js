import React, {useState}from "react";
import  { auth }  from '../firebase/config';
import { useHistory } from "react-router";
import {Spin, Space} from 'antd'



export const AuthContext = React.createContext();

export default function AuthProvider({children}) {
  const [user, setUser] = useState({});
  const history = useHistory();
  const[isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {

   const unsubscribed = auth.onAuthStateChanged((user) => {
      console.log({ user });

      if (user) {
        const { displayName, email, uid, photoURL } = user;
        setUser({
          displayName,
          email,
          uid,
          photoURL,
        });
        setIsLoading(false);
        history.push('/');
        return
      }else{
        setUser({});
        setIsLoading(false);
        history.push('/login');
      }
     
    });
    //clean function
      return () => unsubscribed();


  },[history]);

  return (
    <AuthContext.Provider value = {{user}} >
      {isLoading ? <Space  size="middle"> <Spin  style={{ position: 'fixed', inset: 0 }} size="large"/> </Space> : children }
    </AuthContext.Provider>
  )
 

  
}
