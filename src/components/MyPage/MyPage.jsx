import React,{ useState} from 'react'
import {
    Form,
    Input,
    Select,
    Checkbox, Avatar, Upload, message,
    Button, Tooltip,
} from 'antd';
import {AntDesignOutlined, InfoCircleOutlined, UserOutlined} from '@ant-design/icons';
import axios from "axios";
import {Option} from "antd/es/mentions";

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
  },
};

const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
};

const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';

    if (!isJpgOrPng) {
        message.error('You can only upload JPG/PNG file!');
    }

    const isLt2M = file.size / 1024 / 1024 < 2;

    if (!isLt2M) {
        message.error('Image must smaller than 2MB!');
    }

    return isJpgOrPng && isLt2M;
};


export default function MyPage(){
  const [form] = Form.useForm();
  const [isChangePwd,setIsChangePwd]=useState(false)
    const [isChangeInfo,setIsChangeInfo]=useState(false)
    const [userInfo,setUserInfo]=useState({})
    const onFinish = (values) => {
    console.log('Received values of form: ', values);
  };

    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState();

    const handleChange = (info) => {
        if (info.file.status === 'uploading') {
            setLoading(true);
            return;
        }

        if (info.file.status === 'done') {
            // Get this url from response in real world.
            getBase64(info.file.originFileObj, (url) => {
                setLoading(false);
                setImageUrl(url);
            });
        }
    };
    const changePwdButton=()=>{

    }


    return(

       <div>
           <div style={{overflow:"hidden"}}>
               <div style={{width:'200px',margin:"0 auto"}}>
                   <Avatar size={64} icon={<AntDesignOutlined />} />

               </div>
               <div style={{width:'220px',margin:"20px auto"}} >
                   <Upload
                       name="avatar"
                       //listType="picture-card"
                       className="avatar-uploader"
                       showUploadList={false}
                       action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                       beforeUpload={beforeUpload}
                       onChange={handleChange}
                   >
                       {imageUrl ? (
                           <img
                               src={imageUrl}
                               alt="avatar"
                               style={{
                                   width: '100%',
                               }}
                           />
                       ) : (
                           <Button type="primary" >修改头像</Button>

                       )}
                   </Upload>

               </div>

           </div>

           {
               !isChangePwd?(

                       <Button type="primary" style={{marginLeft:"100px"}} onClick={()=>{setIsChangePwd(true)}}>修改密码</Button>

                   ):
                   (
                       <div>
                           <Form
                               {...formItemLayout}
                               form={form}
                               name="register"
                               className='changePwd'
                               onFinish={onFinish}
                               initialValues={{
                                   residence: ['zhejiang', 'hangzhou', 'xihu'],
                                   prefix: '86',
                               }}

                               scrollToFirstError
                           >


                               <Form.Item
                                   name="password"
                                   label="Password"
                                   rules={[
                                       {
                                           required: true,
                                           message: 'Please input your password!',
                                       },
                                   ]}
                                   hasFeedback

                               >
                                   <Input.Password className='MyPageInput'/>
                               </Form.Item>

                               <Form.Item
                                   name="confirm"
                                   label="Confirm Password"
                                   dependencies={['password']}
                                   hasFeedback
                                   rules={[
                                       {
                                           required: true,
                                           message: 'Please confirm your password!',
                                       },
                                       ({ getFieldValue }) => ({
                                           validator(_, value) {
                                               if (!value || getFieldValue('password') === value) {
                                                   return Promise.resolve();
                                               }

                                               return Promise.reject(new Error('The two passwords that you entered do not match!'));
                                           },
                                       }),
                                   ]}
                               >
                                   <Input.Password className='MyPageInput'/>
                               </Form.Item>


                               <Button type="primary" className='changePwdButton' onClick={changePwdButton}>修改密码</Button>
                               <Button type="primary" style={{marginLeft:"30px"}} onClick={()=>{setIsChangePwd(false)}}>取消</Button>


                           </Form>
                       </div>
                   )
           }
           <div style={{marginTop:"40px"}}>
               {isChangeInfo ? (
                   <div style={{marginLeft:"150px",position:"absolute",bottom:"120px",width:"800px"}}>
                       用户名：
                       <Input
                           placeholder={userInfo.username}
                           onChange={(a)=>{let d={...userInfo};d.username=a.target.value;setUserInfo(d);}}
                           style={{'maxWidth':'40%'}}
                           prefix={<UserOutlined className="site-form-item-icon" />}
                           suffix={
                               <Tooltip title="修改用户名">
                                   <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                               </Tooltip>
                           }
                       />
                       <p></p>性别：
                       <Select defaultValue={userInfo.sex} value={userInfo.sex}  className="select-before" style={{width:'70px'}} onChange={(a,b)=>{
                           //userInfo.sex=b.value;console.log(userInfo);
                           let d={...userInfo};
                           d.sex=b.value;
                           setUserInfo(d);
                       }}>
                           <Option value="男">男</Option>
                           <Option value="女">女</Option>
                       </Select>
                       <p></p>等级：
                       <Select defaultValue={userInfo.level} value={userInfo.level} className="select-before" style={{width:'150px'}} onChange={(a,b)=>{let d={...userInfo};d.level=b.value;setUserInfo(d);}}>
                           <Option value="1">1</Option>
                           <Option value="2">2（机构管理员）</Option>
                       </Select> <p></p>
                       <Button type="primary" style={{marginTop:'10px'}} onClick={()=>{

                           axios({
                               method: 'post',
                               url: 'http://114.55.119.223/prod-api/api/master/changeUserInfo',
                               headers: {
                                   "Authorization": "Bearer " + localStorage.getItem('token')
                               },
                               data:JSON.stringify(userInfo)

                           }).then(res=>{console.log(res)})
                       }}>修改</Button>
                       <Button type="primary" style={{marginLeft:"30px"}} onClick={()=>{setIsChangeInfo(false)}}>取消</Button>


                   </div>
               ):(
                   <Button type="primary" style={{position:"absolute", marginLeft:"100px",top:"500px"}} onClick={()=>{setIsChangeInfo(true)}}>修改信息</Button>

                   )}
           </div>

       </div>

    )
}