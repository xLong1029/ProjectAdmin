<template>
    <div class="g-content">
        <!-- 按条件查询 -->
        <div class="m-query-form">
            <Form ref="queryForm" :model="queryForm" :rules="validate">
                <Form-item class="query-item">
                    <Input v-model="queryForm.id" placeholder="案例编号"></Input>
                </Form-item>
                <Form-item prop="caseName" class="query-item">
                    <Input v-model="queryForm.caseName" placeholder="项目名称"></Input>
                </Form-item>
                <Form-item prop="companyName" class="query-item">
                    <Input v-model="queryForm.companyName" placeholder="公司名称"></Input>
                </Form-item>
                <Form-item class="query-item">
                    <Select v-model="queryForm.job" placeholder="立项专项">
                        <Option value="" >全部</Option>
                        <Option v-for="(item, index) in caseTypeList" :value="item.name" :key="index">{{ item.name }}</Option>
                    </Select>
                </Form-item>
                <Form-item class="fl" prop="date">
                    <Date-picker class="query-item" type="date" v-model="queryForm.sTime" placement="bottom-end" placeholder="请选择开始日期" @on-change="getStartDate"></Date-picker>
                    <Date-picker class="query-item" type="date" v-model="queryForm.eTime" placement="bottom-end" placeholder="请选择结束日期" @on-change="getEndDate"></Date-picker>
                    <div class="clearfix"></div>
                </Form-item>
                <Form-item class="query-item">
                    <Select v-model="queryForm.enabledState" placeholder="展示状态">
                        <Option value="">全部</Option>
                        <Option value="1">启用</Option>
                        <Option value="-1">禁用</Option>
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
            <Button class="operation-btn" type="primary" >新增</Button>
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
                // 验证规则
                validate: {},
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
                                // tableSetting.gotoDetail(h, params, this, '查看详情', 'StoreCase'),
                            ]);                          
                        }
                    }
                ],
                //表格信息
                listData:[],
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
                if(result.length > 0){
                    this.listData = result.map(item => {
                        return {
                            id: item.id,
                            realname: item.attributes.realname,
                            gender: item.attributes.gender,
                            caseName: item.attributes.caseName,
                            email: item.attributes.email,
                            job: item.attributes.job,
                            province: item.attributes.province,
                            createTime: item.createdAt,
                            enabledState: item.attributes.enabledState,
                        }
                    });
                }
                else this.listData = [];
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