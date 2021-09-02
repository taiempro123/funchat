import React, { useContext, useState, useMemo } from "react";
import { Modal, Form , Select, Spin, Avatar} from "antd";
import { AppContext } from "../../Context/AppProvider";
import {debounce} from 'lodash';
import {db} from '../../firebase/config'


function DeboundSelect ({fetchOptions, timeout = 300, ...props}){

    const [fetching, setFetching] = useState(false);
    const [options, setOptions] = useState([]);

   const debounceFetcher = useMemo(() => {
    const loadOptions = (value) => {
        setOptions([]);
        setFetching(true);


        fetchOptions(value, props.curMembers).then((newOptions) => {
            setOptions(newOptions);
            setFetching(false);
        })

    }

    return debounce(loadOptions, timeout);
   },[timeout, fetchOptions, props.curMembers]);


   return (

    <Select
      labelInValue
      filterOption={false}
      onSearch={debounceFetcher}
      notFoundContent={fetching ? <Spin size='small' /> : null}
      {...props}
    
    >
        {options.map((opt) => (
        <Select.Option key={opt.value} value={opt.value} title={opt.label}>
          <Avatar size='small' src={opt.photoURL}>
            {opt.photoURL ? '' : opt.label?.charAt(0)?.toUpperCase()}
          </Avatar>
          {` ${opt.label}`}
        </Select.Option>
      ))}
    </Select>
      

   )

}


 async function fetchUserList(search, curMembers){
   return db
    .collection('users')
    .where('keywords', 'array-contains', search)
    .orderBy('displayName')
    .limit(20)
    .get()
    .then((snapshot) => {
      return snapshot.docs
        .map((doc) => ({
          label: doc.data().displayName,
          value: doc.data().uid,
          photoURL: doc.data().photoURL,
        })).filter(opt => !curMembers.includes(opt.value));
        
    });
 }

export default function AddRoomModal() {

    const {isInviteMemberVisible, setIsInviteMemberVisible,selectedRoomId, roomSelected} = useContext(AppContext);
    const [value, setValue] = useState(null);
    const [form] = Form.useForm();

  const handleOk = () => {

    const roomRef = db.collection('rooms').doc(selectedRoomId);

    roomRef.update({ 
        members: [...roomSelected.members, ...value.map(val => val.value)]
    })


    form.resetFields();
    setIsInviteMemberVisible(false);

  }


  const handleCancel = () => {
    form.resetFields();
    setIsInviteMemberVisible(false);
   
  }


  return (
    <div>
      <Modal
      title = "Thêm thành viên"
      visible = {isInviteMemberVisible}
      onOk = {handleOk}
      onCancel = {handleCancel}
      
      >
        <Form form = {form} layout = "vertical">
         <DeboundSelect
         mode='multiple'
         name='search-user'
         label='Tên các thành viên'
         value={value}
         placeholder='Nhập tên thành viên'
         fetchOptions={fetchUserList}
         onChange={(newValue) => setValue(newValue)}
         style={{ width: '100%' }}
         curMembers = {roomSelected.members}
         >
             
         </DeboundSelect>
        </Form>
      </Modal>
    </div>
  );
}
