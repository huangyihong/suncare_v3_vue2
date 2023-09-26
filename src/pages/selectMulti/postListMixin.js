import {  postAction } from '@/api-sv3/manage'

export const postListMixin = {
  methods: {
    //已选中 未选中 id参数
    searchInParam(){
      let inParam = {}
      let codeStr = 'null';
      if(this.selectedRowRecords.length>0){
        codeStr = this.selectedRowRecords.map(item => item[this.paramInId]).join(",")
      }
      if(this.queryParam.queryType=='in'){
        inParam[this.paramInId+`_in`] = codeStr
      }
      if(this.queryParam.queryType=='not_in'){
        inParam[this.paramInId+`_not_in`] = codeStr
      }
      return inParam;
    },
    //post请求获取list
    postloadData(arg) {
      if (!this.url.list) {
        this.$message.error('请设置url.list属性!')
        return
      }
      //加载数据 若传入参数1则加载第一页的内容
      if (arg === 1) {
        this.ipagination.current = 1
      }
      let params = this.getQueryParams()//查询条件
      console.dir(this.searchInParam())
      params = Object.assign(params, this.searchInParam())
      this.loading = true
      postAction(this.url.list, params).then((res) => {
        if (res.success) {
          this.dataSource = res.result.records
          this.ipagination.total = res.result.total
        } else {
          this.$message.warning(res.message)
        }
      }).finally(() => {
        this.loading = false
      })
    },
  }
}

