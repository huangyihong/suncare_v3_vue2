<template>
  <div>
  <input type="file" ref="imgFileRef" v-on:change="onUploadHeadImage()" style="display: none">
  <a-modal :visible="visible" title="修改头像" :maskClosable="false" :confirmLoading="confirmLoading" :width="800">
    <a-row>
      <a-col :xs="24" :md="12" :style="{height: '350px'}">
        <vue-cropper
          ref="cropper"
          :img="options.img"
          :info="true"
          :autoCrop="options.autoCrop"
          :autoCropWidth="options.autoCropWidth"
          :autoCropHeight="options.autoCropHeight"
          :fixedBox="options.fixedBox"
          @realTime="realTime"
        >
        </vue-cropper>
      </a-col>
      <a-col :xs="24" :md="12" :style="{height: '350px'}">
        <div class="avatar-upload-preview">
          <img :src="previews.url" :style="previews.img"/>
        </div>
      </a-col>
    </a-row>
    <template slot="footer">
      <a-button key="back" @click="cancelHandel">取消</a-button>
      <a-button key="submit" type="primary" :loading="confirmLoading" @click="okHandel">确认</a-button>
    </template>
  </a-modal>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex'

  import { VueCropper } from 'vue-cropper'
  import { uploadFile } from '@/api/api'


  export default {
    components: {
      VueCropper
    },
    data() {
      return {
        visible: false,
        id: null,
        confirmLoading: false,

        options: {
          img: this.$config.publicPath + '/avatar2.jpg',
          autoCrop: true,
          autoCropWidth: 200,
          autoCropHeight: 200,
          fixedBox: true
        },
        previews: {},
        user: null
      };
    },
    mounted() {
      this.user = {...this.userInfo()}
    },
    methods: {
      ...mapGetters(["userInfo"]),
      edit() {
        this.$refs.imgFileRef.dispatchEvent(new MouseEvent('click'))

      },
      onUploadHeadImage:function(){
        let reader = new FileReader();
        let file = this.$refs.imgFileRef.files[0];
        console.log('file',file)
        let that = this;
        reader.onloadend = function () {
          that.options.img = reader.result
          that.visible = true
        };
        reader.readAsDataURL(file);
      },
      close() {
        this.id = null;
        this.visible = false;
      },
      cancelHandel() {
        this.close();
      },
      okHandel() {
        this.$refs.cropper.getCropBlob((data) => {
          let file = new File([data],
            `${this.user.id}.${data.type.substring(data.type.indexOf("/") + 1)}`,
              { type: data.type }
          );
          this.confirmLoading = true
          //上传服务器
          console.log('file',file)
          let formData = new FormData();
          formData.append("file",file)
          uploadFile(formData).then(res => {
            if(res.success){
              this.$emit('sure', res.message)
              this.$message.success("上传成功")
            } else {
              this.$message.warn(res.message)
            }
          }).finally(() => {
            this.confirmLoading = false
            this.visible = false
          })
        })
      },

      realTime(data) {
        this.previews = data
      }
    }
  };
</script>

<style lang="less" scoped>

  .avatar-upload-preview {
    position: absolute;
    top: 50%;
    transform: translate(50%, -50%);
    width: 180px;
    height: 180px;
    border-radius: 50%;
    box-shadow: 0 0 4px #ccc;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
    }
  }
</style>