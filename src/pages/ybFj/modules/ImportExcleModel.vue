<template>
  <div>
    <a-modal :title="title" :closeIcon="close" :width="420" :closable="false" :visible="visible"
             :confirmLoading="confirmLoading" cancelText="关闭" class="popBox">
      <div>
        <div class="disCC center">
          <div class="disRow center">
            <span class="line"></span>
            <span class="title">
              上传文件
            </span>

          </div>
          <img src="~@/assets/image/iconImg/close.png" @click="handleCancel" style="width:20px;cursor: pointer;"/>
          <!-- <span class="icon iconfont pointer" style="font-size:12px;color:#858585" @click="handleCancel">&#xe871;</span> -->
        </div>

      </div>
      <div class="addBox m-t-15" id="drop">
        <div class="font-12 m-r-10">选择文件:</div>
        <div class="uploadBox" @mouseenter="isOnChange = true">
          <div class="disRow center addImgBox "><img src="~/@assets/image/iconImg/addIcon.png"
                                                     style="width:16px"/><span class="font-12 m-l-5">添加相关文件</span></div>
          <input type="file" class="changeImg" @change="changeImg($event)" v-if="isOnChange"/>
        </div>
      </div>
      <ul style="margin-top: 15px" class="imgList">
        <li v-for="(item, index) in fileList" v-if="fileList.length > 0" style="line-height: 25.6px; margin-top: 5px">

          <div class="images" v-viewer v-if="item.fileType == 'img'">
            <img style="width: 200px;height: 150px;padding: 10px;opacity: 0;" :src="item.viewSrc"/>
          </div>
          <div class="liBox" @click="downLoad(item)">
            <div class="disStart">
              <img src="~@/assets/image/iconImg/python.png" class="imgBox" v-if="item.fileType == 'py'"/>
              <img src="~@/assets/image/iconImg/other.png" class="imgBox" v-if="item.fileType == 'other'"/>
              <div class="disColumn">
                <span class="imgTitle">{{ item.fileName }}</span>
                <span class="subTitle">{{ item.fileSize }}</span>
              </div>
            </div>
            <a-progress type="circle" :percent="item.percent" :width="32" class="circleBox" :strokeWidth="12"
                        :stroke-color="{
                from: '#4686FF',
                to: '#4686FF',
              }" v-if="loading">
              <template #format="percent">

                <span style="color: #4686FF;font-size:12px">{{ percent }}%</span>
              </template>

            </a-progress>
            <!--            <img src="~@/assets/image/iconImg/delete.png" v-else @click="delList(index)" style="width:20px" />-->
            <img src="~@/assets/image/iconImg/delete.png" v-else @click.stop="delList(index)" style="width:20px"/>
          </div>
          <div>
            <!-- <div class="imgClose" @click="delList(index)">
              <span class="icon iconfont " style="color:#AFAFAF;font-size:16px">&#xe6c5;</span>
            </div> -->
          </div>

        </li>
      </ul>
<!--      <div v-if="isWarn" class=" m-t-10" style="color:green;margin-top:40px">{{ warn }}</div>-->
<!--      <div v-else class=" m-t-10" style="color:red;margin-top:40px">{{ error }}</div>-->
      <template slot="footer" class=" m-t-10">
        <div class="footerBtn">

          <a-button key="submit" type="primary" :loading="loading" style="border-radius: 20px;width: 80px;"
                    @click="handleOk">
            上传
          </a-button>
          <a-button key="back" @click="handleCancel" style="border-radius: 20px;width: 80px;">
            返回
          </a-button>
        </div>

      </template>
    </a-modal>
  </div>

</template>
<script>
import {httpAction, getAction, putAction} from '@/api/manage'
import { ACCESS_TOKEN } from "@/store/mutation-types"
import Vue from "vue";
export default {
  data() {
    return {
      title: "",
      confirmLoading: false,
      visible: false,
      isOnChange: false,
      formData: {},
      fileList: [],
      url: {
        upimg: this.$config['domianURL'] + '/ybFj/ybFjTemplateExport/upload',
      },
      loading: false,
      error: '',
      warn:'',
      isWarn:false,
      dropActive: false,
      type: 1
    }
  },

  methods: {
    show() {
      this.isOnChange = false
      this.error = ''
      this.fileList = []
      this.visible = true

    },
    async changeImg(e) {
      if (this.fileList.length >= 1) {
        this.$message.warning('只能上传1个附件！')
        return
      }
      this.errorMsg = ''
      let file = e.target.files
      let formData = new FormData()
      let fileName = JSON.parse(JSON.stringify(file[0].name))
      let fileArray = fileName.split('.')
      let fileObj = {
        fileName: file[0].name,
        fileSize: (file[0].size / 1024).toFixed(2) + 'kb',
        percent: 0,
        fileType: null,
        index: this.fileList.length
      }
      console.log("fileArray===", fileArray)
      if (fileArray[fileArray.length - 1] !== 'py'){
        this.$message.warn('请选择一个“py”文件')
        return
      }
      if (fileArray[fileArray.length - 1] == 'py') {
        fileObj.fileType = 'py'
      } else {
        fileObj.fileType = 'other'
      }
      this.fileName = file[0].name
      formData.append('file', file[0])
      formData.append('index', this.fileList.length)
      this.formData = formData
      this.uploading = false
      this.isUpShow = true
      if (file[0].size / 1024 / 1024 > 10) {
        console.log('size,', fileObj.fileSize)
        this.$message.warning('文件大小不能超过10M!')
        return
      }
      this.fileList.push(fileObj)
      this.$forceUpdate()
    },

    upload(url, formData) {
      console.log('formData,', formData)
      const token = Vue.ls.get(ACCESS_TOKEN)
      // document.body.querySelector('.myProcess').style.display = 'block'
      return new Promise(resolve => {
        let xmlHttp = new XMLHttpRequest()
        xmlHttp.upload.onprogress = evt => {
          console.log(evt.loaded / evt.total * 100 + '%')
          console.log(evt)
          this.fileList[this.fileList.length - 1].percent = (evt.loaded / evt.total).toFixed(2) * 100
          this.$forceUpdate()
        }
        xmlHttp.onload = () => {
          let obj = JSON.parse(xmlHttp.responseText)
          obj.index = formData.get('index')
          resolve(obj)
        }
        xmlHttp.open('post', url, true)
        xmlHttp.setRequestHeader('X-Access-Token', token)
        xmlHttp.send(formData)
      })
    },
    handleOk() {
      if (this.fileList.length == 0) {
        this.$message.warning('请上传至少一个py文件！')
        return
      }
      this.loading = true
      // this.isWarn=true
      // this.warn="请耐心等待，上传中..."

      this.upload(this.url.upimg, this.formData).then(result =>{
        this.loading = false
        this.isWarn=false
        if (result.success) {
          this.$message.success("上传成功")
          this.visible = false
          return
        }
        this.fileList.forEach(e => {
          if (e.index == result.index) {
            // e.downloadUrl = this.$baseUrl + '/sys/common/download/' + result.message
            e.src = result.message
            e.fileUrl = result.message
            // e.viewSrc = this.$baseUrl + '/sys/common/view/' + result.message
          }
        })
      })




    },
    delList(index) {
      this.fileList.splice(index, 1)
      this.isOnChange = false
      this.error = ""
      this.$forceUpdate()
    },
    downLoad(item) {
      if (item.fileType !== 'img') {
        window.open(item.downloadUrl)
      }
    },
    handleCancel() {
      this.visible = false
    }
  }
}
</script>
<style scoped>
.font-12 {
  font-size: 12px
}

