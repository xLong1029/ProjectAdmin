<template>
    <div>
        <div>
          lalalla
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
        data(){
            return{

            }
        },
        created(){
            // 设置面包屑路径
            this.$store.commit('SET_BREADCRUMB', [
                { name: '首页', path: '/Home' },
                { name: '文章列表', path: '/ArticleManage/ArticleList' }
            ]);
            console.log(this.$store.getters.breadcrumb)
        },
    }
</script>
<style>

</style>
