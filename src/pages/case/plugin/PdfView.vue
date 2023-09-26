<template>
  <a-spin :spinning="pdfLoading" :class="{'full-screen':fullScreen}">
    <div class="m-t-6 m-b-6">
      <div class="fl">
        <template v-if="isShowFullScreenButton">
          <a-button type="primary" class="m-r-6" @click="zoom">
            {{ fullScreen ? '缩小' : '全屏' }}
          </a-button>
        </template>
        <a-button @click="resetStatus">
          刷新
        </a-button>
      </div>
      <a-pagination :current="pageNo" :total="numPages"  :page-size="1" @change="toPage" class="fr inline-block" />
<!--
      <a-button-group class="fr">
        <span class="m-r-6" style="font-size: 16px;line-height: 32px">{{pageNo}} / {{numPages}}</span>
        <a-button type="primary" @click="toPage(pageNo - 1)" :disabled="pageNo===1">
          <a-icon type="left"/>
          上一页
        </a-button>
        <a-button type="primary" @click="toPage(pageNo + 1)" :disabled="pageNo===numPages">
          下一页
          <a-icon type="right"/>
        </a-button>
      </a-button-group>-->
      <div class="clear"></div>
    </div>
    <div ref="container"
         class="container"
         style="overflow: scroll;position: relative;width: 100%"
         :style="{height: fullScreen?'calc(100vh - 60px)':height}"
         v-on="containerEvent">
      <img ref="target"
           class="target"
           :src="imgData"
           :style="{top: pdfTop + 'px', left: pdfLeft + 'px', width: scale * 100 + '%'}"
      >
    </div>

    <a-affix :offset-bottom="10">
      <div style="display: inline-block;height: 200px;position: absolute;bottom: 20px;" v-if="inResize">
        <a-slider vertical  :marks="marks" :tooltipVisible="false"  v-model="scale" :min="0.5" :max="2" :step="0.1"/>
      </div>
    </a-affix>

    <canvas ref="canvas" height="3840" style="display: none"></canvas>
  </a-spin>

</template>

