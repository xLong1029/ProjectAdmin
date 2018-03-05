<template>
    <div class="g-content">
        <!-- 按条件查询 -->
        <div class="m-query-form">
            <Form ref="queryForm" :model="queryForm" :rules="queryValid">
                <FormItem class="query-item" prop="id">
                    <Input v-model="queryForm.id" placeholder="消息编号"></Input>
                </FormItem>
                <FormItem class="query-item" prop="companyName">
                    <Input v-model="queryForm.companyName" placeholder="公司名称"></Input>
                </FormItem>
                <FormItem class="query-item" prop="linkMan">
                    <Input v-model="queryForm.linkMan" placeholder="联系人姓名"></Input>
                </FormItem>
                <FormItem class="query-item" prop="linkManPhone">
                    <Input v-model="queryForm.linkManPhone" placeholder="联系人电话"></Input>
                </FormItem>
                <FormItem class="fl" prop="date">
                    <Date-picker class="query-item" type="date" v-model="queryForm.sTime" placement="bottom-end" placeholder="请选择开始日期" @on-change="getStartDate"></Date-picker>
                    <Date-picker class="query-item" type="date" v-model="queryForm.eTime" placement="bottom-end" placeholder="请选择结束日期" @on-change="getEndDate"></Date-picker>
                    <div class="clearfix"></div>
                </FormItem>
                <FormItem class="query-item" prop="emdnaledState">
                    <Select v-model="queryForm.dealState" placeholder="处理状态">
                        <Option value="">全部</Option>
                        <Option value="1">已处理</Option>
                        <Option value="-1">待处理</Option>
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
            <Button class="operation-btn" :disabled="selectList.length == 0" type="primary" @click="deleteData">删除</Button>
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
        <Modal v-model="showModal" width="500" @on-cancel="closeModal">
            <p slot="header">
                消息详情
            </p>
            <div>
                <table cellspacing="0" cellpadding="0" width="100%" class="m-table-info">
                    <tr>
                        <th>公司名称：</th>
                        <td>{{ paramsForm.companyName }}</td>
                    </tr>
                    <tr>
                        <th>联系人姓名：</th>
                        <td>{{ paramsForm.linkMan }}</td>
                    </tr>
                    <tr>
                        <th>联系人电话：</th>
                        <td>{{ paramsForm.linkManPhone }}</td>
                    </tr>
                    <tr>
                        <th>公司简介：</th>
                        <td>{{ paramsForm.companyInfo }}</td>
                    </tr>
                    <tr>
                        <th>处理状态：</th>
                        <td>
                            <span v-if="paramsForm.dealState == 1" class="status-success">已处理</span>
                            <span v-else class="status-wait">待处理</span>
                        </td>
                    </tr>
                </table>
            </div>
            <div slot="footer">
                <Button size="large" @click="closeModal">取消</Button>
                <Button v-if="paramsForm.dealState == 1" type="primary" size="large" @click="closeModal">确定</Button>
                <Button v-else type="primary" size="large" @click="operation(paramsForm.id)">处理</Button>
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
                    // 消息编号
                    id: '',
                    // 公司名称
                    companyName: '',
                    // 联系人姓名
                    linkMan: '',
                    // 联系人电话
                    linkManPhone: '',
                    // 起始时间
                    sTime: '',
                    // 结束时间
                    eTime: '',
                    // 状态
                    dealState: '',
                },
                // 查询验证
                queryValid: {},
                // 参数表单
                paramsForm: {
                    id: '',                                        
                    companyName: '',
                    linkMan: '',
                    linkManPhone: '',
                    companyInfo: '',
                    dealState: ''
                },
                // 表单验证
                paramsValid: {
                    linkManPhone:[{ pattern: Common.regMobile , message: '手机号码格式不正确', trigger: 'blur' }],
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
                        title: '消息编号',
                        key: 'id',
                        align: 'center',
                    },
                    {
                        title: '公司名称',
                        key: 'companyName',
                        align: 'center'
                    },
                    {
                        title: '联系人姓名',
                        key: 'linkMan',
                        align: 'center'
                    },
                    {
                        title: '联系人电话',
                        key: 'linkManPhone',
                        align: 'center'
                    },
                    {
                        title: '创建时间',
                        key: 'createTime',
                        align: 'center',
                    },
                    {
                        title: '状态',
                        key: 'dealState',
                        align: 'center',
                        render: (h, params) => {
                            return h('span', {
								attrs: {
									class: params.row.dealState == 1 ? 'status-success' : 'status-wait',
								}
							}, params.row.dealState == 1 ? '已处理' : '待处理');
                        }
                    },
                    {
                        title: '操作',
                        width: '120',
                        key: 'operation',
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                tableSetting.popUp(h, params, this, '查看详情', 0),
                            ]);                          
                        }
                    }
                ],
                //表格信息
                listData:[
                    {
                        id: 1,
                        companyName: '六六六有限责任公司',
                        linkMan: '小六子',
                        linkManPhone: '18376686974',
                        createTime: '2018-2-28',
                        dealState: 1
                    },
                    {
                        id: 2,
                        companyName: '六六六有限责任公司',
                        linkMan: '小六子',
                        linkManPhone: '18376686974',
                        createTime: '2018-2-28',
                        dealState: -1
                    },
                    {
                        id: 3,
                        companyName: '六六六有限责任公司',
                        linkMan: '小六子',
                        linkManPhone: '18376686974',
                        createTime: '2018-2-28',
                        dealState: -1
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
                }
                else{
                    this.isQuery = false;
                }
            },
            // 打开弹窗
            openModel(params){
                this.showModal = true;
                this.paramsForm.id = params.id;
                this.paramsForm.companyName = params.companyName;
                this.paramsForm.linkMan = params.linkMan;
                this.paramsForm.linkManPhone = params.linkManPhone;
                this.paramsForm.companyInfo = '这里是六六六的公司简介，简直666到不行了';
                this.paramsForm.dealState = params.dealState;               
            },
            // 关闭弹窗
            closeModal(){
                this.showModal = false;
                this.paramsForm = {};
            },
            // 弹窗操作
            operation(id){
                this.closeModal();
            }
        }
    }
</script>

<style lang="less" scoped>
    @import "../../assets/less/table_list";
    .m-table-info {
        th,td {
            padding: 12px;
            vertical-align: top;
        }
        th {
            width: 110px;
            text-align: right;
        }
    }
</style>