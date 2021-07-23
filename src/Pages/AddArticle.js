import React, { useState,useEffect } from 'react'
import marked from 'marked'
import axios from 'axios'
import servicePath from '../Config/apiUrl'
import '../static/css/AddArticle.css'
import { Row, Col, Input, Select, Button, DatePicker,message } from 'antd'

const { Option } = Select
const { TextArea } = Input

function AddArticle(props) {

    const [articleId,setArticleId] = useState(0)  // 文章的ID，如果是0说明是新增加，如果不是0，说明是修改
    const [articleTitle,setArticleTitle] = useState('')   //文章标题
    const [articleContent , setArticleContent] = useState('')  //markdown的编辑内容
    const [markdownContent, setMarkdownContent] = useState('预览内容') //html内容
    const [introducemd,setIntroducemd] = useState()            //简介的markdown内容
    const [introducehtml,setIntroducehtml] = useState('等待编辑') //简介的html内容
    const [showDate,setShowDate] = useState()   //发布日期
    const [updateDate,setUpdateDate] = useState() //修改日志的日期
    const [typeInfo ,setTypeInfo] = useState([]) // 文章类别信息
    const [selectedType,setSelectType] = useState(1) //选择的文章类别

    marked.setOptions({
        renderer:marked.Renderer(),
        gfm:true,
        pedantic:false,
        sanitize:false,
        tables:true,
        breaks:false,
        smartLists:true,
        smartypants:false
    })

    const changeContent=(e)=>{
        setArticleContent(e.target.value)
        let html=marked(e.target.value)
        // console.log(html)
        setMarkdownContent(html)
    }

    const GetTypeInfo=()=>{
        let token = localStorage.getItem("token")
        axios({
            method:'post',
            url:servicePath.getArticleTypes,
            timeout:5000,
            headers:{'token':token}
        }).then(
            res=>{
                if(res.data==''){
                    props.history.push("/login")
                }else{
                    setTypeInfo(res.data)
                }
            }
        ).catch(
            ()=>{
                message.error('请求超时')
            }
        )
        
    }
    
    const GetArticle=(id)=>{
        axios({
            method:'post',
            url:servicePath.getArticle,
            // timeout:5000,
            data:{'id':id}
        }).then(
            res=>{
                // console.log(res)
                setArticleId(res.data.id)
                setArticleTitle(res.data.title)
                setArticleContent(res.data.content)
                let html=marked(res.data.content)
                setMarkdownContent(html)
                setSelectType(res.data.articleType.id)
            }
        )
    }

    useEffect(()=>{
        GetTypeInfo()
        let articleId=props.match.params.id
        if(articleId){
            GetArticle(articleId)
        }
    },[])

    //选择类别
    const selectTypeHandle=(value)=>{
        setSelectType(value)
    }

    //保存文章
    const SaveArticle=()=>{
        if(!selectedType){
            message.error("请选择文章类别")
            return false
        }else if(!articleTitle){
            message.error("文章标题不能为空")
            return false
        }else if(!articleContent){
            message.error("文章内容不能为空")
            return false
        }

        console.log(selectedType)

        let article={
            id:articleId,
            title:articleTitle,
            articleType:{id:selectedType},
            content:articleContent
        }
        let token = localStorage.getItem('token')

        axios({
            method:'post',
            url:servicePath.saveArticle,
            // timeout:5000,
            headers:{'token':token},
            data:article
        }).then(
            res=>{
                if(res.data!=''){
                    setArticleId(res.data.id)
                    message.success('提交成功')
                }else{
                    message.error('提交失败')
                }
            }
        )
    }

    return (
        <div>
            <Row gutter={5}>
                <Col span={18}>
                    <Row gutter={10}>
                        <Col span={20}>
                            <Input 
                            placeholder="文章标题" 
                            size="large"
                            value={articleTitle}
                            onChange={e=>{
                                setArticleTitle(e.target.value)
                            }}
                            />
                        </Col>
                        <Col span={4}>
                            &nbsp;
                            <Select 
                            defaultValue={selectedType}
                            value={selectedType} 
                            size='large' 
                            onChange={selectTypeHandle}>
                                {
                                    typeInfo.map((item,index)=>{
                                        return(<Option key={index} value={item.id}>{item.typeName}</Option>)
                                    })
                                }
                            </Select>
                        </Col>
                    </Row>
                    <Row gutter={10}>
                        <Col span={12}>
                            <TextArea
                            className="markdown-content"
                            rows={25}
                            value={articleContent}
                            onChange={changeContent}
                            onPressEnter={changeContent}
                            placeholder="文章内容"
                            />
                        </Col>
                        <Col span={12}>
                            <div className="show-html"
                            dangerouslySetInnerHTML={{__html:markdownContent}}>

                            </div>
                        </Col>
                    </Row>
                </Col>
                <Col span={6}>
                    <Row>
                        <Col span={24}>
                            <Button size="large">暂存文章</Button>&nbsp;
                            <Button type="primary" size="large" onClick={SaveArticle}>发布文章</Button>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </div>
    )
}

export default AddArticle