<template>
    <div class="g-content">
        <!--  加载判断 -->
        <Loading v-if="pageLoading"></Loading>
        <div v-else>
            <Form ref="infoForm" :model="infoForm" :rules="validate">
                <Form-item prop="companyDesc">
                    <quill-editor
                        class="instruction-editor"
                        v-model="infoForm.companyDesc"
                        ref="myQuillEditor"
                        :options="editorOption"
                        @ready="onEditorReady($event)"
                    >
                    </quill-editor>
                </Form-item>
                <!-- 操作按钮 -->
                <div class="m-operation">
                    <Button class="fr" type="primary" @click="edit('infoForm')">确认修改</Button>
                    <div class="clearfix"></div>
                </div>
            </Form>
        </div>
    </div>
</template>

<script>
    // 组件
    import Loading from 'components/Common/Loading'
    // Api方法
    // import Api from 'api/api.js'
    // Vue-quill-editor
    import Quill from 'quill'
    // QullEditor图片上传配置
    import { ImageImport } from 'qullEditor/ImageImport.js'
    import { ImageResize } from 'qullEditor/ImageResize.js'
    Quill.register('modules/imageImport', ImageImport)
    Quill.register('modules/imageResize', ImageResize)
    
    export default {
        components: { Loading },
        data() {
            return {
                // 加载页面
                pageLoading: false,
                // 富文本编辑器配置
                editorOption:{
                    placeholder: '内容',
                    modules:{
                        imageImport: true,
                        imageResize: {
                            displaySize: true
                        }
                    }
                },
                infoForm: {
                    companyDesc: ''
                },
                // 验证规则
                validate: {
                    companyDesc: [{ required: true, message: '内容不能为空', trigger: 'blur'}],
                },
            }
        },
        created() {
            // 设置面包屑路径
            this.$store.commit('SET_BREADCRUMB', [
                { name: '首页', path: '/Home' },
                { name: '公司介绍', path: '/ContactManage/CompanyInfo' }
            ]);
            // 获取公司介绍
            this.getDetail();
        },
        methods: {
            // 编辑器初始化
            onEditorReady(editor) {
            },
            // 编辑器内容改变
            onEditorChange({ editor, html, text }) {
                this.content = html
            },
            // 获取公司介绍
            getDetail(){
            },
            // 修改信息
            edit(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                    }
                    else this.$Message.error('提交失败！填写有误');
                })    
            },
        }
    }
</script>

<style lang="less">
    @import "../../assets/less/color";
    .m-product-info{
        background: #f5f5f5;
        border-radius: 4px;
        padding: 20px;
    }

    .m-operation {
        button, a {
            min-width: 80px;
            margin-left: 10px;
        }
    }
    
    .instruction-editor{
        background: #fff;
        .ql-toolbar{
            border-radius: 4px 4px 0 0;
            border: 1px solid @table_border_color;
        }
        .ql-container{
            min-height: 500px;
            border-radius: 0 0 4px 4px;
            border: 1px solid #eee;
            .ql-editor{
                padding-bottom: 20px;
            }
        }
    }
</style>