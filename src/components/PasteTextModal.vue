<template>
  <m-modal title="粘贴文本"
           @ok="handleOk"
           @cancel="hide"
           :visible="visible">
      <a-textarea ref="textarea" placeholder="请粘贴文本至此处" v-model="text" :autosize="{minRows: 2, maxRows: 15 }" allowClear/>
  </m-modal>
</template>

<script>

  export default {
    name: 'PasteTextModal',
    components: {},
    data() {
      return {
        visible: false,
        text: '',
      }
    },
    methods: {
      handleOk(){
        this.$emit('ok', this.text)
        this.hide()
      },
      show(){
        this.visible = true
        this.$nextTick(()=>{
          this.$refs.textarea.focus()
        })
      },
      hide(){
        this.text = ''
        this.visible = false
      }
    },
  }
</script>
<style scoped>

</style>
