import React, { useEffect, useState } from 'react'
import { Col, Row, Avatar, Image, Divider, Affix } from 'antd'
import axios from 'axios'
import moment from 'moment'
import servicePath from '../../Config/apiUrl'
import '../../static/css/ShowArticle.css'

function ShowArticle(props) {

    const [articleTitle, setArticleTitle] = useState('')
    const [articleContent, setArticleContent] = useState('')
    const [userName, setUserName] = useState('')
    const [articleUpdateTime, setArticleUpdateTime] = useState('')
    const [userId, setUserId] = useState(0)
    const [imagUrl, setImagUrl] = useState('')


    useEffect(() => {
        let articleId = props.match.params.id
        if (articleId) {
            getArticle(articleId)
        }
    }, [])

    const getArticle = (id) => {
        axios({
            method: 'post',
            url: servicePath.getArticle,
            timeout: 5000,
            data: { 'id': id }
        }).then(res => {
            if (res.data !== '') {
                setArticleTitle(res.data.title)
                setArticleContent(res.data.content)
                setUserId(res.data.userid)
                setUserName(res.data.userName)
                setArticleUpdateTime(res.data.updateDate)

                getUserInfo(res.data.userid)  //获取用户信息
            }
        })
    }

    const getUserInfo = (userid) => {
        axios({
            method: 'post',
            url: servicePath.getUserInfo2,
            timeout: 5000,
            data: { 'userid': userid }
        }).then(res => {
            if (res.data !== '') {
                setImagUrl(res.data.imagUrl)
            }
        })
    }

    return (
        <div className="out-div">
            <div className="show-div">
                <Affix >
                    <div className="article-head">
                        <Row>
                            <Col span={19}>
                                <div className="title-div">{articleTitle}</div>
                            </Col>
                            <Col span ={5}>
                            <Col span={24}>
                                <div className="userinfo-div">
                                    <Avatar size={64} src={imagUrl} />
                                    <div>
                                        <div>&nbsp;&nbsp;{userName}</div>
                                        <div>&nbsp;&nbsp;{moment(articleUpdateTime).format('YYYY-MM-DD HH:mm:ss')}</div>
                                    </div>
                                </div>
                            </Col>
                            </Col>
                        </Row>
                    </div>
                </Affix>
                <Row>
                    <Col span={24}>
                        <div dangerouslySetInnerHTML={{ __html: articleContent }}>

                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    )
}

export default ShowArticle