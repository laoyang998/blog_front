import React from 'react'
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom'
import AdminIndex from './AdminIndex';
import AddArticle2 from './AddArticle2'
import ShowArticle from './Home/ShowArticle'
import Login from './Login'
import Home from './Home/Home'
import UpdateUserInfo from './Admin/UpdateUserInfo'
import SetPassword from './Admin/SetPassword'
import Manage from './Admin/Manage'

function Main() {
    return (
        <Router>
            <Switch>
                <Route path="/login" exact component={Login} />
                <Route path="/home" component={Home} />
                <Route path="/index" component={AdminIndex} />
                <Route path="/manage" component={Manage} />
                <Route path="/addarticle" exact component={AddArticle2} />
                <Route path="/addarticle/:id" exact component={AddArticle2} />
                <Route path="/showArticle/:id" exact component={ShowArticle}/>
                <Route path="/updateUserInfo" exact component={UpdateUserInfo}/>
                <Route path="/setPassWord" exact component={SetPassword}/>
                <Redirect from="/" to="/home" />
            </Switch>
        </Router>
    )
}

export default Main