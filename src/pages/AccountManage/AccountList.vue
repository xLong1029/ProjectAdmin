<template>
    <div class="g-content">
        <!-- 按条件查询 -->
        <div class="m-query-form">
            <Form ref="queryForm" :model="queryForm" :rules="validate">
                <Form-item class="query-item" prop="id">
                    <Input v-model="queryForm.id" placeholder="用户编号"></Input>
                </Form-item>
                <Form-item class="query-item" prop="mobile">
                    <Input v-model="queryForm.mobile" placeholder="手机号码"></Input>
                </Form-item>
                <Form-item class="query-item" prop="email">
                    <AutoComplete v-model="queryForm.email" :data="emailList" @on-search="selectEmail" @on-select="setEmail" placeholder="邮箱"></AutoComplete>
                </Form-item>
                <Form-item class="fl" prop="date">
                    <Date-picker class="query-item" type="date" v-model="queryForm.sTime" placement="bottom-end" placeholder="请选择开始日期" @on-change="getStartDate"></Date-picker>
                    <Date-picker class="query-item" type="date" v-model="queryForm.eTime" placement="bottom-end" placeholder="请选择结束日期" @on-change="getEndDate"></Date-picker>
                    <div class="clearfix"></div>
                </Form-item>
                <Form-item class="query-item">
                    <Select v-model="queryForm.state" placeholder="用户状态">
                        <Option value="">全部</Option>
                        <Option value="1">启用</Option>
                        <Option value="0">禁用</Option>
                    </Select>
                </Form-item>
                <Form-item class="fl">
                    <Button class="query-button" type="primary" @click="query('queryForm', 'valid')">查询</Button>
                    <Button class="query-button" type="ghost" @click="resetQuery('queryForm')">重置</Button>
                </Form-item>
            </Form>
            <div class="clearfix"></div>
        </div>
        <!-- 操作按钮 -->
        <div class="m-operation">
            <router-link :to="{ name: 'StoreAccount' }" class="operation-btn ivu-btn ivu-btn-primary">新增</router-link>
            <Button class="operation-btn" :disabled="selectList.length == 0" type="primary" @click="deleteData">删除</Button>
            <Button class="operation-btn" :disabled="selectList.length == 0" type="primary" @click="enableOrDisable(1)">启用</Button>
            <Button class="operation-btn" :disabled="selectList.length == 0" type="primary" @click="enableOrDisable(-1)">禁用</Button>
            <div class="clearfix"></div>
        </div>
        <!--  加载判断 -->
        <Loading v-if="pageLoading"></Loading>
        <div v-else>
            <!-- 用户列表 -->
            <Table
                :row-class-name="rowClassName"
                class="m-table-list"
                border
                :columns="userList"
                :data="listData"
                @on-selection-change="setSelectList"
            ></Table>
            <!-- 分页 -->
            <Page
                class-name="m-page"
                show-elevator
                show-sizer
                show-total
                :total="page.totalSize"
                :page-size="page.size"
                :current="page.page"
                :page-size-opts="page.pageSizeOpts"
                @on-change="changePage"
                @on-page-size-change="changePageSize"
            >
            </Page>
            <div class="clearfix"></div>
        </div>
    </div>
</template>

