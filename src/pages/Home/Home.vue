<template>
    <div class="g-content">
        <p>欢迎登录华建信息项目申报系统后台</p>
    </div>
</template>

<script>
    export default {
        data(){
            return{}
        },
        created(){
            // 设置面包屑路径
            this.$store.commit('SET_BREADCRUMB', [{ name: '首页', path: '/Home' }]);
        }
    }
</script>

<style>
</style>
