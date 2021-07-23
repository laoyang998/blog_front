import React, { useEffect, useState } from 'react'
import { Route, Switch } from 'react-router-dom'
import { Row, Col, Layout, Menu, Input, Button, Affix } from 'antd'
import { ClockCircleOutlined, MailOutlined, AppstoreOutlined,TeamOutlined } from '@ant-design/icons'
import HomeArticleList from './HomeArticleList.js'
import ArticleListByUser from './ArticleListByUser'
import servicePath from '../../Config/apiUrl'
import axios from 'axios'
import '../../static/css/Home.css'
import imgLogo from '../../static/img/logo.png'


const { Header, Content, Footer } = Layout
const { Search } = Input
const { SubMenu } = Menu

function Home(props) {

    const [current, setCurrent] = useState('mail')

    useEffect(()=>{
        if(props.history.location.pathname==='/home'){
            setCurrent('recent')
        }
    },[])

    const gotoBackground = () => {

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

            if (res.data.admin === true) {   //非管理员，进入普通页面
                props.history.push('/manage')
            } else {
                props.history.push('/index')
            }

        }).catch(() => {
            props.history.push("/login")
        })

    }

    const handleClick = (e) => {
        setCurrent(e.key)
        switch (e.key) {

            case "recent":
                props.history.push('/home')
                break;
            case "author":
                props.history.push("/home/author_article_list")
                break;
            case "MM":
            case "SD":
            case "PP":
            case "FICO":
            case "ABAP":
                props.history.push("/home/category/"+e.key)
                break;
        }
    }

    const onSearch = (value) => {
        console.log(value)
        props.history.push("/home/search/" + value)
    }

    return (
        <div className="homebody-div">
            <div>
                <Affix >
                    <Row>
                        <Col span={4}>
                            <div className="homehead-right">
                                {/* <h2>技术文章</h2> */}
                            </div>
                        </Col>
                        <Col span={18}>
                            <Menu onClick={handleClick} selectedKeys={[current]} mode="horizontal">
                                <Menu.Item key="recent" icon={<ClockCircleOutlined />}>
                                    最近更新
                            </Menu.Item>
                            <SubMenu key="SubMenu" icon={<AppstoreOutlined />} title="分类">
                                <Menu.Item key="MM">MM</Menu.Item>
                                <Menu.Item key="SD">SD</Menu.Item>
                                <Menu.Item key="PP">PP</Menu.Item>
                                <Menu.Item key="FICO">FICO</Menu.Item>
                                <Menu.Item key="ABAP">ABAP</Menu.Item>
                            </SubMenu>
                            <Menu.Item key="author" icon={<TeamOutlined />}>
                                作者
                            </Menu.Item>
                            <Menu.Item key="search">
                                <div className='search-div'>
                                    <Search placeholder="标题/文章内容/作者" onSearch={onSearch} enterButton />
                                </div>
                            </Menu.Item>
                            </Menu>
                        </Col>
                        <Col span={2}>
                            <div className="homehead-right">
                                <Button type="primary" onClick={gotoBackground}>进入后台</Button>
                            </div>
                        </Col>
                    </Row>
                </Affix>
                <Row>
                    <Col span={24}>
                        <div className="home-content">
                            <div className="home-content2">
                                <Switch>
                                    <Route path="/home" exact component={HomeArticleList} />
                                    <Route path="/home/search/:keyword" exact component={HomeArticleList} />
                                    <Route path="/home/category/:typename" exact component={HomeArticleList} />
                                    <Route path="/home/author_article_list" exact component={ArticleListByUser} />
                                </Switch>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    )
}

export default Home