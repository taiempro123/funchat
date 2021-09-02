// @flow
import  React from 'react';
import {  Typography, Button } from 'antd';
import { Collapse } from 'antd';
import styled from 'styled-components'
import { PlusSquareOutlined } from '@ant-design/icons';
import { AppContext } from '../../../Context/AppProvider';


const {Panel} = Collapse;

const PanelStyled = styled(Panel)`
  &&& {
    .ant-collapse-header,
    p {
      color: white;
      font-size: 18px;
      font-weight: bold;
    }
    .ant-collapse-content-box {
      padding: 0 40px;
    }
    .add-room {
      color: white;
      padding: 0;
      font-size: 14px;
      font-weight: italic;
    }
  }
`;

const LinkStyled = styled(Typography.Link)`
  display: block;
  margin-bottom: 5px;
  color: black;
`;

export default function RoomList() {


 const {rooms, setIsAddRoomVisible, setSelectedRoomId} = React.useContext(AppContext);

  const handleClickAddRoom = () => {
      setIsAddRoomVisible(true);
  }

  return (
    <div>
    <Collapse ghost defaultActiveKey = {['1']}>
        <PanelStyled  ghost header = "Danh sách các phòng" key="1" >
        {
         rooms.map((room) => ( 
         <LinkStyled 
          key = {room.id}
          onClick = {() => setSelectedRoomId(room.id)}
          >
            {room.name}
          </LinkStyled>))
        }
        <Button 
        type = "text" 
        icon = {<PlusSquareOutlined/>}
        className = "add-room" 
        onClick = {handleClickAddRoom}
        >Thêm phòng
        </Button>

        </PanelStyled >
    
    
    </Collapse>
    </div>
  );
};