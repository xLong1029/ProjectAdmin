<template>
    <div class="g-content">
        <!-- 按条件查询 -->
        <div class="m-query-form">
            <Form ref="queryForm" :model="queryForm" :rules="queryValid">
                <FormItem class="query-item">
                    <Input v-model="queryForm.id" placeholder="广播编号"></Input>
                </FormItem>
                <FormItem prop="msgContent" class="query-item">
                    <Input v-model="queryForm.msgContent" placeholder="广播内容"></Input>
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
                <span v-text="paramsForm.msgContent == '' ? '新增案例' : '编辑案例'"></span>
            </p>
            <div>
                <Form ref="paramsForm" :model="paramsForm" :rules="paramsValid" :label-width="100">
                    <FormItem label="广播内容：" prop="msgContent">
                        <Input v-model="paramsForm.msgContent" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入广播内容"></Input>
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
                    // 广播编号
                    id: '',
                    // 广播内容
                    msgContent: '',
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
                    msgContent: '',                    
                    companyName: '',
                    caseType: ''
                },
                // 表单验证
                paramsValid: {
                    msgContent:[
                        { required: true, message: '广播内容不能为空', trigger: 'blur' },
                        { type: 'string', max: 30, message: '内容不可以超过30个字', trigger: 'blur' }
                    ],
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
                        title: '广播编号',
                        key: 'id',
                        align: 'center',
                    },
                    {
                        title: '广播内容',
                        key: 'msgContent',
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
                        msgContent: '恭喜SOLO公司成功申请了牛逼轰轰的项目！！',
                        createTime: '2018-2-28',
                        enabledState: 1
                    },
                    {
                        id: 2,
                        msgContent: '恭喜xLong成功申请了牛逼轰轰的项目！！',
                        createTime: '2018-2-28',
                        enabledState: 1
                    },
                    {
                        id: 3,
                        msgContent: '恭喜Lio.Huang成功申请了牛逼轰轰的项目！！',
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
                { name: '消息列表', path: '/Broadcast/List' }
            ]);
            // 获取用户列表
            this.getTableList();
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
                this.paramsForm.msgContent = params.msgContent;
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