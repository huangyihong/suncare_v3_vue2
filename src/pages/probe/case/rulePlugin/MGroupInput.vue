<template>
  <div>
    <a-input readOnly="readonly" :placeholder="`请选择${selectInfo.labelName}`"
             :value="nameVal || value" :title="`${nameVal}(${value})`"
             @change="e=> $emit('change',e)" @click="e=> $emit('click',e)">

      <a-icon slot="suffix" :type="confirmLoading?'loading':'select'" style="color: #aaa;"/>
    </a-input>
  </div>
</template>

<script>
  import { getAction } from '@/api/manage'

  export default {
    name: 'MGroupInput',
    components: {},
    props: ['value', 'name', 'kind', 'valueEqName'],
    data() {
      return {
        confirmLoading: false,
        nameVal: '',
        selectInfos: {
          '1': { tableNameUrl: 'medicalProjectGroup', labelName: '服务项目组' },
          '5': { tableNameUrl: 'medicalDiseaseGroup', labelName: '疾病组' },
          '7': { tableNameUrl: 'medicalDrugGroup', labelName: '药品组' },
        },
      }
    },
    watch: {
      value: {
        immediate: true,
        handler(val) {
          if(this.valueEqName){
            this.nameVal = val
            return
          }
          this.nameVal = undefined
          if ((!this.name || this.name.length === 0) && val !== undefined && val !== null && val !== '') {
            this.confirmLoading = true
            getAction(`/config/${this.selectInfo.tableNameUrl}/queryByCode`,
              { code: val }, 'get').then((res) => {
              if (res.success) {
                let data = res.result
                if (data) {
                  this.nameVal = data.groupName
                }
              }
            }).finally(() => {
              this.confirmLoading = false
            })
          } else if(!this.nameVal){
            this.nameVal = this.name
          }
        }
      },
      name:{
        immediate: true,
        handler(val) {
          if (val && val.length > 0) {
            this.nameVal = val
          }
        }
      }
    },
    methods: {},
    computed: {
      selectInfo() {
        return this.selectInfos[this.kind]
      }
    }
  }
</script>
<style scoped>

</style>
