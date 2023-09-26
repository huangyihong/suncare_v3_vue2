<template>
  <div class="p-l-60">
    {{filterDictText(dictArray,text) || text}}
  </div>
</template>

<script>
  import { filterDictText } from '@/components/dict_medical/DictSelectUtil'

  export default {
    name: 'TextComp',
    props: ['value','text'],
    components: {
    },
    data() {
      return {
        dictArray: []
      }
    },
    mounted(){
      this.$util.initDict('YESNO').then(data=>{
        this.dictArray = data
      })
      if(this.value === undefined || this.value === null){
        this.onChange()
      }
    },
    methods: {
      filterDictText,
      onChange() {
        let val = this.text
        this.$emit('input', val)
        this.$emit('change', val)
      },
    },
  }
</script>
<style scoped>

</style>