<script>
  import { SetCookie, SetLocalS, GetLocalS, Encrypt, Decrypt } from 'common/important.js'
    // 组件
    import Loading from '@/components/Common/Loading'
    // 通用JS
    import Common from 'common/common.js'
    // 通用JS
    import Validate from 'common/validate.js'
    // Api方法
     import Account from '@/api/Account.js'
    // 邮箱自动填充
    import EmailComplete from 'mixins/email_complete.js'
    // 表格设置
    import tableSetting from 'common/table_setting.js'
    // 表格查询
    import TableQuery from 'mixins/table_query.js'
    // 表格操作
    import TableOperate from 'mixins/table_operate.js'
    // 页码设置
    import Page from 'mixins/page.js'

    export default {
        components: { Loading },
        mixins: [ EmailComplete, TableQuery, TableOperate, Page ],
        computed: {
          //禁用操作接口
          apiDisable(){
            return()=>Account.Disable(this.selectList)
          },
          // 启用操作接口
          apiEnable(){
            return () => Account.Enabled(this.selectList);
          },
        },
        data() {
            return {
                // 加载页面
                pageLoading: false,
                // 职位列表
                jobList: [],
                // 地区列表
                provinceList: [],
                // 查询表单
                queryForm: {
                    // 用户编号
                    id: '',
                    // 手机号码
                    mobile: '',
                    // 邮箱
                    email: '',
                    // 起始时间
                    sTime: '',
                    // 结束时间
                    eTime: '',
                    // 状态
                    state: '',
                },
                // 验证规则
                validate: {
                    email:[{ pattern: Common.regEmail , message: '邮箱格式不正确' }],
                    mobile:[{ pattern: Common.regMobile , message: '手机号码格式不正确', trigger: 'blur' }],
                    date:[{
                        validator: (rule, value, callback) => {
                            Validate.ValidRangeDate(this.queryForm.sTime, this.queryForm.eTime, callback, false);
                        },
                        trigger: 'change',
                    }]
                },
                // 用户列表
                userList: [
                    {
                        title:'全选',
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '用户编号',
                        key: 'id',
                        align: 'center'
                    },
                    {
                        title: '用户名称',
                        key: 'userName',
                        align: 'center'
                    },
                    {
                        title: '手机号码',
                        key: 'mobile',
                        align: 'center'
                    },
                    {
                        title:'邮箱',
                        key:'email',
                        align:'center'
                    },
                    {
                        title: '创建时间',
                        key: 'createTime',
                        align: 'center',
                    },
                    {
                        title: '用户类型',
                        key: 'userType',
                        align: 'center',
                    },
                    {
                        title:'状态',
                        key:'enabledState',
                        align:'center',
                        render:(h,params)=>{
                            return h('span',{
                                attrs:{
                                    class: params.row.enabledState == 1 ? 'status-success' : 'status-fail',
                                }
                            },params.row.enabledState == 1 ? '启用' : '禁用')
                        }
                    },
                    {
                        title: '操作',
                        key: 'operation',
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                tableSetting.gotoDetail(h, params, this, '查看详情', 'StoreAccount'),
                            ]);
                        }
                    }
                ],
                //表格信息
                listData:[
//                    {
//                        id: 1,
//                        realname: 'xLong',
//                        gender: '女',
//                        mobile: '18376686974',
//                        email: 'by_xlong@yeah.net',
//                        createTime: '2018-2-28',
//                        enabledState: 1
//                    },
                ],
            }
        },
        created(){
            // 设置面包屑路径
            this.$store.commit('SET_BREADCRUMB', [
                { name: '首页', path: '/Home' },
                { name: '账户列表', path: '/AccountManage/List' }
            ]);
            // 获取用户列表
            this.getTableList();
        },
        methods: {
            // 获取表格列表
            getTableList(query){
                 this.pageLoading = true
//                console.log(this.page.page)
//                console.log(this.page.size)
//                console.log(this.queryForm)
                Account.List(this.queryForm,this.page.page,this.page.size).then(res=>{
//                    console.log(res)
                  this.pageLoading = false
                  if(res.code==200){
                    // 设置是否查询状态
                    if(query) this.isQuery = true
                    else this.isQuery = false
                    //分页设置
                    this.page = res.paging
                    this.listData = res.data
                  }else this.$Message.warning(res.msg)
                }).catch(err=>{
                  console.log(err)
                })
            },
            // 设置列表数据
            setListData(result){

            },
            handleSubmit (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.$Message.success('Success!');
                    } else {
                        this.$Message.error('Fail!');
                    }
                })
            },
            handleReset (name) {
                this.$refs[name].resetFields();
            }
        }
    }
</script>

<style lang="less" scoped>
    @import "../../assets/less/table_list";
</style>
