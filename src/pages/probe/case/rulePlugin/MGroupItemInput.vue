<template>
      <a-input readOnly="readonly" :placeholder="`请选择${selectInfo.labelName}`"
               :value="nameVal || value" :title="`${nameVal}(${value})`"
               @change="e=> $emit('change',e)" @click="e=> $emit('click',e)">

        <a-icon slot="suffix" :type="confirmLoading?'loading':'select'" style="color: #aaa;"/>
      </a-input>
</template>

<script>
  import { getAction } from '@/api/manage'

  export default {
    name: 'MGroupItemInput',
    components: {},
    props: ['value','name','kind', 'valueEqName'],
    data() {
      return {
        confirmLoading: false,
        nameVal:'',
        selectInfos: {
          '1': { tableNameUrl:'medicalProjectGroupItem',labelName:'服务项目' },
          '5': { tableNameUrl:'medicalDiseaseGroupItem',labelName:'疾病项'},
          '7': { tableNameUrl:'medicalDrugGroupItem',labelName:'药品项'},
        },
      }
    },
    watch:{
      value: {
        immediate: true,
        handler(val) {
          if(this.valueEqName){
            this.nameVal = val
            return
          }
          if ((!this.name || this.name.length === 0) && val !== undefined && val !== null && val !== '') {
            this.nameVal = undefined
            this.confirmLoading = true
            getAction(`/config/${this.selectInfo.tableNameUrl}/queryByCode`,
              {code:this.value},'get').then((res) => {
              if (res.success) {
                let data = res.result
                if(data) {
                  this.nameVal = data.groupName
                }
              }
            }).finally(()=>{
              this.confirmLoading = false
            })
          } else if(!this.nameVal){
            this.nameVal = this.name
          }
        }
      },
      name(val) {
        if (val && val.length > 0) {
          this.nameVal = val
        }
      }
    },
    methods: {
    },
    computed:{
      selectInfo(){
        return this.selectInfos[this.kind]
      }
    }
  }
</script>
<style scoped>

</style>
