<template>
    <div class="g-content">
        <p>公司简介</p>
    </div>
</template>

<script>
    export default {
        data(){
            return{}
        },
        created(){
            // 设置面包屑路径
            this.$store.commit('SET_BREADCRUMB', [
                { name: '首页', path: '/Home' },
                { name: '公司简介', path: '/ContactManage/CompanyInfo' }
            ]);
        }
    }
</script>

<style>
</style>
