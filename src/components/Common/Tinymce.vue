<template>
  <div class="myTinymce">
    <textarea :id="id"></textarea>
    <Modal title="上传进度" v-model="modalProgress" :closable="false" :mask-closable="false" class="tinymce__modalProgress" style="z-index:7000;">
      <Upload ref="upload" action="/api/FileStorage/Image/Upload"
              :before-upload="handleBefore"
              :on-success="handleSuccess"
              :on-error="handleError"
              :on-format-error="handleFormatError"
              :format="['jpg','jpeg','png']"
      >
        <div ref="uploadBtn"></div>
      </Upload>
      <div slot="footer">
        <Button size="large"  @click="delUploadList">取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
  import 'tinymce/tinymce'
//  import '../../assets/js/tinymce-langs/zh_CN'
  import '../../common/tinymce-langs/zh_CN'
  import 'tinymce/themes/modern/theme'
  //import 'tinymce/skins/lightgray/skin.min.css'
  //import 'tinymce/skins/lightgray/content.min.css'
  import 'tinymce/plugins/advlist/plugin.js'
  import 'tinymce/plugins/autolink/plugin.js'
  import 'tinymce/plugins/lists/plugin.js'
  import 'tinymce/plugins/link/plugin.js'
  import 'tinymce/plugins/image/plugin.js'
  import 'tinymce/plugins/charmap/plugin.js'
  import 'tinymce/plugins/print/plugin.js'
  import 'tinymce/plugins/preview/plugin.js'
  import 'tinymce/plugins/anchor/plugin.js'
  import 'tinymce/plugins/searchreplace/plugin.js'
  import 'tinymce/plugins/visualblocks/plugin.js'
  import 'tinymce/plugins/code/plugin.js'
  import 'tinymce/plugins/fullscreen/plugin.js'
  import 'tinymce/plugins/insertdatetime/plugin.js'
  import 'tinymce/plugins/table/plugin.js'
  import 'tinymce/plugins/contextmenu/plugin.js'
  import 'tinymce/plugins/paste/plugin.js'
  import 'tinymce/plugins/textcolor/plugin.js'



  export default {
    data () {
      return {
        modalProgress:false,
        id:'tinymce__'+Date.now(),
        imgUrlId:''
      }
    },
    props:['value','width','height','menubar','toolbar'],
    methods:{
      //图片上传前
      handleBefore(file){
        this.modalProgress=true;
      },
      //结束时的处理
      handleOver(){
        this.modalProgress=false;
        this.$refs.upload.clearFiles();
      },
      //图片上传成功
      handleSuccess (res, file) {
        if(res.code==200){
          let inputImgUrl=document.getElementById(this.imgUrlId);
          inputImgUrl.value= res.data.url;
          //触发change事件
          if (document.createEventObject){
            // IE浏览器支持fireEvent方法
            let evt = document.createEventObject();
            inputImgUrl.fireEvent('onchange',evt)
          }
          else{
            // 其他标准浏览器使用dispatchEvent方法
            let evt = document.createEvent( 'HTMLEvents' );
            evt.initEvent('change', true, true);
            inputImgUrl.dispatchEvent(evt);
          }
        }
        else{
          this.$Message.error(res.msg);
        }
        this.handleOver();
      },
      //错误
      handleError(error, file){
        this.$Message.error('网络错误');
        this.handleOver();
      },
      handleFormatError (file) {
        this.$Notice.error({
          title: '文件格式不正确',
          desc: '文件' + file.name + '格式不正确，请上传 jpg 或 png 格式的图片。'
        });
        this.handleOver();
      },
      //进度条取消
      delUploadList(){
        this.handleOver();
      }
    },
    watch:{
      value(val){
        // 当传入值变化时更新富文本内容
        tinymce.get(this.id).setContent(val);
      }
    },
    mounted(){
      tinymce.init({
        selector:`#${this.id}`,
        height: this.height || 300,
        width: this.width || '100%',
        content_css:'static/css/tinymce-content.css',
        valid_children : "+body[style]",
        skin_url: 'https://cdn.bootcss.com/tinymce/4.5.8/skins/lightgray/',
        menubar: this.menubar===undefined  ? true : this.menubar,
        plugins: [
//          'advlist autolink lists link image charmap print preview anchor',
          'advlist autolink lists link charmap print preview anchor',
          'searchreplace visualblocks code fullscreen',
          'insertdatetime table contextmenu paste code textcolor'
        ],
        toolbar: this.toolbar || 'code | preview fullscreen | insertfile undo redo | styleselect | fontsizeselect | bold italic | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image ',
        /*setup: function (editor) {
         editor.addButton('mybutton', {
         text: '上传图片',
         icon: false,
         onclick: function () {
         alert('hi');
         }
         });
         },*/
        file_browser_callback: (field_name, url, type, win)=> {
          if(type=='file') {
            alert('链接未开放上传功能');
          }
          if(type=='image') {
            this.$refs.uploadBtn.click();
            this.imgUrlId=field_name;
          }
        },
        //TinyMCE 会将所有的 font 元素转换成 span 元素        
        convert_fonts_to_spans: true,
        //换行符会被转换成 br 元素        
        convert_newlines_to_brs: false,
        //在换行处 TinyMCE 会用 BR 元素而不是插入段落        
        force_br_newlines: false,
        //当返回或进入 Mozilla/Firefox 时，这个选项可以打开/关闭段落的建立
        //force_p_newlines: false,       
        //这个选项控制是否将换行符从输出的 HTML 中去除。选项默认打开，因为许多服务端系统将换行转换成，因为文本是在无格式的 textarea 中输入的。使用这个选项可以让所有内容在同一行。
        //remove_linebreaks: false,        
        //不能把这个设置去掉，不然图片路径会出错        
        relative_urls: false,
        //允许拖动大小        
        resize: true,
        //font_formats: "微软雅黑=微软雅黑;宋体=宋体;黑体=黑体;仿宋=仿宋;楷体=楷体;隶书=隶书;幼圆=幼圆;Arial=arial,helvetica,sans-serif;Comic Sans MS=comic sans ms,sans-serif;Courier New=courier new,courier;Tahoma=tahoma,arial,helvetica,sans-serif;Times New Roman=times new roman,times;Verdana=verdana,geneva;Webdings=webdings;Wingdings=wingdings,zapf dingbats",
        fontsize_formats: "8px 10px 12px 14px 18px 24px 36px",
        setup: (editor)=> {
          // 初次化编辑器
          editor.on('init', ()=>{
            // 设置默认值
            editor.setContent(this.value || '');
            // 注册事件
            editor.on('blur undo redo', ()=>{
              // 获得编辑结果
              //this.setCon=editor.getContent();
              this.$emit('input',editor.getContent());
            });
            editor.on('blur', ()=>{
              this.$emit('blur');
            });
          });
        }
      });
    },
    beforeDestroy(){
      tinymce.remove(this.id);
    }
  }
</script>
<style lang="less">
  .myTinymce>div{
    box-sizing: border-box;
  }
  .mce-window{
    z-index: 1001!important;
  }
  #mce-modal-block{
    z-index: 1000!important;
  }
  .tinymce__modalProgress{
    .ivu-modal-mask,.ivu-modal-wrap{
      z-index: 1010;
    }
  }
  .mce-fullscreen{
    .header,.side-bar{
      visibility: hidden;
    }
  }
  .ivu-form-item-error .mce-tinymce{
    border-color:#ed3f14;
  }
  .mce-branding{
    display: none!important;
  }
</style>
