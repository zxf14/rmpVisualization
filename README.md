# 心筑后台管理系统

* 线上地址：http://manage.sinture.com

* 测试地址：http://121.40.87.126

* 测试账号：98765432100 / 12345678

## 特点

* 崇尚简单、业务分离，采用单页应用的模式

* 提供一套完整的开发模式，不依赖特定的后端开发环境，从开发到部署提供完善的解决方案

* 符合我们的业务需求组件和最佳实践指导

* 模块化的开发方式，减少后期维护难度

* 基于ES6（javascript标准）和react（数据驱动）,提升开发效率

* 前后端分离，职责分明，利于分工合作

* 纯静态文件部署，适应各种部署场景，不依赖任何后端环境

## 本地开发环境搭建：

1.下载代码库

```bash
git clone https://gitlab.com/xinzhu/xinzhuH5.git
```

2.自行安装nodejs，一定要6.0以上版本

3.安装依赖，项目根目录下运行

```bash
npm install
```

4.如果上一步安装太慢或者不成功，用淘宝镜像安装

* http://npm.taobao.org/

```bash
npm install --registry=http://registry.npm.taobao.org
```

5.启动本地开发环境

```bash
npm start
```

6.如果启动报错，某些模块没找到，直接安装缺少的模块

```bash
npm start xxx
```

7.在浏览器中输入lcoalhost:3001打开本地开发页面


## 知识储备

1.前端框架采用React

* http://wiki.jikexueyuan.com/project/react/

* http://www.ruanyifeng.com/blog/2015/03/react.html

2.使用React-Router构建单页应用

* http://www.ruanyifeng.com/blog/2016/05/react_router.html?utm_source=tool.lu

3.使用React-Redux进行应用的状态管理

* http://www.ruanyifeng.com/blog/2016/09/redux_tutorial_part_one_basic_usages.html

* http://cn.redux.js.org/index.html

4.使用Webpack完成代码打包

* https://fakefish.github.io/react-webpack-cookbook/

## 项目目录结构

> app/components

* 项目定制的页面公用组件，<b>一旦更改会影响所有页面</b>

* 基本涵盖所有常用的表单组件、文件上传、导航栏、提示、弹窗、按钮、日期选择等等，新做页面优先使用已有的组件，避免重复造轮子

> app/config

* 项目配置文件

> app/containers

* 每个文件夹都是一个页面
* actions.js：定义页面的交互行为，比如各种点击操作
* index.js：入口文件，渲染页面的内容，例化函数方法，把actions里面的函数绑定到props上，把state的值绑定到props上
* reducer.js：更新state，用来描述 action 如何改变 state tree

> app/public

* webpack打包后的文件，可以不用管

> app/redux

* configureStore.js：redux的配置文件

* rootReducer.js：项目中新增页面时，必须在这个文件中新增该页面的reducer

> app/styles

* 样式文件夹，如果有新增样式，必须在styles.css中导入

> app/view

* 公用视图文件，相当于一个html壳，引入了一些公用的js和css脚本。具体的业务页面会填充到id为app的dom中

> app/app.js

* 应用的入口文件，引入了react，以及react-router和react-redux两大组件
* 我们需要把app和redux建立起联系。Provider是react-redux提供的组件，它的作用是把store和视图绑定在了一起，这里的store就是那个唯一的state树。当store发生变化的时候，整个app就可以做出对应的变化
* 路由器router就是react的一个组件。router组件本身只是一个容器，真正的路由要通过route组件定义

> app/routes.js

* 前端路由文件。因为是单页应用，页面的路由不再由服务端来做，全部是前端做

* 新增页面后，必须在该文件中增加页面的路径，如

```
<Route path="articles" component={ArticleList} />
```

> app/server.js

* nodejs运行文件，建议大家都看一下，对项目架构可以有更深入理解

## 第三方组件

为提高开发效率，部分页面组件没有写到app/components文件夹中，而是直接引入的第三方库。

1. 一套基于 React.js 的 Web 组件库，比较全，我们自己的组件库里没有的话，可以用这个库里面的组件，比如分页组件。[线上DEMO](http://rsuite.github.io/#/components/buttons?_k=olo6oi)

2. Fetch，功能类似jQuery的$.ajax函数，项目中所有请求通过fetch发送


## 部署

1.准备好SSH的终端工具，推荐SecureCrt，登录服务器

2.将项目代码放到 /var/www 目录下，并安装好依赖包

3.修改nginx配置文件，路径为 /etc/nginx/sites-enabled/default，增加一个代理，例如：

![](http://b0.hucdn.com/party/2017/2/upload_d025ec26e7dcb7ac5a50acc3df7a3192_684x125.png)


4.改好之后保存，并重启nginx：

```bash
nginx -s reload
```

5.在项目目录下，/var/www/xinzhuH5，执行

```bash
npm run product
```

生成线上打包版本，然后用 node 的进程管理模块 pm2 启动应用

```bash
pm2 start app/server.compiled.js --name xinzhuH5
```

4.如何关掉进程？首先执行

```bash
pm2 list
```

可以看到应用列表，每个应用都有对应名字，然后执行

```bash
pm2 stop name
```

就可以关掉对应名字的应用。如果要删除某个应用，如下

```bash
pm2 delete name
```

就可以删除该应用

5.更新了代码怎么办？首先把服务器上代码更新了，然后再打包就好了。





