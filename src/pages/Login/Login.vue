<template>
  	<div id="login" class="m-login">
       <Form ref="loginForm" :model="loginForm" :rules="validate" class="login-form">
       		<h3 class="form-title"><img :src="logo"/></h3>
	        <Form-item prop="username">
	            <Input v-model="loginForm.username" placeholder="请输入手机号码">
	            	<Icon type="ios-person-outline" slot="prepend"></Icon>
	            </Input>
	        </Form-item>
	        <Form-item prop="password">
	            <Input type="password" v-model="loginForm.password" placeholder="请输入密码">
	            	<Icon type="ios-locked-outline" slot="prepend"></Icon>
	            </Input>
	        </Form-item>
	        <Form-item>
	            <Checkbox v-model="remeberPwd">记住密码</Checkbox>
	            <!-- <router-link to="/SendVerifyCode" class="fr">忘记密码</router-link> -->
	        </Form-item>
	        <Form-item>
	            <Button type="primary" long @click="submit('loginForm')" :loading="loading">登录</Button>
	        </Form-item>
	        <!-- <Form-item>
	            <Button type="primary" long @click="">注册</Button>
	        </Form-item> -->
	        <div style="text-align:center">测试使用登录账号:17777075292密码:mimashi123</div>
	    </Form>
	</div>
</template>

<script>
	import { SetCookie, SetLocalS, GetLocalS, Encrypt, Decrypt } from 'common/important.js'
  import Common from '@/common/common.js'
	 // Api方法
	 import Login from 'api/login.js'

	export default {
		data(){
			return {
				// 加载状态
				loading: false,
				// logo
				logo: require('assets/images/logo.png'),
				// 表单信息
				loginForm:{
					// 用户名
					username: '',
					// 密码
					password: '',
				},
        // cdKey开始时间
        startTime: '',
        // cdKey结束时间
        endTime: '',
				// 记住密码
				remeberPwd: false,
				// 验证规则
				validate: {
          username: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
          password: [{ required: true, message: '登录密码不能为空', trigger: 'blur' }],
        }
			}
		},
		created() {
			// 判断本地存储用户名是否存在
			if (GetLocalS('username')) {
				// 获取本地存储的用户名和密码
				this.loginForm.username = GetLocalS('username');
				this.loginForm.password = Decrypt(GetLocalS('password'));
				this.remeberPwd = true;
			}
		},
		mounted(){
			const loginBg = document.getElementById('login');
			// 设置背景颜色高度
			loginBg.style.height = document.body.scrollHeight + 'px';
			// 监听窗口变化
            window.onresize = () => {
				loginBg.style.height = document.body.scrollHeight + 'px';
            }
		},
		methods:{
			// 提交表单
			submit (form){
        this.$refs[form].validate((valid) => {
          if (valid) {
            this.loading = true
            Login.Login(this.loginForm).then(res=>{
              this.loading = false
//              console.log(res)
              if(res.code==200){
                // token存cookie
                SetCookie('pAppToken', res.data.token);
                this.$store.commit('SET_USER_TOKEN', res.data.token);
                this.$Message.success('登录成功!');
                //存id
                SetLocalS('pAppUserId',res.data.id)
                // 判断是否记住密码
                if (this.remeberPwd) {
                  // 本地存储用户名和密码
                  SetLocalS('username', this.loginForm.username);
                  SetLocalS('password', Encrypt(this.loginForm.password));
                }
                this.$router.push({ name: 'Main' });
                return true;
              }
              else{
                this.$Message.error(res.data.msg);
              }
            }).catch(err=>{
              // 登录失败提示
              this.$Message.error('服务器出错，请联系技术人员!');
              this.loading = false;
            })
          }
          else this.$Message.error('登录失败!填写有误！');
        })
      },
		}
	}
</script>
<style lang="less" scoped>
	.m-login {
	    position: relative;
	    width: 100%;
	    height: 100%;
	    height: 100vh;
		min-height: 900px;
	    background-color: #4d5256;
	}

	.login-form{
	    position: absolute;
	    left: 50%;
		top: 50%;
	    width: 400px;
	    padding: 35px 35px 15px;
	    margin: auto;
		margin-top: -250px;
		margin-left: -200px;
	    background: #fff;
	    border: 1px solid #eaeaea;
	    border-radius: 5px;
		-moz-border-radius: 5px;
		-webkit-border-radius: 5px;
		box-shadow: 0 0 25px #555;
	}

	.form-title{
		font-size: 24px;
		font-weight: 400;
		color: #555;
		margin: 0 auto 20px;
		text-align: center;
		font-weight: 700;

		img{
			display: inline-block;
		}
	}
</style>
