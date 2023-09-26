<template>
  <div class="tinymce-editor">
    <editor
      v-model="myValue"
      :init="init"
      :disabled="disabled"
      @onClick="onClick">
    </editor>
  </div>
</template>

<script>
  import { postAction } from '@/api/manage'
  import tinymce from 'tinymce/tinymce'
  import Editor from '@tinymce/tinymce-vue'
  import 'tinymce/themes/silver/theme'
  import 'tinymce/plugins/image'
  import 'tinymce/plugins/media'
  import 'tinymce/plugins/table'
  import 'tinymce/plugins/lists'
  import 'tinymce/plugins/contextmenu'
  import 'tinymce/plugins/wordcount'
  import 'tinymce/plugins/colorpicker'
  import 'tinymce/plugins/textcolor'
  import 'tinymce/plugins/fullscreen'
  import 'tinymce/icons/default/icons.min.js'
  export default {
    components: {
      Editor
    },
    props: {
      value: {
        type: String,
        required:false
      },
      triggerChange:{
        type: Boolean,
        default: false,
        required:false
      },
      disabled: {
        type: Boolean,
        default: false
      },
      plugins: {
        type: [String, Array],
        default: 'lists image media table textcolor wordcount contextmenu fullscreen'
      },
      toolbar: {
        type: [String, Array],
        default: 'undo redo |  formatselect | bold italic | alignleft aligncenter alignright alignjustify |fontsizeselect| bullist numlist outdent indent | lists image media table | removeformat | fullscreen'
      }
    },
    data() {
      return {
        //初始化配置
        init: {
          language_url: `${this.$config.jeditorRouter}/tinymce/langs/zh_CN.js`,
          language: 'zh_CN',
          skin_url: `${this.$config.jeditorRouter}/tinymce/skins/lightgray`,
          height: 300,
          plugins: this.plugins,
          toolbar: this.toolbar,
          branding: false,
          menubar: false,
          convert_urls: false,
          toolbar_mode:'sliding',
          images_upload_handler: (blobInfo, success) => {
             var formData = new FormData();
             formData.append('file', blobInfo.blob());
             let url = "/sys/common/upload"
             console.log('url:',url)
             postAction(url,formData).then(res => {
							   this.confirmLoading = false
							   //将返回的数据回显
							   if(res.success){
								var uploading = false;
								var srcUrl = `${this.$config.imgDomainURL}/${res.message}`;
							  success(srcUrl)
							   }else{
								 this.$message.warn(res.message)
							   }
							 })
            const img = 'data:image/jpeg;base64,' + blobInfo.base64()

          }
        },
        myValue: this.value
      }
    },
    mounted() {
      tinymce.init({})
    },
    methods: {

      onClick(e) {
        this.$emit('onClick', e, tinymce)
      },
      //可以添加一些自己的自定义事件，如清空内容
      clear() {
        this.myValue = ''
      }
    },
    watch: {
      value(newValue) {
        this.myValue = (newValue == null ? '' : newValue)
      },
      myValue(newValue) {
        if(this.triggerChange){
          this.$emit('change', newValue)
        }else{
          this.$emit('input', newValue)
        }
      }
    }
  }

</script>
<style scoped>
</style>
