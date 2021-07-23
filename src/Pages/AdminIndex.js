import React, { useState, useEffect } from 'react'
import { Layout, Menu, Breadcrumb, Spin, message, Divider, Row, Col, Avatar, Button } from 'antd';
import axios from 'axios'
import { Route, HashRouter, withRouter, Switch } from 'react-router-dom'
import AddArticle from './AddArticle'
import ArticleList from './ArticleList'
import AddArticle2 from './AddArticle2'
import UpdateUserInfo from './Admin/UpdateUserInfo'
import UserList from './Admin/UserList'
import servicePath from '../Config/apiUrl'
import '../static/css/AdminIndex.css'
import {
  DesktopOutlined,
  PieChartOutlined,
  FileOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

function AdminIndex(props) {

  const [collapsed, setCollapsed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [typeInfo, setTypeInfo] = useState([])
  const [selectedMenu, setSelectedMenu] = useState('')
  const [userName, setUserName] = useState('')
  const [userImg, setUserImg] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)

  const onCollapse = collapsed => {
    setCollapsed(collapsed)
  }

  useEffect(() => {

    checkLogin()

    if (props.history.location.pathname === '/index') {
      setSelectedMenu('ReleaseArticleList')
    } else if (props.history.location.pathname === '/index/articlelist') {
      setSelectedMenu('ReleaseArticleList')
    }
    else if (props.history.location.pathname.search('/index/add') !== -1) {
      setSelectedMenu('addArticle')
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

      setUserName(res.data.userName)
      setUserImg(res.data.imagUrl)
      setIsAdmin(res.data.admin)
      if (res.data.admin) {  //如果是管理员，则跳转到管理员界面
        props.history.push('/manage')
      }

    }).catch(() => {
      props.history.push("/login")
    })
  }

  const hancleMenuClick = (e) => {
    // console.log(props.history.location.pathname)
    setSelectedMenu(e.key)

    switch (e.key) {
      case 'addArticle':
        props.history.push('/index/add')
        break;
      case 'ReleaseArticleList':
        props.history.push('/index/articlelist')
        break;
      case 'addArticle2':
        props.history.push('/index/add2')
        break;
      case 'SavedArticleList':
        props.history.push('/index/savedArticlelist')
        break;
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

              <SubMenu
                disabled={isAdmin}
                key="sub1"
                // onClick={hancleMenuClick}
                icon={<UserOutlined />}
                title={<span>文章管理</span>}
              >
                {/* <Menu.Item key="addArticle" >添加文章</Menu.Item> */}
                <Menu.Item key="ReleaseArticleList">已发布文章</Menu.Item>
                <Menu.Item key="SavedArticleList">暂存文章</Menu.Item>
              </SubMenu>

            </Menu>
          </Sider>
          <Layout className="site-layout" >
            <Header style={{ height: "64px", backgroundColor: "#fff", borderBottom: "1px solid #eee" }}>
              <div className="admin-top-user">
                <Menu style={{ width: "150px" }}>
                  <SubMenu
                    icon={<Avatar size={35} src={userImg} />}
                    title={<>&nbsp;&nbsp;{userName}</>}
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
                    <Route path="/index" exact component={ArticleList} />
                    <Route path="/index/add" exact component={AddArticle2} />
                    <Route path="/index/add/:id" exact component={AddArticle} />
                    <Route path="/index/add2" exact component={AddArticle2} />
                    <Route path="/index/articlelist" exact component={ArticleList} />
                    <Route path="/index/savedArticlelist" exact component={ArticleList} />
                    <Route path="/index/updateUserInfo" exact component={UpdateUserInfo} />
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

export default AdminIndex