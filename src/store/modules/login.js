// Api方法
import Login from '@/api/login.js'
import Account from '@/api/account.js'
// 通用JS
import LoginCheck from '@/common/login_check.js'
import Common from '@/common/common.js'

// 用户信息
const login = {
	// 负责存储整个应用的状态数据
	state: {},
	// 用来处理数据的函数，只能同步操作
    mutations: {},
    // 异步操作
	actions: {
        // 验证token
        CheckToken ({ commit , state }) {
            if(Common.GetCookie('pAppToken')){
                // 获取用户信息
                Login.TokenCheck(Common.GetCookie('pAppToken'))
                .then(res => {
                    const result = res.data;
                    // 登录认证成功
                    if(res.code == 200)
                        LoginCheck.setAccount(commit, result);
                    // 登录认证失败
                    else LoginCheck.clearAccount(commit);
                })
                .catch(err => {
                    LoginCheck.clearAccount(commit);
                });

                // // 获取未读消息条数
                // Account.GetUnReadCount()
                // .then(res => {
                //     if(res.data.code == 200)
                //         commit('SET_UN_READ_COUNT', res.data.data);
                //     else commit('SET_UN_READ_COUNT', 0);
                // })
                // .catch(err => console.log(err));
            }
            // token已失效
            else{
                LoginCheck.clearAccount(commit);
            }
        },
        // 登出
        LogOut({ commit, state }) {
            LoginCheck.clearAccount(commit);
        }
    }
}

export default login;
