import React, { useState, useEffect } from 'react'
import { Row, Col, Button, Input, message, Select, Modal, Upload, Affix } from 'antd'
import axios from 'axios'
import servicePath from '../Config/apiUrl'
import '../static/css/AddArticle2.css'
import E from 'wangeditor'
import hljs from 'highlight.js'
import 'highlight.js/styles/atelier-seaside-dark.css'

const { Option } = Select
const { confirm } = Modal

let editor = null   //富文本编辑器

function AddArticle2(props) {

    const [articleTitle, setArticleTitle] = useState('')   //文章标题
    const [articleId, setArticleId] = useState(0)  // 文章的ID，如果是0说明是新增加，如果不是0，说明是修改
    const [typeInfo, setTypeInfo] = useState([]) // 文章类别信息
    const [selectedType, setSelectType] = useState(1) //选择的文章类别
    const [articleContent, setArticleContent] = useState('')  //内容
    const [articleTxt, setArticleTxt] = useState('')    //纯文本内容
    const [articleIsReleased, setArticleIsReleased] = useState(false)  //内容
    const [mytoken, setMytoken] = useState('')

    useEffect(() => {

        let token = localStorage.getItem('token')
        setMytoken(token)

        GetTypeInfo()

        CreateEdtor()

        let articleId = props.match.params.id
        if (articleId) {
            GetArticle(articleId)
        }

        return () => {
            editor.destroy()
        }
    }, [])

    const GetTypeInfo = () => {
        let token = localStorage.getItem("token")
        axios({
            method: 'post',
            url: servicePath.getArticleTypes,
            timeout: 5000,
            headers: { 'token': token }
        }).then(
            res => {
                if (res.data == '') {
                    props.history.push("/login")
                } else {
                    setTypeInfo(res.data)
                }
            }
        ).catch(
            () => {
                message.error('请求超时')
            }
        )

    }

    const CreateEdtor = () => {

        let token = localStorage.getItem('token')

        editor = new E("#edtor")

        editor.config.zIndex = 500
        editor.config.height = 580
        editor.highlight = hljs      //代码高亮
        editor.config.excludeMenus = [
            'emoticon',
            'todo'
        ]
        editor.config.languageType = [
            'C',
            'C#',
            'C++',
            'CSS',
            'Java',
            'JavaScript',
            'JSON',
            'TypeScript',
            'Html',
            'SQL',
            'Markdown',
            'PHP',
            'Python',
        ]
        editor.config.onchange = (newHtml) => {
            setArticleContent(newHtml)
            setArticleTxt(editor.txt.text())
            // console.log("Html",newHtml)
            // console.log("文本：",editor.txt.text())
        }

        editor.config.uploadFileName = 'myFile'
        editor.config.uploadImgServer = servicePath.uploadImg
        editor.config.uploadImgHeaders = { 'token': token }
        editor.config.uploadImgShowBase64 = false
        editor.config.uploadImgMaxLength = 1  //文件数量
        editor.config.uploadImgMaxSize = 6 * 1024 * 1024  //文件大小
        editor.config.uploadImgAccept = ['jpg', 'jpeg', 'png', 'gif', 'bmp']
        editor.config.showLinkImg = false
        editor.config.uploadImgHooks = {
            before: function (xhr) {
                // console.log(xhr)

                // 可阻止图片上传
                // return {
                //     prevent: true,
                //     msg: '需要提示给用户的错误信息'
                // }
            },
            // 图片上传并返回了结果，图片插入已成功
            success: function (xhr) {
                console.log('success', xhr)
            },
            // 图片上传并返回了结果，但图片插入时出错了
            fail: function (xhr, editor, resData) {
                console.log('fail', resData)
            },
            // 上传图片出错，一般为 http 请求的错误
            error: function (xhr, editor, resData) {
                console.log('error', xhr, resData)
            },
            // 上传图片超时
            timeout: function (xhr) {
                console.log('timeout')
            },
            // 图片上传并返回了结果，想要自己把图片插入到编辑器中
            // 例如服务器端返回的不是 { errno: 0, data: [...] } 这种格式，可使用 customInsert
            customInsert: function (insertImgFn, result) {
                // result 即服务端返回的接口
                console.log('customInsert', result)

                // insertImgFn 可把图片插入到编辑器，传入图片 src ，执行函数即可
                insertImgFn(result.data[0].url)
            }
        }

        //配置视频上传
        editor.config.uploadVideoName = "video"
        editor.config.uploadVideoServer = servicePath.uploadVideo
        editor.config.uploadVideoHeaders = { 'token': token }
        editor.config.showLinkVideo = false
        editor.config.uploadVideoAccept = ['mp4']
        //视频回调函数
        editor.config.uploadVideoHooks = {
            // 上传视频之前
            before: function (xhr) {
                console.log(xhr)

                // 可阻止视频上传
                // return {
                //     prevent: true,
                //     msg: '需要提示给用户的错误信息'
                // }
            },
            // 视频上传并返回了结果，视频插入已成功
            success: function (xhr) {
                console.log('success', xhr)
            },
            // 视频上传并返回了结果，但视频插入时出错了
            fail: function (xhr, editor, resData) {
                console.log('fail', resData)
            },
            // 上传视频出错，一般为 http 请求的错误
            error: function (xhr, editor, resData) {
                console.log('error', xhr, resData)
            },
            // 上传视频超时
            timeout: function (xhr) {
                console.log('timeout')
            },
            // 视频上传并返回了结果，想要自己把视频插入到编辑器中
            // 例如服务器端返回的不是 { errno: 0, data: { url : '.....'} } 这种格式，可使用 customInsert
            customInsert: function (insertVideoFn, result) {
                // result 即服务端返回的接口
                console.log('customInsert', result)

                // insertVideoFn 可把视频插入到编辑器，传入视频 src ，执行函数即可
                insertVideoFn(result.data.url)
            }
        }

        editor.create()

    }
    //获取文章同容
    const GetArticle = (id) => {
        axios({
            method: 'post',
            url: servicePath.getArticle,
            timeout: 5000,
            data: { 'id': id }
        }).then(
            res => {
                console.log(res.data)
                setArticleId(res.data.id)
                setArticleTitle(res.data.title)
                setArticleIsReleased(res.data.released)
                setArticleContent(res.data.content)
                setSelectType(res.data.articleType.id)
                editor.txt.html(res.data.content)
            }
        )
    }

    //保存
    const SaveArticle = () => {
        // setArticleContent(editor.txt.html())
        if (!selectedType) {
            message.error("请选择文章类别")
            return false
        } else if (!articleTitle) {
            message.error("文章标题不能为空")
            return false
        } else if (!articleContent) {
            message.error("文章内容不能为空")
            return false
        }

        let article = {
            id: articleId,
            title: articleTitle,
            articleType: { id: selectedType },
            released: articleIsReleased,
            content: articleContent,
            txt: articleTxt
        }
        let token = localStorage.getItem('token')

        axios({
            method: 'post',
            url: servicePath.saveArticle,
            timeout: 5000,
            headers: { 'token': token },
            data: article
        }).then(
            res => {
                if (res.data != '') {
                    setArticleId(res.data.id)
                    message.success('保存成功')
                } else {
                    message.error('提交失败')
                }
            }
        )

    }
    //发布
    const ReaseArticle = () => {

        // setArticleContent(editor.txt.html())

        if (!selectedType) {
            message.error("请选择文章类别")
            return false
        } else if (!articleTitle) {
            message.error("文章标题不能为空")
            return false
        } else if (!articleContent) {
            message.error("文章内容不能为空")
            return false
        }
        confirm({
            title: "提示",
            content: "是否确认发布？",
            onOk() {
                let article = {
                    id: articleId,
                    title: articleTitle,
                    articleType: { id: selectedType },
                    released: true,
                    content: articleContent,
                    txt: articleTxt
                }

                let token = localStorage.getItem('token')

                axios({
                    method: 'post',
                    url: servicePath.saveArticle,
                    timeout: 5000,
                    headers: { 'token': token },
                    data: article
                }).then(
                    res => {
                        if (res.data != '') {
                            setArticleId(res.data.id)
                            message.success('发布成功')
                            props.history.push('/index')
                        } else {
                            message.error('提交失败')
                        }
                    }
                ).catch(() => {
                    message.error("发生异常")
                })

            }
        })
    }

    //选择类别
    const selectTypeHandle = (value) => {
        setSelectType(value)
    }
    //返回
    const back = () => {
        props.history.push("/index")
    }

    const uploadFile = () => {
        editor.txt.append('<a href="https://www.baidu.com">百度下载</a>')
    }

    const onUploadChange = (info) => {
        if (info.file.status === 'done') {
            message.info('successful!')
            // console.log(info.file.response.data)
            let txt = `<p>下载：<a target="_blank" href=${info.file.response.data.url}>${info.file.name}</a></p>`
            // console.log(txt)
            editor.txt.append(txt)
        } else if (info.file.status === 'error') {
            message.error('上传发生异常')
        }
    }

    return (
        <div style={{ paddingTop: '5px', margin: 'auto 10px' }}>
            <div><Button type="link" onClick={back}>返回</Button></div>
            <div style={{ margin: '5px auto' }}>
                <Row>
                    <Col span={16}>
                        <Input
                            placeholder="文章标题"
                            size="large"
                            value={articleTitle}
                            onChange={(e) => { setArticleTitle(e.target.value) }}
                        />
                    </Col>
                    <Col span={4}>
                        &nbsp;&nbsp;
                        类别：
                        <Select
                            defaultValue={selectedType}
                            value={selectedType}
                            size='large'
                            onChange={selectTypeHandle}>
                            {
                                typeInfo.map((item, index) => {
                                    return (<Option key={index} value={item.id}>{item.typeName}</Option>)
                                })
                            }
                        </Select>
                    </Col>
                    <Col span={4}>
                        <div style={{ textAlign: 'center' }}>
                            <Button size="large" onClick={SaveArticle}>保存</Button>&nbsp;&nbsp;
                            <Button
                                type="primary"
                                size="large"
                                onClick={ReaseArticle}
                            >发布</Button>
                        </div>
                    </Col>
                </Row>
            </div>
            <Row>
                <Col span={24}>
                    <div id="edtor" >

                    </div>
                </Col>
            </Row>
            <Row>
                <Col span={8}>
                    <div style={{ marginTop: '3px', marginLeft: '5px' }}>
                        <Upload
                            name="file"
                            //   showUploadList={false}
                            action={servicePath.uploadFile}
                            headers={{ token: mytoken }}
                            onChange={onUploadChange}
                            progress={{
                                strokeColor: { '0%': '#108ee9', '100%': '#87d068', },
                                strokeWidth: 3,
                                format: percent => `${parseFloat(percent.toFixed(2))}%`
                            }}
                        >
                            <Button size="small" type="dashed">上传附件</Button>
                        </Upload>
                    </div>
                </Col>
                <Col span={16}></Col>
            </Row>

        </div>
    )
}

export default AddArticle2