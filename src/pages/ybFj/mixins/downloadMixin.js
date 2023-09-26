import {downFile } from '@/api/manage'

/***
 * 直接下载文件 输出流下载
 *
 */
export const downloadFileMixin = {

  data(){
    return {

    }
  },
  methods:{
    /* 下载 */
    downloadFileAction(url, params,fileName){
      downFile(url, params, 'get').then((data) => {
        if (!data) {
          this.$message.warning('文件下载失败')
          return
        }
        const that = this
        if(data.size == 0 ){
          this.$message.warning('文件不存在')
          return
        }
        if (data.size < 2001) {
          let reader = new FileReader()
          reader.onload = function(event) {
            let result = JSON.parse(reader.result)
            if (!result.success) {
              that.$message.error(result.message)
            } else {
              that.$message.success(result.result || result.message)
            }
          }
          reader.readAsText(data)
        } else {
          if (typeof window.navigator.msSaveBlob !== 'undefined') {
            window.navigator.msSaveBlob(new Blob([data]), fileName)
          } else {
            let url = window.URL.createObjectURL(new Blob([data]))
            let link = document.createElement('a')
            link.style.display = 'none'
            link.href = url
            link.setAttribute('download', fileName)
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link) //下载完成移除元素
            window.URL.revokeObjectURL(url) //释放掉blob对象
          }
          this.$message.success('文件下载成功')
        }
      }).catch(e => {
        this.$message.error(e.message)
      })
    }
  }

}


