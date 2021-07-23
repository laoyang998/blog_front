// let baseUrl="http://192.168.3.23:8443/"
let baseUrl="http://10.20.11.177:8443/"
// let baseUrl="http://10.20.40.53:8443/"
// let baseUrl="http://10.20.11.196:8443/"

let servicePath={
    Login:baseUrl+'login',
    getArticleTypes:baseUrl+'get_article_types',
    saveArticle:baseUrl+'save_article',
    getAuthorArticleList:baseUrl+'author_article_list',
    getAuthorArticleList2:baseUrl+'get_author_articles',
    getArticleListByType:baseUrl+'get_articlelist_by_type',
    deleteArticle:baseUrl+'delete_article',
    getArticle:baseUrl+'get_article',
    uploadImg:baseUrl+'uploadimg',
    checkLogin:baseUrl+'checklogin',
    getHomeArticleList:baseUrl+'get_rel_articlelist',
    searchArticle:baseUrl+'search_article',
    getUserInfo:baseUrl+'get_userinfo',
    getUserInfo2:baseUrl+'get_userinfo2',
    updateUserInfo:baseUrl+'update_userinfo',
    setUserPassword:baseUrl+'set_user_password',
    addUser:baseUrl+'add_user',
    getUserList:baseUrl+'get_user_list',
    uploadVideo:baseUrl+'upload_video',
    uploadFile:baseUrl+'file/upload',
    
    
}

export default servicePath