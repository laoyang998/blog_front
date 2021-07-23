import axios from 'axios'
import servicePath from '../Config/apiUrl'
import {message} from 'antd'

const Utils={}

Utils.checkLogin=(props)=>{
    let token = localStorage.getItem('token')
    axios({
        method:'post',
        url:servicePath.checkLogin,
        timeout:5000,
        headers:{'token':token}
    }).then(res=>{
        // console.log(res)
        if(res.data.check!=='OK'){
            props.history.push('/login')
        }
    }).catch(()=>{
        message.error('登录异常')
        props.history.push('/login')
    })
}

export default Utils
