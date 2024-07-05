// 这个文件可能是用来渲染React组件的。它可能包含与视图相关的逻辑。这是真正的入口。
// ts和tsx有细微的区别，告诉使用typescript语言，这个语言是从javascript演化过来的。
// 人们越用越多有了新的需求，风格需求：CSS，再新的需求就是交互的需求，javascript，设计者也不是专业程序员，也有很多问题（新时代的汇编语言）
// 写的是前端，编译成javascript。如何做一个好的程序语言，需要有类型安全->typescript(ts), 其实还不完全是类型安全。scala就是纯的类型安全。
// typescript生态还是不够好，所以在此基础之上使用react，这是全球最流行的。react可以搭建非常大量级的前端系统。我们就用的react框架。
// 理想的前端代码：不得不和js发生关系，但不发生太多关系，只说一下有root，塞进去，接下来都是react来接管。
// doom不要使用
import React from 'react'
import { render } from 'react-dom'
import { HashRouter, Route, Switch } from 'react-router-dom'
import { Main } from 'Pages/Main'
import { AnotherPage } from 'Pages/AnotherPage'
import { RegisterPage } from 'Pages/RegisterPage'
import { SellerMain } from 'Pages/SellerMain'
import { RegulatorMain } from 'Pages/RegulatorMain'
import { OperatorMain } from 'Pages/OperatorMain'

const Layout = () => {
    return (
        <HashRouter>
            <Switch>
                <Route path="/" exact component={Main} />
                <Route path="/register" exact component={RegisterPage} />
                <Route path="/SellerMain" exact component={SellerMain} />
                <Route path="/RegulatorMain" exact component={RegulatorMain} />
                <Route path="/OperatorMain" exact component={OperatorMain} />
            </Switch>
        </HashRouter>
    )
}
render(<Layout />, document.getElementById('root'))
