// @flow
import React from "react";
import { Button, Avatar, Typography } from "antd";
import styled from "styled-components";
import {auth, db}  from '../../../firebase/config'
import  {AuthContext} from '../../../Context/AuthProvider'

const WraperStyled = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid white;

  .userName {
    margin-left: 20px;
    color: white;
    font-size: 24px;
    font-weight: bold;
  }
  
`;

export default function UserInfo() {

  const  {user : {
    displayName,
    photoURL,
  }} = React.useContext(AuthContext);

   
  return (
    <div>
      <WraperStyled>
        <div>
          <Avatar size={64} src = {photoURL}>{photoURL ? '' : displayName ? displayName.charAt(0).toUpperCase(): ''}</Avatar>  
          <Typography.Text className = "userName">{displayName}</Typography.Text>
        </div>
        <Button className = "btnLogout"  ghost onClick={() => auth.signOut()} >Đăng xuất</Button>
      </WraperStyled>
    </div>
  );
}
