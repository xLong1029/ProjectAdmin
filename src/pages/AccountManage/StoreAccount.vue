<template>
    <div class="g-content">
        <!--  加载判断 -->
        <Loading v-if="pageLoading"></Loading>
        <Form v-else ref="infoForm" :model="infoForm" :rules="pageType == 'add'?validate:validateUpdate" :label-width="120">
            <!-- 个人信息 -->
            <h2 class="m-title">个人信息</h2>
            <div class="m-content">
                <Row>
                    <Col span="12">
                        <Form-item v-if="pageType == 'edit'" label="创建时间：">
                            <span>{{ infoForm.createTime }}</span>
                        </Form-item>

                        <Form-item label="用户名称：" prop="userName">
                            <Input v-model="infoForm.userName" placeholder="请输入真实姓名"></Input>
                        </Form-item>
                        <!--<Form-item label="性别：" prop="gender">-->
                            <!--<Radio-group v-model="infoForm.gender">-->
                                <!--<Radio label="男">男</Radio>-->
                                <!--<Radio label="女">女</Radio>-->
                            <!--</Radio-group>-->
                        <!--</Form-item>-->
                        <Form-item label="手机号码：" prop="mobile">
                            <Input v-model="infoForm.mobile" placeholder="请输入手机号码"></Input>
                        </Form-item>
                    </Col>
                    <Col span="12">
                        <Form-item v-if="pageType == 'edit'" label="用户编号：">
                            <span>{{ infoForm.id }}</span>
                        </Form-item>
                        <!--<Form-item label="头像：" style="margin-bottom:16px;">-->
                            <!--&lt;!&ndash; 组件-图片上传-单图片显示 &ndash;&gt;-->
                            <!--<SingleImage :preview="true" size-hint="100*100px"></SingleImage>-->
                        <!--</Form-item>-->
                        <Form-item label="邮箱：" prop="email">
                            <AutoComplete v-model="infoForm.email" :data="emailList" @on-search="selectEmail" @on-select="setEmail" placeholder="请输入邮箱地址"></AutoComplete>
                        </Form-item>
                        <Form-item label="类型：" prop="type">
                            <RadioGroup v-model="infoForm.type">
                                <Radio :label="1">普通用户</Radio>
                                <Radio :label="1024">管理员</Radio>
                            </RadioGroup>
                        </Form-item>
                    </Col>
                </Row>
            </div>
            <!-- 账号信息 -->
            <h2 class="m-title">账号信息<span>(密码为空表示不修改)</span></h2>
            <div class="m-content">
                <Row>
                    <Col span="12">
                    <Form-item label="密码：" prop="password">
                        <Input type="password" v-model="infoForm.password" placeholder="请输入密码"></Input>
                    </Form-item>
                    </Col>
                    <Col span="12">
                    <Form-item label="确认密码：" prop="passwdCheck">
                        <Input type="password" v-model="infoForm.passwdCheck" placeholder="请输入确认密码"></Input>
                    </Form-item>
                    </Col>
                </Row>
            </div>
            <!-- 操作按钮 -->
            <div class="m-operation">
                <Button v-if="pageType == 'edit'" class="fr" type="primary" @click="submit('infoForm', 'edit')">确认修改</Button>
                <Button v-else class="fr" type="primary" @click="submit('infoForm', 'add')">确认新增</Button>
                <Button class="fr" type="ghost" @click="$router.go(-1)">返回</Button>
                <div class="clearfix"></div>
            </div>
        </Form>
    </div>
</template>

