import React, { useState, useEffect } from 'react'
import { Layout, Menu, Breadcrumb, Spin, message, Divider, Row, Col, Avatar, Button } from 'antd';
import axios from 'axios'
import { Route, HashRouter, withRouter, Switch } from 'react-router-dom'
import UserList from '../Admin/UserList'
import servicePath from '../../Config/apiUrl'
import '../../static/css/AdminIndex.css'
import {
  DesktopOutlined,
  PieChartOutlined,
  FileOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

function Manage(props) {

  const [collapsed, setCollapsed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedMenu, setSelectedMenu] = useState('')
  const [userName, setUserName] = useState('')
  const [userImg, setUserImg] = useState('')

  const onCollapse = collapsed => {
    setCollapsed(collapsed)
  }

  useEffect(() => {

    checkLogin()

    if (props.history.location.pathname === '/manage') {
      setSelectedMenu('manageUser')
    } else if (props.history.location.pathname === '/manage/manageUser') {
      setSelectedMenu('manageUser')
    }
  }, [props.history.location.pathname])

  const checkLogin = () => {
    let token = localStorage.getItem('token')
    axios({
      method: 'post',
      url: servicePath.getUserInfo,
      headers: { 'token': token },
      timeout: 5000
    }).then(res => {

      if (res.data === "") {
        props.history.push("/login")
      }

      // console.log(res)
      setUserName(res.data.userName)
      setUserImg(res.data.imagUrl)
      if (res.data.admin!==true) {   //非管理员，进入普通页面
          props.history.push('/index')
      }

    }).catch(() => {
      props.history.push("/login")
    })
  }

  const hancleMenuClick = (e) => {
    // console.log(props.history.location.pathname)
    setSelectedMenu(e.key)

    switch (e.key) {

      case 'userInfo':
        props.history.push("/updateUserInfo")
        break;
      case 'changePassword':
        props.history.push("/setPassWord")
        break;
      case 'manageUser':
        props.history.push("/manage/manageUser")
        break;
      case 'Quit':
        localStorage.removeItem('token')
        props.history.push('/login')
        break;
      default:
        break;
    }

  }

  const gotoFront = () => {
    props.history.push("/home")
  }

  return (
    <div>
      <Spin tip="Loading..." spinning={isLoading}>
        <Layout style={{ minHeight: '100vh' }}>
          <Sider
            theme="light"
            collapsible
            collapsed={collapsed}
            onCollapse={onCollapse}>
            <div className="logo" style={{ textAlign: "center", margin: "10px" }}>
              <Button type="primary" size="large" onClick={gotoFront}>返回首页</Button>
            </div>
            <Menu
              theme="light"
              defaultSelectedKeys={['1']}
              mode="inline"
              selectedKeys={[selectedMenu]}
              defaultOpenKeys={['sub1']}
              onClick={hancleMenuClick}
            >

            <Menu.Item icon={<UserOutlined/>} key='manageUser'>用户管理</Menu.Item>

            </Menu>
          </Sider>
          <Layout className="site-layout" >
            <Header style={{ height: "64px", backgroundColor: "#fff", borderBottom: "1px solid #eee" }}>
              <div className="admin-top-user">
                <Menu style={{ width: "150px" }}>
                  <SubMenu
                    icon={<Avatar size={40} src={userImg} />}
                    title={userName}
                    onClick={hancleMenuClick}>
                    <Menu.Item key="userInfo">个人信息</Menu.Item>
                    <Menu.Item key="changePassword">修改密码</Menu.Item>
                    <Menu.Item key="Quit">退出</Menu.Item>
                  </SubMenu>
                </Menu>
              </div>
            </Header>
            <Content style={{ margin: '0' }}>
              <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
                <div>
                  <Switch>
                    <Route path="/manage" exact component={UserList} />
                    <Route path="/manage/manageUser" exact component={UserList} />
                  </Switch>
                </div>
              </div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>mys ,,LTD</Footer>
          </Layout>
        </Layout>
      </Spin>
    </div>
  );
}

export default Manage