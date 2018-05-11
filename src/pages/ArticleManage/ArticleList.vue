<template>
    <div class="g-content">
        <!-- 按条件查询 -->
        <div class="m-query-form">
            <Form ref="queryForm" :model="queryForm" :rules="validate">
                <Form-item class="query-item" prop="id">
                    <Input v-model="queryForm.id" placeholder="文章编号"></Input>
                </Form-item>
                <Form-item class="query-item" prop="title">
                    <Input v-model="queryForm.title" placeholder="文章标题"></Input>
                </Form-item>
                <Form-item class="query-item" prop="webSite">
                    <Input v-model="queryForm.webSite" placeholder="文章来源网站"></Input>
                </Form-item>
                <Form-item class="fl" prop="date">
                    <Date-picker class="query-item" type="date" v-model="queryForm.sTime" placement="bottom-end" placeholder="请选择开始日期" @on-change="getStartDate"></Date-picker>
                    <Date-picker class="query-item" type="date" v-model="queryForm.eTime" placement="bottom-end" placeholder="请选择结束日期" @on-change="getEndDate"></Date-picker>
                    <div class="clearfix"></div>
                </Form-item>
                <Form-item class="query-item" prop="enabled">
                    <Select v-model="queryForm.state" placeholder="是否启用">
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
    // 组件
    import Loading from '@/components/Common/Loading'
    // 通用JS
    import Common from 'common/common.js'
    // 通用JS
    import Validate from 'common/validate.js'
    // Api方法
     import Article from '@/api/Article.js'
    // 表格设置
    import tableSetting from 'common/table_setting.js'
    // 表格查询
    import TableQuery from 'mixins/table_query.js'
    // 表格操作
    import TableOperate from 'mixins/table_operate.js'
    // 页码设置
    import Page from 'mixins/page.js'
    export default{
        components:{ Loading },
        mixins: [ TableQuery, TableOperate, Page ],
        computed: {
            //禁用操作接口
            apiDisable(){
              return()=>Article.Disable('Information',this.selectList)
            },
            // 启用操作接口
            apiEnable(){
              return () => Article.Enabled('Information',this.selectList);
            },
            // 删除操作接口
            apiDelete(){
              return () => Article.Delete('Information',this.selectList);
            },
        },
        data(){
            return{
                // 加载页面
                pageLoading: false,
                //表单查询信息
                queryForm:{
                    //文章id
                    id:'',
                    //文章标题
                    title:'',
                    // 起始时间
                    sTime: '',
                    // 结束时间
                    eTime: '',
                    //状态
                    state:'',
                    //文章来源网站
                    webSite:''
                },
                //验证规则
                validate:{
//                    webSite:[{pattern: Common.regWebsite , message:'网站格式不正确',trigger: 'blur'}],
                    date:[{
                      validator: (rule, value, callback) => {
                        Validate.ValidRangeDate(this.queryForm.sTime, this.queryForm.eTime, callback, false);
                      },
                        trigger: 'change',
                    }]
                },
                //文章列表
                userList:[
                    {
                      title:'全选',
                      type: 'selection',
                      width: 60,
                      align: 'center'
                    },
                    {
                        title:'文章编号',
                        key:'id',
                        width:120,
                        align:'center'
                    },
                    {
                        title:'标题',
                        key:'title',
                        align:'center'
                    },
                    {
                        title:'关键字',
                        key:'keyWord',
                        align:'center'
                    },
                    {
                        title:'发布时间',
                        key:'publishDate',
                        width:160,
                        align:'center'
                    },
                    {
                        title:'网站来源',
                        key:'webSite',
                        width:200,
                        align:'center'
                    },
                    {
                        title:'状态',
                        key:'enabled',
                        align:'center',
                        width:80,
                        render:(h,params)=>{
                            return h('span',{
                                attrs:{
                                    class:params.row.enabled == 1?'status-success' : 'status-fail'
                                }
                            },params.row.enabled == 1 ? '启用' : '禁用')
                        }
                    },
                    {
                        title:'操作',
                        key: 'operation',
                        align:'center',
                        width:160,
                        render:(h,params)=>{
                            return h('div',[
                                tableSetting.gotoDetail(h, params, this, '查看详情', 'ArticleDetail'),
                            ])
                        }
                    }
                ],
                //表格信息
                listData:[
//                    {
//                        id:'1',
//                        title:'酸梅汤酸梅汤',
//                        keyWord:'酸梅汤',
//                        publishDate:'酸',
//                        enabled:'1',
//                        webSite:'www.smt.com'
//                    }
                ]
            }
        },
        created(){
            // 设置面包屑路径
            this.$store.commit('SET_BREADCRUMB', [
                { name: '首页', path: '/Home' },
                { name: '文章列表', path: '/ArticleManage/List' }
            ]);
            this.getTableList()
        },
        methods:{
            //获取表格列表
            getTableList(query){
                 this.pageLoading = true;
//                console.log(this.page.page)
//                console.log(this.page.size)
//                console.log(this.queryForm)
                Article.List(this.queryForm,this.page.page,this.page.size).then(res=>{
//                    console.log(res)
                  this.pageLoading = false
                  if(res.code==200){
                    this.listData = res.data
                    //分页设置
                    this.page = res.paging
                    // 设置是否查询状态
                    if(query){
                      this.isQuery = true;
                    }
                    else{
                      this.isQuery = false;
                    }
                  }else this.$Message.warning(res.msg)
                }).catch(err=>{
                  console.log(err)
                })
            },
            // 设置列表数据
            setListData(result){

            },
        }
    }
</script>
<style lang="less" scoped>
  @import "../../assets/less/table_list";
  .m-query-form{
      /*overflow: hidden;*/
  }
</style>
