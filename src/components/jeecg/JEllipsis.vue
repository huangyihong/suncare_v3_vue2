<template>
  <a-tooltip placement="topLeft" :overlayClassName="overlayClassName">
    <template slot="title">
      <span v-if="html" v-html="html"></span>
      <span v-else >{{value}}</span>
    </template>
    {{ value | ellipsis(length) }}
  </a-tooltip>
</template>

<script>
  export default {
    name: 'JEllipsis',
    props: {
      value: {
        type: String,
        required: false,
      },
      length: {
        type: Number,
        required: false,
        default: 25,
      },
      html: {
        type: String,
        required: false,
      },
      overlayClassName:{
        type: String,
        required: false,
      }

    }
  }
</script>

<style scoped>

</style>
