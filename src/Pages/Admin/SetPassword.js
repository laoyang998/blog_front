import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Card, Input, Form, Button, Avatar, Modal, Upload, message } from 'antd'
import servicePath from '../../Config/apiUrl'
import Utils from '../../Common/Utils'
import '../../static/css/SetPassword.css'

const {confirm}=Modal

function SetPassword(props) {
    
    const [oldPassWord,setOldPassWord]=useState('')
    const [newPassWord1,setNewPassWord1]=useState('')
    const [newPassWord2,setNewPassWord2]=useState('')

    useEffect(()=>{
        Utils.checkLogin(props)
    },[])

    const onCommit=()=>{

        let token=localStorage.getItem('token')

        if(oldPassWord==='' || newPassWord1==''){
            message.error('密码不能为空')
            return false
        }else if(newPassWord1!==newPassWord2){
            message.error('新密码不一致')
            return false
        }
        axios({
            method:'post',
            url:servicePath.setUserPassword,
            timeout:5000,
            headers:{'token':token},
            data:{'oldPwd':oldPassWord,
                  'newPwd':newPassWord1}
        }).then(res=>{
            // console.log(res)
            if(res.data.result==='WrongPassword'){
                message.error('旧密码错误')
            }else if(res.data.result==='success'){
                message.info('修改成功')
                props.history.push('/index')
            }else{
                message.error('修改失败')
            }
        }).catch(()=>{
            message.error('网络发生异常')
        })
    }

    return(
        <div className="password-div" >
            <Card style={{width:'400px',height:'auto'}}
            title="修改密码"
            bordered={true}>
                <Input.Password placeholder="旧密码"
                onChange={(e)=>{setOldPassWord(e.target.value)}}/><br/><br/>
                <Input.Password placeholder="新密码"
                onChange={(e)=>{setNewPassWord1(e.target.value)}}/><br/><br/>
                <Input.Password placeholder="重复新密码"
                onChange={(e)=>{setNewPassWord2(e.target.value)}}/><br/><br/>
                <div style={{width:'100%',display:'flex',justifyContent:'center'}}>
                <Button type="primary" size="large" onClick={onCommit}>提交</Button>
                </div>
            </Card>
        </div>
    )
}

export default SetPassword