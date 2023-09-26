<template>
    <div>
      <a-input readOnly="readonly" placeholder="请选择医疗机构"
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
    props: ['value','name','kind', 'valueEqName'],
    data() {
      return {
        confirmLoading: false,
        nameVal:'',
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
          this.nameVal = undefined
          if ((!this.name || this.name.length === 0) && val !== undefined && val !== null && val !== '') {
            this.confirmLoading = true
            getAction(`/config/medicalOrgan/queryByCode`, {code:this.value},'get').then((res) => {
              if (res.success) {
                let data = res.result
                if(data){
                  this.nameVal = data.name
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
      },
    },
    methods: {
    },
  }
</script>
<style scoped>

</style>
