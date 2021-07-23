import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Card, Input, Form, Button, Avatar, Modal, Upload, message } from 'antd'
import servicePath from '../../Config/apiUrl'
import '../../static/css/UpdateUserInfo.css'

const { confirm } = Modal

function UpdateUserInfo(props) {

    const [uId, setUId] = useState('')
    const [userId, setUserId] = useState('')
    const [userName, setUserName] = useState('')
    const [job, setJob] = useState('')
    const [imagUrl, setImagUrl] = useState('')
    const [email, setEmail] = useState('')
    const [mytoken, setToken] = useState('')
    const [isLoad, setIsLoad] = useState(true)  //判断是否加载数据

    const layout = {
        labelCol: {
            span: 8,
        },
        wrapperCol: {
            span: 16,
        },
    };

    const formTailLayout = {
        labelCol: {
            span: 4,
        },
        wrapperCol: {
            span: 8,
            offset: 12
        },
    };

    useEffect(() => {

        if (isLoad === true) {
            let token = localStorage.getItem('token')
            setToken(token)
            axios({
                method: 'post',
                url: servicePath.getUserInfo,
                timeout: 5000,
                headers: { 'token': token }
            }).then(res => {
                if (res.data === '') {
                    props.history.push('/login')
                } else {
                    setUId(res.data.id)
                    setUserId(res.data.userId)
                    setUserName(res.data.userName)
                    setImagUrl(res.data.imagUrl)
                    setJob(res.data.job)
                    setEmail(res.data.email)
                }
            })
        }

    }, [imagUrl])

    const clickUpdate = () => {
        confirm({
            title: '提示',
            content: '是否确认更新?',
            onOk() {
                let token = localStorage.getItem('token')
                axios({
                    method: 'post',
                    url: servicePath.updateUserInfo,
                    timeout: 5000,
                    headers: { 'token': token },
                    data: {
                        uid: uId,
                        userId: userId,
                        job: job,
                        email: email,
                        imagUrl: imagUrl
                    }
                }).then(res => {
                    // console.log(res)
                    if (res.data !== '' && res.data.result == 'success') {
                        props.history.push('/index')
                    }
                })
            }
        })
    }

    const onUploadChange = (info) => {
        // console.log(info)
        if (info.file.status === 'done') {
            setIsLoad(false)
            // console.log('imagurl:', info.file.response.data[0].url)
            setImagUrl(info.file.response.data[0].url)
        }
    }

    const onBeforeUpload = (File) => {
        console.log(File)
        if (File.type === 'image/png' || File.type === 'image/jpeg' || File.type === 'image/gif') {
            if (File.size > (1 * 1024 * 1024)) {
                message.error('文件不能超过1M')
                return false
            }
        } else {
            message.error('只允许上传jepg、png格式的图片')
            return false
        }

    }

    return (
        <div className="userinfo-div2" >
            <Card
                style={{ width: "400px" }}
                title="我的信息"
                bordered={true}>
                <Form {...layout}>
                    <Form.Item label="头像：">
                        <div className="image-div">
                            <Avatar size={120} src={imagUrl} alt='无' />
                            &nbsp;
                            <Upload
                                name="myFile"
                                action={servicePath.uploadImg}
                                headers={{ token: mytoken }}
                                multiple={false}
                                showUploadList={false}
                                onChange={onUploadChange}
                                beforeUpload={onBeforeUpload}
                            >
                                <Button size="small">更改头像</Button>
                            </Upload>
                        </div>
                    </Form.Item>
                    <Form.Item label="用户名:">
                        <Input disabled value={userId} />
                    </Form.Item>
                    <Form.Item label="姓名：">
                        <Input disabled={true} value={userName} />
                    </Form.Item>
                    <Form.Item label="岗位">
                        <Input
                            value={job}
                            onChange={e => { setJob(e.target.value) }}
                        />
                    </Form.Item>
                    <Form.Item label="Email：">
                        <Input
                            value={email}
                            onChange={e => { setEmail(e.target.value) }}
                        />
                    </Form.Item>
                    <Form.Item {...formTailLayout}>
                        <div className="userinfo-button-div">
                            <Button type="primary" onClick={clickUpdate}>修改</Button>
                        </div>
                    </Form.Item>
                </Form>


            </Card>
        </div>
    )
}

export default UpdateUserInfo