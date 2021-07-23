import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Button, Modal, List, Form, Input, Avatar, Upload, message, Row, Col, Space } from 'antd'
import Utils from '../../Common/Utils'
import servicePath from '../../Config/apiUrl'
// import '../../static/css/ArticleList.css'

const { confirm } = Modal

function UserList(props) {

    const [dialogVisible, setDialogVisible] = useState(false)
    const [userId, setUserId] = useState('')
    const [userName, setUserName] = useState('')
    const [password1, setPassword1] = useState('')
    const [password2, setPassword2] = useState('')
    const [job, setJob] = useState('')
    const [imagUrl, setImagUrl] = useState('')
    const [email, setEmail] = useState('')
    const [mytoken, setToken] = useState('')
    const [userList, setUserList] = useState([])
    const [count, setCount] = useState(0)
    const [dataFresh, setDataFresh] = useState(true)

    useEffect(() => {
        //登录检查
        Utils.checkLogin(props)
        let token = localStorage.getItem('token')
        setToken(token)
        if (dataFresh) {
            getUserList()
            setDataFresh(false)
        }
        setCount(count + 1)
    }, [dialogVisible, imagUrl, dataFresh]);

    const getUserList = () => {
        let token = localStorage.getItem('token')
        axios({
            method: 'post',
            url: servicePath.getUserList,
            timeout: 5000,
            headers: { 'token': token }
        }).then(res => {
            console.log(res)
            setUserList(res.data)
        }).catch(() => {
            message.error('网络异常')
        })
    }

    const onDialogOk = () => {

        if (password1 !== password2) {
            message.error('重复密码不一致')
            return false
        } else if (password1 === '') {
            message.error('密码不能为空')
            return false
        } else if (userId === '') {
            message.error('用户名不能为空')
            return false
        } else if (userName === '') {
            message.error('姓名不能为空')
            return false
        }

        axios({
            method: 'post',
            url: servicePath.addUser,
            timeout: 5000,
            headers: { 'token': mytoken },
            data: {
                userId: userId,
                userName: userName,
                password: password1,
                job: job,
                imagUrl: imagUrl,
                email: email
            }
        }).then(res => {
            if (res.data.result === 'success') {
                message.success('添加用户成功')
                setDataFresh(true)
            } else {
                message.error('添加用户失败')
            }
        }).catch(() => {
            message.error('网络异常')
        })
        setDialogVisible(false)
    }
    const onDialogCancle = () => {
        setDialogVisible(false)
    }

    const addNewUser = () => {
        setDialogVisible(true)
    }

    const onUploadChange = (info) => {
        // console.log(info)
        if (info.file.status === 'done') {
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
        <div>
            <Button type="primary" size="middle" onClick={addNewUser}>新增用户</Button>
            <Modal
                style={{ top: 10 }}
                title='新增用户'
                okText='确定'
                cancelText='取消'
                visible={dialogVisible}
                onOk={onDialogOk}
                onCancel={onDialogCancle}
            >
                <div className="userlist-div">
                    <Form labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} size="small"
                        name="dialog">
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
                                    <Button size="small">上传头像</Button>
                                </Upload>
                            </div>
                        </Form.Item>
                        <Form.Item label="用户名:" name="userid" rules={[{ required: true }]}>
                            <Input value={userId}
                                onChange={e => { setUserId(e.target.value) }} />
                        </Form.Item>
                        <Form.Item label="姓名:" name="username" rules={[{ required: true }]}>
                            <Input value={userName}
                                onChange={e => { setUserName(e.target.value) }} />
                        </Form.Item>
                        <Form.Item label="密码：" name="pwd1" rules={[{ required: true }]}>
                            <Input.Password value={password1}
                                onChange={e => { setPassword1(e.target.value) }} />
                        </Form.Item>
                        <Form.Item label="重复密码：" name="pwd2" rules={[{ required: true }]}>
                            <Input.Password value={password2}
                                onChange={e => { setPassword2(e.target.value) }} />
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
                    </Form>
                </div>
            </Modal>

            <List
                header={
                    <div className="header-div">
                        <Row>
                            <Col span={4}>用户名</Col>
                            <Col span={4}>姓名</Col>
                            <Col span={4}>岗位</Col>
                            <Col span={12}>操作</Col>
                        </Row>
                    </div>
                }
                bordered
                dataSource={userList}
                renderItem={item => (
                    <div className="list-div">
                        <Row>
                            <Col span={4}>{item.userId}</Col>
                            <Col span={4}>{item.userName}</Col>
                            <Col span={4}>{item.job}</Col>
                            <Col span={12}>
                                <Space>
                                    <Button type="primary">修改</Button>
                                    <Button type="ghost">{(item.active ? '禁用' : '启用')}</Button>
                                </Space>
                            </Col>
                        </Row>
                    </div>
                )}
            />

        </div>
    )
}

export default UserList