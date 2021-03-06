import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { List, Row, Col, Modal, message, Button, Pagination, Spin } from 'antd'
import moment from 'moment'
import servicePath from '../Config/apiUrl'
import '../static/css/ArticleList.css'

const { confirm } = Modal

function ArticleList(props) {

    const [list, setList] = useState([])
    const [pageSize, setPageSize] = useState(5)
    const [currentPage, setCurrentPage] = useState(1)
    const [itemCount, setItemCount] = useState(0)
    const [isSpinning, setIsSpinning] = useState(false)
    const [curPathName,setCurPathName]=useState('')

    useEffect(
        () => {            
            getArticleList()
        }, [currentPage, pageSize, props.history.location.pathname])

    const getArticleList = () => {
        setIsSpinning(true)
        let articleReleased
        switch (props.history.location.pathname) {
            case '/index':
                articleReleased = true
                break;
            case '/index/articlelist':
                articleReleased = true
                break;
            case '/index/savedArticlelist':
                articleReleased = false
                break;
            default:
                break;
        }

        let token = localStorage.getItem('token')
        let dbPage
        if(curPathName!==props.history.location.pathname){
            dbPage=0
            setCurrentPage(1)
            setCurPathName(props.history.location.pathname)
        }else{
            dbPage = currentPage - 1
        }
        
        axios({
            method: 'post',
            timeout: 5000,
            url: servicePath.getAuthorArticleList,
            headers: { 'token': token },
            data: { 'page': dbPage, 'pageSize': pageSize, 'released': articleReleased }
        }).then(
            res => {
                setIsSpinning(false)
                // console.log(res.data)
                setList(res.data.articleList)
                setItemCount(res.data.itemCount)
            }
        ).catch(
            () => {
                setIsSpinning(false)
                message.error('????????????')
            }
        )
    }

    const deleteArticle = (id) => {
        confirm({
            title: "????????????????????????????????????",
            content: "??????????????????????????????",
            onOk() {
                let token = localStorage.getItem('token')
                console.log('ID:', id)
                axios({
                    method: 'post',
                    headers: { 'token': token },
                    url: servicePath.deleteArticle,
                    timeout: 5000,
                    data: { 'id': id }
                }).then(
                    res => {
                        if (res.data === 'OK') {
                            message.success('????????????')
                            getArticleList()
                        } else {
                            message.error('????????????')
                        }
                    }
                )
            }
        })

    }

    const editArticle = (id) => {
        props.history.push('/addarticle/' + id)
    }

    const WriteArticle = () => {
        props.history.push("/addarticle")
    }

    const pageChanged = (page, pageSize) => {
        console.log("page", currentPage)
        console.log("currentpage", page)
        setCurrentPage(page)
    }

    return (
        <div >
            <div style={{ textAlign: "left", margin: '5px 5px' }}>
                <Button
                    type="primary"
                    danger
                    size="large"
                    onClick={WriteArticle}
                >
                    ?????????
                </Button>
            </div>
            <Spin spinning={isSpinning}>
                <List
                    header={
                        <div className="header-div">
                            <Row>
                                <Col span={8}><b>??????</b></Col>
                                <Col span={4}><b>??????</b></Col>
                                <Col span={4}><b>??????</b></Col>
                                <Col span={5}><b>????????????</b></Col>
                                <Col span={3}><b>??????</b></Col>
                            </Row>
                        </div>
                    }
                    bordered
                    dataSource={list}
                    renderItem={item => (
                        <div className="list-div">
                            <Row>
                                <Col span={8}>
                                    <a target={"_blank"} href={"/showArticle/" + item.id}>{item.title}</a>
                                </Col>
                                <Col span={4}>{item.articleType.typeName}</Col>
                                <Col span={4}>{item.userName}</Col>
                                <Col span={4}>{moment(item.updateDate).format('YYYY-MM-DD HH:mm:ss')}</Col>
                                <Col span={4}>
                                    <Button type="primary" onClick={() => { editArticle(item.id) }}>??????</Button>&nbsp;&nbsp;
                            <Button onClick={() => { deleteArticle(item.id) }}>??????</Button>
                                </Col>
                            </Row>
                        </div>
                    )}
                />
                <div style={{ marginTop: '3px' }}>
                    <Pagination
                        current={currentPage}
                        total={itemCount}
                        pageSize={pageSize}
                        pageSizeOptions={[10, 20, 50]}
                        onChange={pageChanged}
                        onShowSizeChange={(current, size) => {
                            setPageSize(size)
                            setCurrentPage(current)
                        }}
                    />

                </div>
            </Spin>
        </div>
    )
}

export default ArticleList