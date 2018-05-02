<template>
    <div class="g-content">
        <Loading v-if="pageLoading"></Loading>
        <Form v-else ref="infoForm" :model="infoForm" :rules="validate" label-position="right" :label-width="150">
            <div class="m-content">
                <Row>
                    <Col span="12">
                        <Form-item label="文章标题：" prop="title">
                            <Input v-model="infoForm.title" placeholder="请输入标题"></Input>
                        </Form-item>
                        <Form-item label="来源网站：">
                            <span>{{infoForm.webSite}}</span>
                        </Form-item>
                        <Form-item label="爬取日期：">
                            <span>{{infoForm.createTime}}</span>
                        </Form-item>
                    </Col>
                    <Col span="12">
                        <Form-item label="文章关键字：" prop="keyWord">
                            <Input v-model="infoForm.title" placeholder="请输入关键字，多个关键字请用','隔开"></Input>
                        </Form-item>
                        <Form-item label="文章地址源：">
                            <span>{{infoForm.url}}</span>
                        </Form-item>
                        <Form-item prop="publishDate" class="fl" label="发布日期：">
                            <Date-picker class="query-item" type="date" v-model="infoForm.publishDate" placement="bottom-end" placeholder="请选择发布日期" @on-change="getDate"></Date-picker>
                            <div class="clearfix"></div>
                        </Form-item>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Form-item label="内容：" prop="content">
                            <tinymce v-model="infoForm.htmlContext" height="500"></tinymce>
                        </Form-item>
                    </Col>
                </Row>
            </div>
            <!-- 操作按钮 -->
            <div class="m-operation">
                <Button class="fr" type="primary" @click="submit('infoForm', 'edit')">确认修改</Button>
                <Button class="fr" type="ghost" @click="$router.go(-1)">返回</Button>
                <div class="clearfix"></div>
            </div>
        </Form>
    </div>
</template>
<script>
    // 组件
    import Loading from 'components/Common/Loading'
    // 通用JS
    import Common from 'common/common.js'
    // 通用JS
    import Validate from 'common/validate.js'
    // 表格查询
    import TableQuery from 'mixins/table_query.js'
    //导入富文本组件
    import Tinymce from "@/components/Common/Tinymce.vue"
    export default {
        components: { Loading , Tinymce },
        mixins: [ TableQuery ],
        data() {
            return {
                // 加载页面
                pageLoading: false,
                //表单信息
                infoForm:{
                    //文章id
                    id:'1',
                    //文章标题
                    title:'酸梅汤啊酸梅汤',
                    //文章关键字
                    keyWord:'酸',
                    //爬取日期
                    createTime:'2018-2-25',
                    //文章发布日期
                    publishDate:'2018-2-27',
                    //文章地址源
                    url:'www.smt.com',
                    //文章来源网站
                    webSite:'中国酸梅汤网',
                    //文章内容
                    htmlContext:'酸梅汤好酸啊啊啊啊啊'
                },
                validate:{}
            }
        },
        created(){
            this.$store.commit('SET_BREADCRUMB', [
                { name: '首页', path: '/Home' },
                { name: '文章列表', path: '/ArticleManage/List' },
                { name: '文章详情', path: '' }
            ]);
        },
        methods:{
            // 提交表单
            submit(form, type) {
                this.$refs[form].validate((valid) => {
                    if (valid) {
                      // 页面加载
                      // this.pageLoading = true;

                    }
                    else this.$Message.error('提交失败！填写有误');
                })
            },
        }
    }
</script>
<style lang="less" scoped>
    .g-content{
        padding: 15px 60px 15px 0;
    }
    .m-operation {
        button, a {
          min-width: 80px;
          margin-left: 10px;
        }
    }
</style>
