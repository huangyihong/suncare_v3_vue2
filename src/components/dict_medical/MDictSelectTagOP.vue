<template>
  <m-dict-select-tag v-bind="$attrs" v-model="dictValue" @change="valChange"></m-dict-select-tag>
</template>

<script>
  import MDictSelectTag from "@/components/dict_medical/MDictSelectTag"

  export default {
    name: "MDictSelectTagOP",
    props: {
      value: String,
      like: Boolean,
      rlike: Boolean
    },
    components:{
      MDictSelectTag
    },
    data() {
      return {
        dictValue: undefined
      }
    },
    watch: {
      value: {
        immediate: true,
        handler(val) {
          console.log('dictValue', val)
          if(val && val.length > 2){
            if(this.like){
              this.dictValue = val.substring(1,val.length - 1)
            } if(this.rlike){
              this.dictValue = val.substring(0,val.length - 1)
            } else {
              this.dictValue = val
            }
          }
        },
      }
    },
    methods:{
      valChange(val){
        let value = val
        if( val !== undefined && val != null) {
          if (this.like) {
            value = `*${val}*`
          } else if(this.rlike){
            value = `${val}*`
          }
        }
        this.$emit('change', value);
        this.$emit('input', value);

      }
    }
  }
</script>

<style scoped>
</style>