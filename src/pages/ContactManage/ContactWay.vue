<template>
    <div class="g-content">
        <p>联系方式</p>
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
                { name: '联系方式', path: '/ContactManage/ContactWay' }
            ]);
        }
    }
</script>

<style>
</style>
