<template>
    <div>
        <a-cascader                
                :value="thisValue"
                :options="options"
                @change="onSelectChange"
                :loadData="loadBatchData"
                :loading="loading"
                placeholder="请选择历史批次"></a-cascader>
    </div>
</template>

<script>
  // import { getAllProjectAndBatch,taskProjectBatchList } from '@/api-sv3/api'
  import { getAction } from '@/api/manage'

  export default {
    name: 'BatchSelect',
    components: {},
    model: {
      prop: 'value',
      event: 'change'
    },
    props: {
      value: {
        type: Array,
      },
      filterSource: Boolean
    },
    data() {
      let fixedParam = this.fixedParam = {}
      if (this.filterSource) {
        let userInfo = this.$store.getters.userInfo
        fixedParam.dataSource = userInfo.dataSource
      }
      return {
        options: [],
        showAlert: false,
        url: {
          projectList: '/task/taskProject/list',
          batchList: '/task/taskProjectBatch/list'
        },
        thisValue: undefined
      }
    },
    watch: {
      value: {
        immediate: true,
        handler(val) {          
          this.thisValue = val || []
          // this.loadProjectDataBatch(val[0])
        }
      }
    },
    beforeMount: function() {
      this.loadProjectData()
    },
    methods: {
      onSelectChange(array) {
        if (!this.value) {
          this.thisValue = array         
        }
        this.$emit('change', array)
        this.$emit("select", array.length > 1 ? array[1] : undefined);
      },

      loadProjectData() {
        let params = {
          column: 'createTime',
          order: 'desc',
          field: "projectId,projectName",
          pageNo: 1,
          pageSize: 9999999,
          ...this.fixedParam
        }
        this.loading = true
        getAction(this.url.projectList, params).then(res => {
          this.options = res.result.records.map(r => {
            return {
              label: r.projectName,
              value: r.projectId,
              isLeaf: false,
              children: undefined,
              loading: false
            }
          })
        }).finally(() => {
          this.loading = false
        })
      },
      loadBatchData(selectedOptions) {        
        const targetOption = selectedOptions[selectedOptions.length - 1];
        targetOption.loading = true;
        // load options lazily
        let params = {
          projectId: targetOption.value,
          column: 'createTime',
          order: 'desc',
          field: "batchId,batchName",
          pageNo: 1,
          pageSize: 9999999
        }
        getAction(this.url.batchList, params).then(res => {
          if (res.success) {
            targetOption.children = res.result.records.map(item => {
              return {
                label: item.batchName,
                value: item.batchId,
              }
            })
          } else {
            this.$message.warning(res.message)
          }
          // this.options = [...this.options];
        }).finally(() => {
          targetOption.loading = false;
        })
      },
      
      /*loadProjectBatchData(){
        getAllProjectAndBatch({}).then(res => {
          if (res.success) {
            let {projects, batchs} = res.result
            let batchObj = {}
            for(let item of batchs){
              let key = item.projectId
              let array = batchObj[key]
              if(!array){
                batchObj[key] = array = []
              }
              array.push(item)
            }

            for(let project of projects){
              if(!batchObj[project.projectId]){
                continue
              }
              let obj = {
                label: project.projectName,
                value: project.projectId,
                isLeaf: false,
                children: batchObj[project.projectId].map(item => {
                  if(item.batchId === this.batchId){
                    this.value = [project.projectId,item.batchId]
                  }
                  return {
                    label: item.batchName,
                    value: item.batchId,
                  }
                })
              }
              this.options.push(obj)

            }
          }
        }).finally(() => {
          this.loading = false
        })
      },*/
    },
  }
</script>
<style scoped>

</style>