<script>
    // 组件
    import Loading from 'components/Common/Loading'
    import CompanyName from 'components/Input/FuzzyQuery'
    // 组件
    import SingleImage from 'components/Image/UploadImage/SingleImage'
    // 通用JS
    import Common from 'common/common.js'
    // 验证方法
    import Validate from 'common/validate.js'
    // Api方法
     import Account from 'api/Account.js'
    // 城市联动选择
    import CitySelect from 'mixins/city_select.js'
    // 邮箱自动填充
    import EmailComplete from 'mixins/email_complete.js'
    // Json数据
    import JsonCity from 'mock/city.json'
    import JsonData from 'mock/data.json'
    // Vuex
    import { mapGetters } from 'vuex'

    export default {
        components: { Loading, CompanyName, SingleImage },
        mixins: [ CitySelect, EmailComplete ],
        computed: {
            ...mapGetters(['companyName', 'getImageUrl' ])
        },
        data() {
            return {
                // 加载页面
                pageLoading: false,
                // 页面描述
                pageType: 'add',
                // 表单信息
                infoForm: {
                    // 用户编号
//                    userId: '',
                    // 创建时间
//                    createdAt: '',
                    // 真实姓名
                    userName: '',
                    // 头像
//                    face: require('@/assets/images/default-face.jpg'),
                    // 性别
//                    gender: '',
                    // 手机号
                    mobile: '',
                    // 邮箱
                    email: '',
                    // 密码
                    password: '',
                    // 确认密码
                    passwdCheck: '',
                    type:1
                },
                // 验证规则
                validate: {
                    userName: [{ required: true, message: '真实姓名不能为空', trigger: 'blur'}],
                    mobile: [
//                        { required: true, message: '手机号码不能为空', trigger: 'blur'},
                        { pattern: Common.regMobile, message: '手机号码格式不正确', trigger: 'blur' }
                    ],
                    email: [
//                        { required: true, message: '邮箱不能为空', trigger: 'blur'},
                        { pattern: Common.regEmail, message: '邮箱格式不正确', trigger: 'change' }
                    ],
                    password: [{ required:true ,pattern: Common.regPassword, message: '密码格式为8-16位字母和数字组合', trigger: 'blur' }],
                    passwdCheck: [{
                        validator: (rule, value, callback) => {
                            Validate.ValidPwdCheck(this.infoForm.password, value, callback, false);
                        },
                        trigger: 'blur'
                    }]
                },
                //验证规则-修改
                validateUpdate:{
                    mobile: [
                      { pattern: Common.regMobile, message: '手机号码格式不正确', trigger: 'blur' }
                    ],
                    email: [
                      { pattern: Common.regEmail, message: '邮箱格式不正确', trigger: 'change' }
                    ],
                    passwdCheck: [{
                      validator: (rule, value, callback) => {
                        Validate.ValidPwdCheck(this.infoForm.password, value, callback, false);
                      },
                      trigger: 'blur'
                    }],
                }
            }
        },
        created() {
            // 初始化图片和输入框
//            Common.InitPicStore(this);
            // 判断是否是编辑页
            if(this.$route.query.id){
                // 获取用户编号
                this.userId = this.$route.query.id;
                this.$store.commit('SET_BREADCRUMB', [
                    { name: '首页', path: '/Home' },
                    { name: '账户列表', path: '/AccountManage/List' },
                    { name: '账户详情', path: '' }
                ]);
                // 获取账户详情
                this.getDetail();
                this.pageType = 'edit';
            }
            else{
                this.pageLoading = false;
                this.$store.commit('SET_BREADCRUMB', [
                    { name: '首页', path: '/Home' },
                    { name: '账户列表', path: '/AccountManage/AccountList' },
                    { name: '新增账户', path: '' }
                ]);
            }
        },
        methods: {
            // 提交表单
            submit(form, type) {
//                console.log(this.infoForm)
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        // 页面加载
                         this.pageLoading = true
//                        this.infoForm.face = this.getImageUrl;
                        if(this.pageType == 'add'){
                            // 新增用户
//                            console.log(this.infoForm)
                            this.pageLoading = false
                          if(this.infoForm.email==''&&this.infoForm.mobile==''){
                            this.$Message.error('邮箱和手机必填一个')
                          }else {
                            Account.Add(this.infoForm).then(res => {
                              if (res.code == 200) {
                                this.$Message.success({
                                  content: '新增用户成功!',
                                  onClose: () => {
                                    // 跳转到列表页
                                    this.$router.push({name: 'AccountManage'})
                                  }
                                });
                              } else this.$Message.warning(res.msg)
                            }).catch(err => {
                              console.log(err)
                              this.$Message.error('网络出错，操作失败！')
                            })
                          }
                        }
                        else{
                            // 修改账户信息
                          //邮箱和手机必填一个
                          this.pageLoading = false
                          if(this.infoForm.email==''&&this.infoForm.mobile==''){
                            this.$Message.error('邮箱和手机必填一个')
                          }else{
                            if(!this.infoForm.password) this.infoForm.password = ''
                            Account.Edit(this.infoForm,this.$route.query.id).then(res=>{
//                                console.log(res)
                              if(res.code==200){
                                this.$Message.success({
                                  content: '修改用户成功!',
                                  onClose: () => {
                                    // 跳转到列表页
                                    this.$router.push({ name: 'AccountManage' })
                                  }
                                })
                              }else this.$Message.warning(res.msg)
                            }).catch(err=>{
                              console.log(err)
                              this.$Message.error('网络出错，操作失败！')
                            })
                          }
                        }
                    }
                    else this.$Message.error('提交失败！填写有误');
                })
            },
            // 获取账户详情
            getDetail(){
              this.pageLoading = true
//              console.log(this.$route.query.id)
              Account.GetInfo(this.$route.query.id).then(res=>{
//                  console.log(res)
                this.pageLoading = false
                if(res.code==200){
                  this.infoForm = res.data
                  console.log(this.infoForm.type)
                  console.log(typeof (this.infoForm.type))
                }else this.$Message.error(res.msg)
              }).catch(err=>{
                this.$Message.error('网络出错，请重新刷新')
              })
            }
        }
    }
</script>

<style lang="less" scoped>
    .m-operation {
        button, a {
            min-width: 80px;
            margin-left: 10px;
        }
    }
    .ivu-select.select-province {
        float: left;
        width: 32.5%;
        margin-right: 1%;
        &:nth-child(3n) {
            margin-right: 0;
        }
    }
</style>
