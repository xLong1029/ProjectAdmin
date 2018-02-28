<template>
    <div class="g-content">
        <!-- 按条件查询 -->
        <div class="m-query-form">
            <Form ref="queryForm" :model="queryForm" :rules="queryValid">
                <FormItem class="query-item">
                    <Input v-model="queryForm.id" placeholder="案例编号"></Input>
                </FormItem>
                <FormItem prop="caseName" class="query-item">
                    <Input v-model="queryForm.caseName" placeholder="项目名称"></Input>
                </FormItem>
                <FormItem prop="companyName" class="query-item">
                    <Input v-model="queryForm.companyName" placeholder="公司名称"></Input>
                </FormItem>
                <FormItem class="query-item">
                    <Select v-model="queryForm.caseType" placeholder="立项专项">
                        <Option value="" >全部</Option>
                        <Option v-for="(item, index) in caseTypeList" :value="item.name" :key="index">{{ item.name }}</Option>
                    </Select>
                </FormItem>
                <FormItem class="fl" prop="date">
                    <Date-picker class="query-item" type="date" v-model="queryForm.sTime" placement="bottom-end" placeholder="请选择开始日期" @on-change="getStartDate"></Date-picker>
                    <Date-picker class="query-item" type="date" v-model="queryForm.eTime" placement="bottom-end" placeholder="请选择结束日期" @on-change="getEndDate"></Date-picker>
                    <div class="clearfix"></div>
                </FormItem>
                <FormItem class="query-item">
                    <Select v-model="queryForm.enabledState" placeholder="展示状态">
                        <Option value="">全部</Option>
                        <Option value="1">启用</Option>
                        <Option value="-1">禁用</Option>
                    </Select>
                </FormItem>
                <FormItem class="fl">
                    <Button class="query-button" type="primary" @click="query('queryForm', 'valid')">查询</Button>
                    <Button class="query-button" type="ghost" @click="resetQuery('queryForm')">重置</Button>
                </FormItem>
            </Form>
            <div class="clearfix"></div>
        </div>
        <!-- 操作按钮 -->
        <div class="m-operation">
            <Button class="operation-btn" type="primary" @click="addCase">新增</Button>
            <Button class="operation-btn" :disabled="selectList.length == 0" type="warning" @click="deleteData">删除</Button>
            <Button class="operation-btn" :disabled="selectList.length == 0" type="primary" @click="enableOrDisable(1)">启用</Button>
            <Button class="operation-btn" :disabled="selectList.length == 0" type="warning" @click="enableOrDisable(-1)">禁用</Button>
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
                :total="page.dataCount"
                :page-size="page.pageSize"
                :current="page.pageNo"
                :page-size-opts="page.pageSizeOpts"
                @on-change="changePage"
                @on-page-size-change="changePageSize"
            >
            </Page>
            <div class="clearfix"></div>
        </div>
        <!-- 新增窗口-->
        <Modal v-model="showModal" width="500" @on-cancel="closeModal('paramsForm')">
            <p slot="header">
                <span v-text="paramsForm.caseName == '' ? '新增案例' : '编辑案例'"></span>
            </p>
            <div>
                <Form ref="paramsForm" :model="paramsForm" :rules="paramsValid" :label-width="100">
                    <FormItem label="项目名称：" prop="caseName">
                        <Input v-model="paramsForm.caseName" placeholder="请输入项目名称"></Input>
                    </FormItem>
                    <FormItem label="公司名称：" prop="companyName">
                        <Input v-model="paramsForm.companyName" placeholder="请输入公司名称"></Input>
                    </FormItem>
                    <FormItem label="立项专项：" prop="caseType">
                        <Select v-model="paramsForm.caseType" placeholder="请选择专项立项">
                            <Option value="" >全部</Option>
                            <Option v-for="(item, index) in caseTypeList" :value="item.name" :key="index">{{ item.name }}</Option>
                        </Select>
                    </FormItem>
                </Form>
            </div>
            <div slot="footer">
                <Button size="large" @click="closeModal('paramsForm')">取消</Button>
                <Button type="primary" size="large" @click="operation('paramsForm', operateType)">确定</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    // 组件
    import Loading from '@/components/Common/Loading'
    // 通用JS
    import Common from 'common/common.js'
    // 通用JS
    import Validate from 'common/validate.js'
    // Api方法
    // import Api from '@/api/api.js'
    // Json数据
    import JsonData from 'mock/data.json'
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
        mixins: [  TableQuery, TableOperate, Page ],
        data() {
            return {
                // 加载页面
                pageLoading: false,
                // 立项专项列表
                caseTypeList: [],
                // 查询表单
                queryForm: {
                    // 案例编号
                    id: '',
                    // 项目名称
                    caseName: '',
                    // 公司名称
                    companyName: '',
                    // 立项专项
                    caseType: '',
                    // 起始时间
                    sTime: '',
                    // 结束时间
                    eTime: '',
                    // 状态
                    enabledState: '',
                },
                // 查询验证
                queryValid: {},
                // 参数表单
                paramsForm: {
                    id: '',
                    caseName: '',                    
                    companyName: '',
                    caseType: ''
                },
                // 表单验证
                paramsValid: {
                    caseName:[{ required: true, message: '项目名称不能为空', trigger: 'blur' }],
                    companyName:[{ required: true, message: '公司名称不能为空', trigger: 'blur' }],
                    caseType: [{ required: true, message: '请选择立项专项', trigger: 'change' }],
                },
                // 是否显示弹窗
                showModal: false,
                // 操作类型:1是新增, 2是编辑
                operateType: 0,
                // 用户列表
                userList:[
                    {
                        title: '全选',
                        type: 'selection',
                        key: 'selectAll',
                        width: '60',
                        align: 'center',
                    },
                    {
                        title: '案例编号',
                        key: 'id',
                        align: 'center',
                    },
                    {
                        title: '项目名称',
                        key: 'caseName',
                        align: 'center'
                    },
                    {
                        title: '公司名称',
                        key: 'companyName',
                        align: 'center'
                    },
                    {
                        title: '立项专项',
                        key: 'caseType',
                        align: 'center'
                    },
                    {
                        title: '创建时间',
                        key: 'createTime',
                        align: 'center',
                    },
                    {
                        title: '状态',
                        key: 'enabledState',
                        align: 'center',
                        render: (h, params) => {
                            return h('span', {
								attrs: {
									class: params.row.enabledState == 1 ? 'status-success' : 'status-fail',
								}
							}, params.row.enabledState == 1 ? '启用' : '禁用');
                        }
                    },
                    {
                        title: '操作',
                        width: '120',
                        key: 'operation',
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                tableSetting.popUp(h, params, this, '编辑', 0),
                            ]);                          
                        }
                    }
                ],
                //表格信息
                listData:[
                    {
                        id: 1,
                        caseName: '我是牛逼轰轰的超级案例1',
                        companyName: '华建公司',
                        caseType: '科技专项',
                        createTime: '2018-2-28',
                        enabledState: 1
                    },
                    {
                        id: 2,
                        caseName: '我是牛逼轰轰的超级案例2',
                        companyName: '华建公司',
                        caseType: '文化专项',
                        createTime: '2018-2-28',
                        enabledState: 1
                    },
                    {
                        id: 3,
                        caseName: '我是牛逼轰轰的超级案例3',
                        companyName: '华建公司',
                        caseType: '服务专项',
                        createTime: '2018-2-28',
                        enabledState: 1
                    }
                ],
            }
        },
        created(){
            // 设置面包屑路径
            this.$store.commit('SET_BREADCRUMB', [
                { name: '首页', path: '/Home' },
                { name: '案例列表', path: '/CaseManage/List' }
            ]);
            // 获取用户列表
            this.getTableList();
            // 获取本地“立项专项”列表
            this.caseTypeList = JsonData.caseType;
        },
        methods: {
            // 获取表格列表
            getTableList(query){
                // this.pageLoading = true;
                // 设置是否查询状态
                if(query){
                    this.isQuery = true;
                    this.getFilterList();
                }
                else{
                    this.isQuery = false;
                    this.getAllList();
                }
            },
            // 设置列表数据
            setListData(result){
            },
            // 打开弹窗
            openModel(params){
                this.showModal = true;
                this.paramsForm.caseName = params.caseName;
                this.paramsForm.companyName = params.companyName;
                this.paramsForm.caseType = params.caseType;
                this.paramsForm.id = params.id;
            },
            // 关闭弹窗
            closeModal(name){
                this.showModal = false;
                // 数据初始化（重置）
                this.$refs[name].resetFields();
            },
            // 弹窗操作
            operation(name, type){
                // 表单验证
                this.$refs[name].validate((valid)=>{
                    if(valid){
                        this.paramsForm.type = parseInt(this.paramsForm.type);
                        // 操作
                        if(type == 1) this.addData();
                        else if(type == 2) this.EditData();
                        // 延迟关闭
                        setTimeout(() => {
                            this.closeModal(name);
                        }, 500);
                    }
                    else this.$Message.error('提交失败！填写有误');
                })
            },
            addCase(){
                this.showModal = true;
                this.operateType = 1;
            },
        }
    }
</script>

<style lang="less" scoped>
    @import "../../assets/less/table_list";
    .query-item{
        width: 150px;
    }
</style>