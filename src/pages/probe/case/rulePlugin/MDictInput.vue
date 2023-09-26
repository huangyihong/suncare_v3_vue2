<template>
      <a-input readOnly="readonly" placeholder="请选择"
               :value="nameVal || value" :title="`${nameVal}(${value})`"
               @change="e=> $emit('change',e)" @click="e=> $emit('click',e)">

        <a-icon slot="suffix" :type="confirmLoading?'loading':'select'" style="color: #aaa;"/>
      </a-input>
</template>

<script>
  import { getAction } from '@/api/manage'

  export default {
    name: 'MDictInput',
    components: {},
    props: ['value','name', 'valueEqName'],
    data() {
      return {
        confirmLoading: false,
        nameVal:'',
        url: '/config/medicalDict/queryByCode'
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
            getAction(this.url, {code: this.value},'get').then((res) => {
              let data = res.result
              if(data){
                this.nameVal = data.groupName
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
    computed: {}
  }
</script>
<style scoped>

</style>
