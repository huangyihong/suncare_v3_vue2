<template>
    <div>
      <div style="font-size:16px;font-weight:bold">历史交流文档查询</div>
      <div class="m-t-10 disRow">
        <a-select v-model="searchField" style="width: 160px">
          <a-select-option value="fileSrcname"> 文档关键词 </a-select-option>
          <a-select-option value="username"> 发送人 </a-select-option>
        </a-select>
        <a-input-search class="m-l-10" v-model="searchValue" @search="onSearch"></a-input-search>
      </div>

      <!-- 文档列表 -->
      <a-skeleton :loading="loading" active :paragraph="{rows: 10}">
      <template v-for="(item,index) in chatFileList" >
        <div class="list-box disCC m-t-10" @click="">
          <span class="text-ellipsis">{{item.fileSrcname}}</span>
          <span style="width:40px"><a @click="downloadFile(item.fileId,item.fileSrcname)">下载</a></span>
        </div>
      </template>
      <!-- 分页 -->
      <a-pagination size="small" :current="current" :total="totalPage" :page-size="10" @change="changePage" v-if="totalPage > 0" class="m-t-10 t-r" />
      </a-skeleton>
    </div>
</template>

<script>

import { getAction,downFile } from '@/api/manage'
import { downloadFileMixin } from '../mixins/downloadMixin'
export default {
  name: "chatFileList",
  mixins: [downloadFileMixin],
  components: {
  },
  data() {
    return {
      searchField:'fileSrcname',
      searchValue:'',


      url:{
        chatFileList:'/fj/chat/file/list',
        downloadFile:'/fj/chat/file/download',
      },
      chatFileList:[],
      totalPage: 0,
      current: 1,
      selectChatOrgId:undefined,
      loading:true,
    }
  },

  beforeMount() {

  },
  methods: {
    loadData(selectChatOrgId){
      this.current = 1
      this.selectChatOrgId = selectChatOrgId
      this.loadChatFileList()
    },
    //历史交流文档列表
    loadChatFileList(params){
      this.loading = true
      this.chatFileList = []
      if(!this.selectChatOrgId){
        return
      }
      if(!params){
        params = {}
      }

      params.pageNo = this.current
      params.orgId = this.selectChatOrgId
      getAction(this.url.chatFileList, params).then((res) => {
        if (res.success) {
          this.chatFileList = res.result.records
          this.totalPage = res.result.total
        }else{
          this.$message.warning(res.message);
        }
      }).finally(()=> {
        this.loading = false
      })
    },
    onSearch(){
      let params = {}
      if(this.searchValue){
        params[this.searchField] = this.searchValue
      }
      this.current = 1
      this.loadChatFileList(params)
    },
    //分页
    changePage (v) {
      this.current = v
      this.loadChatFileList()
    },
    /* 下载 */
    downloadFile(fileId,fileName){
      this.downloadFileAction(this.url.downloadFile,{fileId},fileName)
    },

  }
}
</script>
<style lang="less" scoped>
  .disRow {
    display: flex;
    flex-direction: row
  }

  .disCC {
    display: flex;
    justify-content: space-between;
    align-items: center
  }

  .disColumn {
    display: flex;
    flex-direction: column
  }

  .list-box {
    padding: 6px 6px;
  }

  .list-box:hover {
    background-color:#bbd9ef66;
    cursor: pointer;
  }
  .list-title{
    font-size:14px;
    font-weight: bold;
  }
  .list-des{
    width:120px;
    font-size:8px;
    color:#00000059
  }

  .selectColor{
    background-color:#bbd9ef66;
  }

  .text-ellipsis{
    overflow:hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    -o-text-overflow:ellipsis;
  }
</style>