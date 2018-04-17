<template>
    <div id="singleImage" class="m-Upload">
        <!-- 图片显示 -->
        <div v-if="getImageUrl != ''" class="upload-show">
            <div class="upload-img-wrap"><img class="upload-image" :src="getImageUrl" @error="notFoundPic"/></div>
            <!-- 可预览遮罩 -->
            <div v-if="preview" class="upload-mask">
                <Icon type="eye" @click.native="viewImage"></Icon>
            </div>
        </div>
        <!-- 上传按钮 -->
        <Upload
            :show-upload-list="false"
            :before-upload="beforeUpload"
            :on-success="uploadSuccess"
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
        <Modal title="查看图片" class="m-view-img" v-model="showModal" class-name="vertical-center-modal" width="900">
            <img :src="getImageUrl" @error="notFoundPic"/>
            <div slot="footer"></div>
        </Modal>
    </div>
</template>
<script>
    import Common from '@/common/common.js'
    import { mapGetters } from 'vuex'
    export default {
        name: 'singleImage',
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
                'getImageUrl',
            ])
        },
        data () {
            return {
                // 上传加载
                loading: false,
                // 显示查看图片
                showModal: false,
                // 是否显示图片
                visible: true,
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
            viewImage(){
                this.showModal = true;
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

                    // 更新图片上传ID
                    this.$store.commit('SET_IMAGE_ID', res.data.id);
                    // 更新图片上传图像显示路径
                    this.$store.commit('SET_IMAGE_URL', res.data.url);
                    this.$Notice.success({ title: '图片上传成功!' });

                    this.visible = true;
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
