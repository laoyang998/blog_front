import React, { useState } from "react"
import { Card, Input, Button, Spin,message } from "antd"
import "antd/dist/antd.css"
import "../static/css/Login.css"
import {LockOutlined,UserOutlined} from '@ant-design/icons'
import servicePath from '../Config/apiUrl'
import axios from 'axios'

function Login(props) {

    const [userName, setUserName] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const checkLogin=()=>{
        setIsLoading(true)
        if(!userName){
            message.error("用户名不能为空")
            setIsLoading(false)
            return false

        }else if(!password){
            message.error("密码不能为空")
            setIsLoading(false)
            return false
        }

        let dataProps={
            userId:userName,
            password:password
        }

        axios({
            method:'post',
            url:servicePath.Login,
            data:dataProps,
            timeout:5000
            // withCredentials:true
        }).then(
            res=>{
                setIsLoading(false)
                // console.log(res)
                if(res.data!==''&&res.data.status==='OK'){
                    localStorage.setItem("token",res.data.data.token)
                    props.history.push('/index')
                }else{
                    message.error("账户名或密码错误")
                }
              
            }
        ).catch(()=>{
            setIsLoading(false)
            message.error("登录超时")
        }
        )
    }

    return (
        <div className="body-div">
        <div className="login-div">
            <Spin tip="Loading..." spinning={isLoading}>
                <Card   
                title="知识分享" 
                bordered={true} 
                style={{width:400,opacity: 0.85}}>
                    <Input
                    id="userName"
                    size="large"
                    placeholder="输入用户名"
                    prefix={<UserOutlined  style={{color:"rgba(0,0,0,.25)"}}/>}
                    onChange={(e)=>{setUserName(e.target.value)}}
                    />
                    <br/><br/>
                    <Input.Password
                    id="password"
                    size="large"
                    placeholder="输入密码"
                    prefix={<LockOutlined  style={{color:"rgba(0,0,0,.25)"}}/>}
                    onChange={(e)=>{setPassword(e.target.value)}}
                    />
                    <br/><br/>
                    <Button type="primary" size="large" block onClick={checkLogin}>登录</Button>
                </Card>               
            </Spin>
        </div>
        </div>
    )
}

export default Login