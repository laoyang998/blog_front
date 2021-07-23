import React, { useState, useEffect } from 'react'
import { List, Layout, Row, Col, Avatar, message, Affix, Button } from 'antd'
import axios from 'axios'
import servicePath from '../../Config/apiUrl'
import moment from 'moment'
import '../../static/css/ArticleList.css'
function ArticleListByUser(props) {

    const [userList, setUserList] = useState([])
    const [articleList, setArticleList] = useState([])
    const [curPage, setCurPage] = useState(0)
    const [curUserId, setCurUserId] = useState(0)
    const [totalPages, setTotalPages] = useState(0)

    useEffect(() => {
        if (curUserId === 0) {
            getUserList()
        }
    }, [curUserId])

    const getUserList = () => {
        axios({
            method: 'post',
            url: servicePath.getUserList,
            timeout: 5000
        }).then(res => {
            if (res.data !== '') {
                setUserList(res.data)
                setCurUserId(res.data[0].userId)
                loadFirstPageData(res.data[0].userId)
            }
        })
    }

    const loadMore = () => {
        let i_curpage = curPage + 1
        if (i_curpage >= totalPages){
            message.info('没有更多内容了')
        }
        setCurPage(i_curpage)
        axios({
            method: 'post',
            url: servicePath.getAuthorArticleList2,
            timeout: 5000,
            data: {
                'page': i_curpage,
                'pageSize': 8,
                'userid': curUserId
            }
        }).then(res => {
            if (res.data !== '') {
                setArticleList(articleList.concat(res.data.articleList))
            }
        }).catch(() => {
            message.error("超时")
        })
    }

    const loadFirstPageData = (userid) => {

        setCurUserId(userid)
        setCurPage(0)

        axios({
            method: 'post',
            url: servicePath.getAuthorArticleList2,
            timeout: 5000,
            data: {
                'page': 0,
                'pageSize': 8,
                'userid': userid
            }
        }).then(res => {
            if (res.data !== '') {
                // console.log(res.data)
                setArticleList(res.data.articleList)
                setTotalPages(res.data.totalPages)
            }
        }).catch(() => {
            message.error("超时")
        })
    }

    return (
        <div>
            <Row>
                <Col span={6}>
                    <Affix  offsetTop={50}>
                        <List style={{ marginRight: '10px', 
                                       backgroundColor: '#fff',
                                       height:'300px',
                                       overflowY:'scroll' }}
                            bordered
                            header={
                                <div >
                                    <Row>
                                        <Col span={24}><div >作者</div></Col>
                                    </Row>
                                </div>
                            }
                            dataSource={userList}
                            renderItem={item => (
                                <List.Item className="user-list" >
                                    <div
                                        className={item.userId === curUserId ? "article-userlist-selected" : "article-userlist"}
                                        onClick={() => loadFirstPageData(item.userId)}>
                                        <div><Avatar src={item.imagUrl} /></div>
                                        <div className="content">
                                            <div>{item.userName}</div>
                                            <div>{item.job}</div>
                                        </div>
                                    </div>

                                </List.Item>
                            )}
                        />
                    </Affix>
                </Col>
                <Col span={18}>
                    <div style={{ width: '100%' }}>
                        <List
                            dataSource={articleList}
                            renderItem={item => (
                                <div>
                                    <div className="homelist-articleitem">
                                        <div >
                                            <a className="title" target={"_blank"} href={"/showArticle/" + item.id}>{item.title}</a>
                                        </div>
                                        <div className="article-info">
                                            <Row>
                                                <Col span={24}>
                                                    <p>{item.txt}</p>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col span={3}>&nbsp;作者：{item.userName}</Col>
                                                <Col span={2}>类别:{item.articleType.typeName} &nbsp;&nbsp;</Col>
                                                <Col span={6}>发布时间:{moment(item.addDate).format('YYYY-MM-DD HH:mm:ss')} &nbsp;&nbsp;</Col>
                                                <Col span={13}>最后更新时间:{moment(item.updateDate).format('YYYY-MM-DD HH:mm:ss')}</Col>
                                            </Row>
                                        </div>
                                    </div>

                                </div>
                            )}
                        />
                        <div className="div-bottom">
                            <Button size="large" type="primary" onClick={loadMore}>加载更多</Button>
                        </div>
                    </div>
                </Col>
            </Row>
        </div>
    )
}

export default ArticleListByUser