.disRow {
  display: flex;
  flex-direction: row
}

.center {
  align-items: center
}

.disCC {
  display: flex;
  justify-content: space-between
}

.popBox >>> .ant-modal-body {
  padding: 25px 24px 10px 24px;
}

.close {
  position: absolute;
  top: 8px;
  right: 0;
  z-index: 10;
  padding: 10px;
  color: #fd5451;
  font-weight: 700;
  line-height: 1;
  text-decoration: none;
  background: transparent;
  border: 0;
  outline: 0;
  cursor: pointer;
  transition: color 0.3s;
}

.popBox >>> .ant-modal-footer {
  border-top: none;
}

.line {
  width: 4px;
  height: 14px;
  background: #1890ff;
  display: block;
  margin-right: 16px;
}

.title {
  font-size: 14px;
  font-family: 'Adobe Heiti Std';
  font-weight: bold;
  color: #27313e;
  line-height: 20px;
}

.formBox >>> .ant-form-item-label {
  text-align: left;
  margin-left: 19px;
}

.uploadBox {
  width: 169px;
  height: 28px;
  background: #FAFAFA;
  border: 1px dashed #BBBBBB;
  border-radius: 4px;
  position: relative;
  cursor: pointer;
}

.changeImg {
  opacity: 0;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 33;
  cursor: pointer;
  position: absolute;
}

.imgBtn {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 22;
  cursor: pointer;
}

.imgList {
  padding-left: 80px;
  padding-right: 10px
}

.imgList li {
  height: 50px;
  width: 100%;
  line-height: 50px;
  align-items: center;
  position: relative;
  cursor: pointer;
  margin-bottom: 10px;
}

.liBox {
  width: 100%;
  /* border: 1px solid #dddddd; */
  line-height: 36px;
  align-items: center;
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  padding: 12px 27px 12px 20px;
  border-radius: 4px;
  box-shadow: -1px 0 6px rgba(125, 125, 125, 0.1),
    /*左边阴影*/ 1px 0 6px rgba(125, 125, 125, 0.1),
    /*右边阴影*/ 0 -1px 6px rgba(125, 125, 125, 0.1),
    /*顶部阴影*/ 0 1px 6px rgba(125, 125, 125, 0.1);
  /*底边阴影*/
  /* 2px 2px 2px 2px rgba(125, 125, 125, 0.1); */
}

.circleBox >>> .ant-progress-text {
  font-size: 10px;
}

.imgBox {
  width: 28px;
  height: 32px;
  display: block;
  margin-right: 12px;
  margin-top: 2px;
}

.imgTitle {
  font-size: 14px;
  font-family: Adobe Heiti Std;
  font-weight: bold;
  color: #060606;
  line-height: 24px;
  width: 62%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis
}

.subTitle {
  font-size: 12px;
  color: #999;
  line-height: 12px;
}

.imgClose {
  position: absolute;
  right: -8px;
  top: -12px;
  cursor: pointer;
}

.images {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}

.content {
  color: #27313e;
  font-size: 16px;
}

.footerBtn {
  width: 180px;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  justify-content: space-around;
  padding-bottom: 20px;
}

.tips {
  line-height: 28px;
  background: #e0f3ec;
  border-radius: 3px;
  padding-left: 16px;
}

.tipTitle {
  color: #999999;
  font-size: 12px;
}

.addBox {

  display: flex;
  flex-direction: row;
  align-items: center;
  margin-left: 20px
  /* position: relative; */
}

.disStart {
  display: flex;
  justify-content: flex-start;
  width: 80%
}

.disColumn {
  display: flex;
  flex-direction: column
}

.addImgBox {
  padding-left: 20px;
  line-height: 26px;
  color: #A0A0A0
}

.m-l-5 {
  margin-left: 5px
}
</style>
