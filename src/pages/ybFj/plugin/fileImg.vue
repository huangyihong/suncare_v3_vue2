<template>
    <span>
      <img src="~@/assets/image/iconImg/xls.png" class="imgBox" v-if="fileType==='excel'"/>
      <img src="~@/assets/image/iconImg/word.png" class="imgBox" v-else-if="fileType==='doc'"/>
      <img src="~@/assets/image/iconImg/pdf.png" class="imgBox" v-else-if="fileType==='pdf'"/>
      <img src="~@/assets/image/iconImg/jpg.png" class="imgBox" v-else-if="fileType == 'img'"/>
      <img src="~@/assets/image/iconImg/other.png" class="imgBox" v-else/>
    </span>
</template>

<script>
export default {
  name: "fileImg",
  props: {
    fileType: {
      type: String,
    },

  },
}
</script>
<style lang="less" scoped>
  .imgBox {
    width: 30px;
    margin-right: 12px;
  }
</style>