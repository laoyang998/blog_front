import React, { useState, useEffect } from 'react'
import axios from 'axios'
import servicePath from '../../Config/apiUrl'
import moment from 'moment'
import { Col, Row, List, Button, message } from 'antd'
import '../../static/css/HomeArticleList.css'

function HomeArticleList(props) {

    const [currentPage, setCurrentPage] = useState(0)
    const [pageCount, setPageCount] = useState(0)
    const [articleList, setArticleList] = useState([])
    const [search, setSearch] = useState('')
    const [articleTypeName,setArticleTypeName]=useState('')
    const [queryType,setQueryType]=useState('')  // all:全部  search:查询  category:分类
    useEffect(() => {

        //初始化
        setSearch('')
        setCurrentPage(0)

        let searchWord = props.match.params.keyword
        let typeName=props.match.params.typename

        if (searchWord) {
            setQueryType('search')
            setSearch(searchWord)
            loadFirstSearchPageData(searchWord)   //查询页
        } else if(typeName){
            setQueryType('category')
            setArticleTypeName(typeName)
            loadFirstPageByTypeName(typeName)
        }
        else{
            setQueryType('all')
            loadFirstPageData()
        }

    }, [props.history.location.pathname])

    const loadMore = () => {
        if(queryType=='search'){   
            loadMore_search(search)   //查询
        }else if(queryType==='category'){
            loadMore_category(articleTypeName)
        }else{
            loadMore_all()
        }
    }
   
    const loadMore_category=(typeName)=>{
        let curpagenum = currentPage + 1
        if (curpagenum >= pageCount) {
            message.info('没有更多的内容了')
            return false
        }
        axios({
            method: 'post',
            url: servicePath.getArticleListByType,
            timeout:5000,
            data: {
                'pageNum': curpagenum,
                'pageSize':8,
                'typeName': articleTypeName
            }
        }).then(res => {
            console.log(res)
            if (res.data !== '') {
                setCurrentPage(curpagenum)
                setPageCount(res.data.totalPages)
                setArticleList(articleList.concat(res.data.articleList)) //拼接数据
            }
        }).catch(() => {
            message.error('发生网络异常')
        })
    }

    const loadMore_search=(str)=>{

        let curpagenum = currentPage + 1
        if (curpagenum >= pageCount) {
            message.info('没有更多的内容了')
            return false
        }
        axios({
            method: 'post',
            url: servicePath.searchArticle,
            data: {
                'page': curpagenum,
                'pagesize':8,
                'search': str
            }
        }).then(res => {
            // console.log(res)
            if (res.data !== '') {
                setCurrentPage(curpagenum)
                setPageCount(res.data.pageCount)
                setArticleList(articleList.concat(res.data.articleList)) //拼接数据
            }
        }).catch(() => {
            message.error('发生网络异常')
        })
    }

    const loadMore_all=()=>{
        let curpagenum = currentPage + 1
        if (curpagenum >= pageCount) {
            message.info('没有更多的内容了')
            return false
        }
        axios({
            method: 'post',
            url: servicePath.getHomeArticleList,
            data: {
                'page': curpagenum,
                'pagesize':8,
                'released': true
            }
        }).then(res => {
            // console.log(res)
            if (res.data !== '') {
                setCurrentPage(curpagenum)
                setPageCount(res.data.pageCount)
                setArticleList(articleList.concat(res.data.articleList)) //拼接数据
            }
        }).catch(() => {
            message.error('发生网络异常')
        })
    }
    
    const loadFirstPageByTypeName=(typeName)=>{
        axios({
            method:'post',
            url:servicePath.getArticleListByType,
            timeout:5000,
            data:{
                typeName:typeName,
                pageNum:0,
                pageSize:8
            }
        }).then(res=>{
            if(res.data!==''){
                setPageCount(res.data.totalPages)
                setArticleList(res.data.articleList)
            }
        }).catch(()=>{
            message.error('发生网络异常')
        })
    }

    const loadFirstPageData = () => {
        axios({
            method: 'post',
            url: servicePath.getHomeArticleList,
            data: {
                'page': 0,
                'pagesize':8,
                'released': true
            }
        }).then(res => {
            // console.log(res)
            if (res.data !== '') {
                setPageCount(res.data.pageCount)
                setArticleList(res.data.articleList)
            }
        }).catch(() => {
            message.error('发生网络异常')
        })
    }

    const loadFirstSearchPageData = (keyword) => {
        axios({
            method: 'post',
            url: servicePath.searchArticle,
            data: {
                'page': 0,
                'pagesize':8,
                'search': keyword
            }
        }).then(res => {
            if (res.data !== '') {
                
                setPageCount(res.data.pageCount)
                setArticleList(res.data.articleList)
            }
        }).catch(() => {
            message.error('发生网络异常')
        })
    }


    

    return (
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
                                    <Col span={2}>&nbsp;作者：{item.userName}</Col>
                                    <Col span={2}>类别:{item.articleType.typeName} &nbsp;&nbsp;</Col>
                                    <Col span={4}>发布时间:{moment(item.addDate).format('YYYY-MM-DD HH:mm:ss')} &nbsp;&nbsp;</Col>
                                    <Col span={16}>最后更新时间:{moment(item.updateDate).format('YYYY-MM-DD HH:mm:ss')}</Col>
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
    )
}

export default HomeArticleList