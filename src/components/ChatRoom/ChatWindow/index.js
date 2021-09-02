// @flow
import {
  UserAddOutlined,
  SendOutlined,
  LikeOutlined,
} from "@ant-design/icons";
import React from "react";
import styled from "styled-components";
import { Button, Avatar, Tooltip, Input, Form ,Alert} from "antd";
import Message from "../Message";
import { AppContext } from "../../../Context/AppProvider";
import { AuthContext } from "../../../Context/AuthProvider";
import { addDocument } from "../../../firebase/service";
import { useFireStore } from "../../../hooks/useFireStore";

const HeaderStyled = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 64px;
  border: none;
  padding: 5px 20px;
  background-color: #53b8bb;
  color: #ffffff;

  .header {
    &__info {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    &__title {
      font-size: 24px;
      font-weight: bold;
      margin: 0;
    }

    &__description {
      font-size: 14px;
      font-weight: italic;
    }
  }
`;

const GroupButtonStyled = styled.div`
  display: flex;
  align-items: center;
`;

const WrapperStyled = styled.div`
  height: 100vh;
`;

const ContentStyled = styled.div`
  height: calc(100% - 64px);
  display: flex;
  flex-direction: column;
  padding: 16px;
  justify-content: flex-end;
`;

const FormStyled = styled(Form)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 5px 5px 50px;
  border: 1px solid rgb(230, 230, 230);
  border-radius: 10px;
  margin-bottom: 20px;

  .msg {
    flex-grow : 10;
    margin-bottom: 0px;
  }

  .upload {
    flex-grow : 1 ;
    margin-bottom: 0px;
  }
`;

const MessageListStyled = styled.div`
  max-height: 100%;
  overflow-y: auto;
  color: white;
`;

export default function ChatWindow() {
  const { roomSelected, members, setIsInviteMemberVisible } =
    React.useContext(AppContext);

  const {
    user: { uid, photoURL, displayName },
  } = React.useContext(AuthContext);

  const [inputValue, setInputValue] = React.useState("");

  const [form] = Form.useForm();

  const handleInviteMembers = () => {
    setIsInviteMemberVisible(true);
  };

  const handleInputChange = (evt) => {
    setInputValue(evt.target.value);
  };

  const handleOnSubmit = () => {
    addDocument("messages", {
      content: inputValue,
      uid,
      photoURL,
      roomId: roomSelected.id,
      displayName,
      img: "",
    });

    form.resetFields(["message"]);
  };

  const messageCondition = React.useMemo(
    () => ({
      fieldName: "roomId",
      operator: "==",
      compareValue: roomSelected.id,
    }),
    [roomSelected.id]
  );
  console.log({roomSelected})

  const messages = useFireStore("messages", messageCondition);

  const uploadImg = async (evt) => {
    const files = evt.target.files;
    const data = new FormData();
    data.append("file", files[0]);
    data.append("upload_preset", "chatapp");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dslvx6bgc/image/upload",
      {
        method: "POST",
        body: data,
      }
    );
    const file = await res.json();

    addDocument("messages", {
      content: "",
      uid,
      photoURL,
      roomId: roomSelected.id,
      displayName,
      img: file.secure_url,
    });
    form.resetFields(["upload"]);
  };


  return (
    <div>
      {Object.keys(roomSelected).length === 0 ? (
        <Alert message="Chào mừng đến với Fun Chat" type="info" closeText="Close Now" />
      ) : (
        <>
          <WrapperStyled>
            <HeaderStyled>
              <div className="header__info">
                <p className="header__title">{roomSelected.name}</p>
                <span className="header__description">
                  {roomSelected.description}
                </span>
              </div>

              <div>
                <GroupButtonStyled>
                  <Button
                    icon={<UserAddOutlined />}
                    type="text"
                    onClick={handleInviteMembers}
                  >
                    Mời
                  </Button>
                  <Avatar.Group
                    size="small"
                    maxCount={3}
                    maxStyle={{
                      color: "#f56a00",
                      backgroundColor: "#fde3cf",
                    }}
                  >
                    {members.map((member) => (
                      <Tooltip
                        title={member.displayName}
                        placement="top"
                        key={member.id}
                      >
                        <Avatar src={member.photoURL}>
                          {member.photoURL
                            ? ""
                            : member.displayName?.charAt(0).toUpperCase()}
                        </Avatar>
                      </Tooltip>
                    ))}
                  </Avatar.Group>
                </GroupButtonStyled>
              </div>
            </HeaderStyled>

            <ContentStyled>
              <MessageListStyled>
                {messages.map((mes) => (
                  <Message
                    key={mes.id}
                    img={mes.img}
                    text={mes.content}
                    photoURL={mes.photoURL}
                    displayName={mes.displayName}
                    createdAt={mes.createdAt}
                  />
                ))}
              </MessageListStyled>
              <FormStyled form={form}>
                <Form.Item name="message" className="msg">
                  <Input
                    onChange={handleInputChange}
                    onPressEnter={handleOnSubmit}
                    bordered={false}
                    allowClear = {true}
                    autoComplete="off"
                    placeholder="Nhập tin nhắn ở đây..."
                  />
                </Form.Item>

                <Form.Item className="upload" name="upload">
                <Input
                    size="small"
                    type="file"
                    name="file"
                    bordered = {false}
                    placeholder="ONLY IMAGE"
                    onChange={uploadImg}
                  ></Input>
                </Form.Item>
               
                <Button
                  icon={<SendOutlined />}
                  type="primary"
                  onClick={handleOnSubmit}
                >
                  Gửi
                </Button>
                {/* <Button icon={<LikeOutlined />} type="primary"></Button> */}
              </FormStyled>
            </ContentStyled>
          </WrapperStyled>
        </>
      )}
    </div>
  );
}
