<template>
    <div id='multipleImage' class="m-Upload">
        <!-- 图片显示 -->
        <div :ref="'upload-img-'+index" v-for="(item, index) in getImageUrlArr" :key="index" class="upload-show">
            <div class="upload-img-wrap"><img class="upload-image" :src="item" @error="notFoundPic"/></div>
            <!-- 可预览遮罩 -->
            <div class="upload-mask">
                <Icon v-if="preview" type="eye" style="margin-right:15px;" @click.native="viewImage(item)"></Icon>
                <Icon type="ios-trash" @click.native="removeImage('upload-img-'+index, index)"></Icon>
            </div>
        </div>
        <!-- 上传按钮 -->
        <Upload
            :show-upload-list="false"
            :on-success="uploadSuccess"
            :before-upload="beforeUpload"
            :on-error="uploadError"
            :format="format"
            :max-size="fileSize"
            :on-format-error="imageFormatError"
            :on-exceeded-size="imagesMaxSize"
            :action="imageUploadUrl">
            <Button type="ghost" :loading="loading" icon="ios-cloud-upload-outline">上传图片</Button>
            <span class="size-hint" v-if="sizeHint">（图片尺寸： {{ sizeHint }}）</span>
        </Upload>
        <!-- 上传进度条  -->
        <template v-if="uploadStatus != 'finished'">
            <Progress v-if="showProgress" :percent="percentage" :stroke-width="3" style="width:340px;"></Progress>
        </template>
        <br/>
        <!-- 图片格式提示 -->
        <span class="hint">
            * 图片格式要求：jpg、jpeg、png，文件大小为
            <span v-if="fileSize < 1024">{{ fileSize }}kb</span>
            <span v-else>{{ Math.floor(fileSize/1024) }}M</span>
            以内。
        </span>
        <div class="clearfix"></div>
        <!-- 查看图片 -->
        <Modal title="查看图片" class="m-view-img" v-model="showModal" width="900">
            <img :src="showImgUrl" @error="notFoundPic"/>
            <div slot="footer"></div>
        </Modal>
    </div>
</template>
<script>
    import Common from '@/common/common.js'
    import { mapGetters } from 'vuex'
    export default {
        name: 'multipleImage',
        // 获取父级传值是否可预览图片preview，上传按钮尺寸提示文本sizeHint，图片文件大小fileSize
        props: {
            // 设置默认值
            preview:{
                type: Boolean,
                default: false
            },
            sizeHint:{
                type: String,
                default: ''
            },
            fileSize:{
              type: Number,
              default: 150
            }
        },
        computed: {
            ...mapGetters([
                // 获取图片显示路径
                'getImageUrlArr',
                // 获取多图片上传的ID
                'getImageIdArr'
            ])
        },
        data () {
            return {
                // 上传加载
                loading: false,
                // 显示查看图片
                showModal: false,
                // 显示图片的地址
                showImgUrl: '',
                // 图片上传请求Url
                imageUploadUrl: '/api/FileStorage/Image/Upload',
                // 图片上传格式
                format: ['jpg', 'jpeg', 'png'],
                // 上传状态，上传成功完成为finished
                uploadStatus: '',
                // 是否显示进度条
                showProgress: false,
                // 上传进度
                percentage: 0
            }
        },
        methods: {
            // 查看图片
            viewImage(url){
                this.showImgUrl = url;
                this.showModal = true;
            },
            // 移除图片
            removeImage(img, index){
                // 移除对应索引位置的图片
                this.getImageUrlArr.splice(index, 1);
                this.getImageIdArr.splice(index, 1);

                // 更新多图片显示路径
                this.$store.commit('SET_IMAGE_URL_ARR', this.getImageUrlArr);
                // 更新图片上传的ID
                this.$store.commit('SET_IMAGE_ID_ARR', this.getImageIdArr);
            },
            imageFormatError(file) {
                // 隐藏进度条
                this.showProgress = false;
                this.$Notice.warning({
                    title: '文件格式不正确',
                    desc: '文件 ' + file.name + ' 格式不正确，请上传 jpg 或 png 格式的图片。'
                });
                this.loading = false;
            },
            // 图片大小超出限制
            imagesMaxSize(file) {
                // 隐藏进度条
                this.showProgress = false;
                let size = this.fileSize + 'kb';
                if(this.fileSize > 1024) size = Math.floor(this.fileSize/1024) + 'M';
                this.$Notice.warning({
                    title: '超出文件大小限制',
                    desc: '文件 ' + file.name + ' 太大，不能超过 ' + size
                });
                this.loading = false;
            },
            // 文件上传前
            beforeUpload(){
                // 判断图片上传个数
                const check = this.getImageIdArr.length < 5;
                if (!check) {
                    this.$Notice.warning({
                        title: '超出文件个数限制',
                        desc: '最多只能上传5张图片'
                    });
                    return check;
                } 
                this.uploadStatus = '';
                this.loading = true;
            },
            // 上传成功
            uploadSuccess(res, file) {
                this.loading = false;
                if (res.code == '200') {
                    // 延迟结束
                    setTimeout(() => {
                        this.uploadStatus = file.status;
                    }, 500);
                    // 显示进度条和百分比
                    this.showProgress = file.showProgress;
                    this.percentage = file.percentage;

                    this.getImageUrlArr.push(res.data.url);
                    this.getImageIdArr.push(res.data.id);
                    // 更新多图片显示路径
                    this.$store.commit('SET_IMAGE_URL_ARR', this.getImageUrlArr);
                    // 更新图片上传的ID
                    this.$store.commit('SET_IMAGE_ID_ARR', this.getImageIdArr);

                    this.$Notice.success({ title: '图片上传成功!' });
                }
                else this.$Notice.error({ title: '图片上传失败，服务器出错！' });
            },
            // 上传失败
            uploadError(res, file) {
                this.loading = false;
                // 隐藏进度条
                this.showProgress = false;
                this.$Notice.error({ title: '图片上传失败，请重试！' });
            },
            // 无法显示图片
            notFoundPic(event){
                Common.SetDefaultPic(event, 2);
            }
        }
    }
</script>
<style lang="less" scoped>
    @import "../../../assets/less/upload_img";
</style>
