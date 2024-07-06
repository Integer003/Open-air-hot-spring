// 这个文件可能是用来渲染React组件的。它可能包含与视图相关的逻辑
import React from 'react'
import { render } from 'react-dom'
import { HashRouter, Route, Switch } from 'react-router-dom'
import { Main } from 'Pages/Main'
import { AnotherPage } from 'Pages/AnotherPage'
import { RegisterPage } from 'Pages/RegisterPage'
import { SellerMain } from 'Pages/SellerMain'
import { RegulatorMain } from 'Pages/RegulatorMain'
import { OperatorMain } from 'Pages/OperatorMain'
import { SellerProfile } from 'Pages/SellerPage/SellerProfile'

const Layout = () => {
    return (
            <HashRouter>
                <Switch>
                    <Route path="/" exact component={Main} />
                    <Route path="/register" exact component={RegisterPage} />
                    <Route path="/SellerMain" exact component={SellerMain} />
                    <Route path="/RegulatorMain" exact component={RegulatorMain} />
                    <Route path="/OperatorMain" exact component={OperatorMain} />
                    <Route path="/SellerProfile" exact component={SellerProfile} />
                </Switch>
            </HashRouter>
    )
}
render(<Layout />, document.getElementById('root'))