<script>
  import { downFile } from '@/api/manage'
  import * as pdfJS from 'pdfjs-dist'
  import * as pdfWorker from 'pdfjs-dist/build/pdf.worker'
  // import * as pdfWorker from "pdfjs-dist/build/pdf.worker.min.js"
  // import pdfWorker from "pdfjs-dist/build/pdf.worker.entry"
  export default {
    name: 'PdfView',
    components: {},
    props: {
      height: {
        type: String,
        default: '400px'
      },
      isShowFullScreenButton:{
        type:Boolean,
        required:false,
        default: true
      }
    },
    data() {

      return {
        fullScreen: false,
        pdfData: undefined,
        imgData: undefined,
        pdfLoading: false,
        pageNo: 1,
        numPages: 1,
        startX: 0,
        startY: 0,
        pdfTop: 0,
        pdfLeft: 0,
        scale: 1,
        isImg: false,
        containerEvent: {
//          mousedown: (e) => {
//            let { clientX, clientY } = e
//            this.mousedown = true
//            this.startY = clientY - this.pdfTop
//            this.startX = clientX - this.pdfLeft
//          },
//          mouseup: () => {
//            this.mousedown = false
//          },
//          // 鼠标移动
//          mousemove: (e) => {
//            let { clientX, clientY } = e
//            if (this.mousedown) {
//              this.pdfTop = clientY - this.startY
//              this.pdfLeft = clientX - this.startX
//            }
//            e.preventDefault()
//
//
//          },
//          // 鼠标移出区域
//          mouseout: () => {
//            this.mousedown = false
//
//          },
//          // 鼠标滚轮缩放
//          mousewheel: (e) => {
//            this.scale += e.deltaY < 0 ? 0.1 : -0.1
//            if (this.scale < 0.5) {
//              this.scale = 0.5
//            }
//            e.preventDefault()
//          }
        },
        marks: {
          0.5: '小',
          1: '中',
          1.5: '大',
          2: '特大',
        },
        inResize:true,
      }
    },
    methods: {
      loadImg(url) {
        // this.isImg = true
        if(this.pdfLoading){
          return
        }
        this.numPages = 1
        this.pdfLoading = true
        downFile(url, {}, 'get').then((data) => {
          if (!data) {
            this.$message.warning('文件下载失败')
            return
          }
          let reader = new FileReader()
          if (data.size < 1000) {
            reader.onload = e => {
              let result = JSON.parse(reader.result)
              this.$message.error(result.message)
            }
            reader.readAsText(data)
          } else {
            reader.onload = e => {
              this.imgData = reader.result
              this.pageNo = 1
              this.resetStatus()
            }
            reader.readAsDataURL(data)
          }


        }).finally(() => {
          this.pdfLoading = false
        })
      },
      loadData(url, pageNo = 1) {
        // this.isImg = false
        if(!url || url.toString().length === 0){
          this.$message.warning('文件路径不能为空')
          return
        }
        if(this.pdfLoading){
          return
        }
        if (this.url === url) {
          this.toPage(pageNo)
          return
        }
        this.pdfLoading = true
        downFile(url, {}, 'get').then((data) => {
          if (!data) {
            this.$message.warning('文件下载失败')
            return
          }
          this.url = url
          let reader = new FileReader()
          if (data.size < 1000) {
            reader.onload = e => {
              let result = JSON.parse(reader.result)
              this.$message.error(result.message)
            }
            reader.readAsText(data)
          } else {
            reader.onload = e => {
              this.resetStatus()
              this.pdfInit(reader.result, pageNo)
            }
            reader.readAsDataURL(data)
          }
        })/*.finally(() => {
          this.pdfLoading = false
        })*/
      },
      pdfInit(data, pageNo) {
        console.log('pdfJS', pdfJS)
        console.log('pdfWorker', pdfWorker)
        // pdfJS.GlobalWorkerOptions.workerSrc = require('pdfjs-dist/build/pdf.worker.min').WorkerMessageHandler
        // pdfJS.GlobalWorkerOptions.workerSrc = require('pdfjs-dist/build/pdf.worker');
        window.pdfjsWorker = pdfWorker
        pdfJS.getDocument(data).promise.then((pdfDoc_) => {
          this.pdfDoc = pdfDoc_
          this.numPages = this.pdfDoc.numPages
          console.log('pdf_numPages', this.numPages)
          this.renderPage(pageNo)
        })
      },
      // 渲染pdf
      renderPage(num) {
        // Using promise to fetch the page
        this.pageNo = num
        this.pdfDoc.getPage(num).then((page) => {
          let canvas = this.$refs.canvas
          let viewport = page.getViewport({ scale: 1 })
          let scale = canvas.height / viewport.height
          viewport = page.getViewport({ scale })
          canvas.width = viewport.width
          let ctx = canvas.getContext('2d')
          let renderTask = page.render({
            canvasContext: ctx,
            viewport: viewport
          })
          renderTask.promise.then(() => {
            this.imgData = canvas.toDataURL('image/jpeg', 1)
            this.pdfLoading = false
          })
        })
      },
      resetStatus() {
        this.pdfTop = this.pdfLeft = 0
        this.scale = 1
      },
      toPage(pageNo) {
        this.renderPage(pageNo)
      },
      zoom(){
        this.fullScreen = !this.fullScreen
        this.inResize = false
        this.$nextTick(() => {
          this.inResize = true
        })
      },

    },
    computed: {}
  }
</script>
<style lang="less" scoped>
  /*.container {*/
    /*cursor: grab;*/

    /*&:active {*/
      /*cursor: grabbing;*/
    /*}*/
  /*}*/

  .target {
    position: absolute;
    transition: width 0.2s;
    /*border: #999 2px dashed;*/
  }


</style>
