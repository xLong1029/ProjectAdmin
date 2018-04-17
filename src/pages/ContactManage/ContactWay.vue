<template>
    <div class="g-content">
        <!--  加载判断 -->
        <Loading v-if="pageLoading"></Loading>
        <Form v-else ref="infoForm" :model="infoForm" :rules="validate" :label-width="120">
            <Row>
                <Col span="12">
                    <!-- <Form-item label="公司地址：" prop="companyAddr">
                        <Input v-model="infoForm.companyAddr" placeholder="请输入公司地址"></Input>
                    </Form-item> -->
                    <Form-item label="联系人：" prop="contactMan">
                        <Input v-model="infoForm.contactMan" placeholder="请输入联系人姓名"></Input>
                    </Form-item>
                    <Form-item label="联系人电话：" prop="contactPhone">
                        <Input v-model="infoForm.contactPhone" placeholder="请输入联系电话"></Input>
                    </Form-item>
                    <Form-item label="联系人邮箱：" prop="contactEmail">
                        <Input v-model="infoForm.contactPhone" placeholder="请输入联系邮箱"></Input>
                    </Form-item>
                    <Form-item>
                        <Button class="fl" type="primary" @click="submit('infoForm', 'edit')">确认提交</Button>
                    </Form-item>              
                </Col>
            </Row>
        </Form>
    </div>
</template>

<script>
    export default {
        data(){
            return{
                // 加载页面
                pageLoading: false,
                // 表单信息
                infoForm: {
                    // 公司地址
                    // companyAddr: '',
                    // 联系人
                    contactMan: '',            
                    // 联系人电话
                    contactPhone: '',
                    // 联系人邮箱
                    contactEmail: ''
                },
                // 验证规则
                validate: {
                    // companyAddr: [{ required: true, message: '公司地址不能为空', trigger: 'blur'}],
                    contactMan: [{ required: true, message: '联系人不能为空', trigger: 'blur'}],
                    contactPhone: [{ required: true, message: '电话不能为空', trigger: 'blur'}],
                    contactEmail: [{ required: true, message: '邮箱不能为空', trigger: 'blur'}]
                }
            }
        },
        created(){
            // 设置面包屑路径
            this.$store.commit('SET_BREADCRUMB', [
                { name: '首页', path: '/Home' },
                { name: '联系方式', path: '/ContactManage/ContactWay' }
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
            // 获取联系方式
            getDetail(){
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
</style>
