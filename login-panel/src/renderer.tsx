// 这个文件可能是用来渲染React组件的。它可能包含与视图相关的逻辑
import React from 'react'
import { render } from 'react-dom'
import { HashRouter, Route, Switch } from 'react-router-dom'
import { Main } from 'Pages/Main'
import { AnotherPage } from 'Pages/AnotherPage'
import { RegisterPage } from 'Pages/RegisterPage'
import { UserMain } from 'Pages/UserMain'

const Layout = () => {
    return (
        <HashRouter>
            <Switch>
                <Route path="/" exact component={Main} />
                <Route path="/register" exact component={RegisterPage} />
                <Route path="/UserMain" exact component={UserMain} />
            </Switch>
        </HashRouter>
    )
}
render(<Layout />, document.getElementById('root'))
