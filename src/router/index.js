import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// 登录
import Login from 'pages/Login/Login'

// 管理后台主页
import Main from 'pages/Main'
import Home from 'pages/Home/Home'

// 个人资料
import Profile from 'pages/Profile/Profile'
import ChangePwd from 'pages/Profile/ChangePwd'

// 账户管理
import AccountManage from 'pages/AccountManage/AccountList'
import StoreAccount from 'pages/AccountManage/StoreAccount'

// 案例管理
import CaseManage from 'pages/CaseManage/CaseList'

// 广播管理
import Broadcast from 'pages/Broadcast/BroadcastList'

// 申报消息
import DeclareMsg from 'pages/DeclareMsg/MsgList'

// 联系设置
import CompanyInfo from 'pages/ContactManage/CompanyInfo'
import ContactWay from 'pages/ContactManage/ContactWay'


// 错误页面
import Err404 from 'pages/Error/Err404'

const RouterMap = [
    // 后台登录
    { path: '/Login', name: 'Login', component: Login }, 
    // 后台管理页
    {
      path: '/',
      name: 'Main',
      component: Main,
      // 路由重定向
      redirect: '/Home',
      children: [
            // 后台首页
            { path: '/Home', name: 'Home', component: Home },
            // 个人资料
            { path: '/Profile', name: 'Profile', component: Profile },
            // 修改密码
            { path: '/ChangePwd', name: 'ChangePwd', component: ChangePwd },
            // 账户管理
            { path: '/AccountManage/List', name: 'AccountManage', component: AccountManage },
            { path: '/AccountManage/Store', name: 'StoreAccount', component: StoreAccount },
            // 案例管理
            { path: '/CaseManage/List', name: 'CaseManage', component: CaseManage },
            // 广播管理
            { path: '/Broadcast/List', name: 'Broadcast', component: Broadcast },
            // 申报消息
            { path: '/DeclareMsg/List', name: 'DeclareMsg', component: DeclareMsg },
            // 联系设置
            { path: '/ContactManage/CompanyInfo', name: 'CompanyInfo', component: CompanyInfo }, 
            { path: '/ContactManage/ContactWay', name: 'ContactWay', component: ContactWay },  
            // 404
            { path: '/404', name: '404', component: Err404 },
        ]
    }
]

export default new Router({
    routes: RouterMap
});
