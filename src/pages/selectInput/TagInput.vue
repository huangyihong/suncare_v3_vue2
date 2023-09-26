<template>
  <div class="background-white">
    <a-select
      mode="multiple"
      :placeholder="placeholderVal"
      v-model="codes"
      :open="false"
      :showArrow="false"
      :loading="loading"
      :maxTagCount="maxTag"
      :allowClear="!readOnly"
      :disabled="readOnly"
      :style="{width: '100%'}"
      @change="onChange">

      <a-select-option v-for="code in codes" :key="code" :value="code">{{code}}
      </a-select-option>
    </a-select>
  </div>
</template>

<script>
  export default {
    name: 'TagInput',
    props: {
      value: String,
      placeholder: {
        type: String,
        default: ''
      },
      separator: {
        type: String,
        default: ','
      },
      readOnly: Boolean,
      maxTag: {
        type: Number,
        default: 5
      },
      loading: Boolean
    },
    model: {
      prop: 'value',
      event: 'change'
    },
    components: {},
    data() {
      return {}
    },
    beforeMount() {
      console.log('readOnly', this.readOnly)
    },
    watch: {
      value: {
        immediate: true,
        handler(val) {
          if (val === this.changeVal) {
            return
          }
          if (val && val.trim().length > 0) {
            this.codes = val.split(this.separator).map(r => r.trim())
          } else {
            this.codes = []
          }
        }
      }
    },
    methods: {
      onChange(val) {
        this.$emit('change', this.changeVal = val.join(this.separator))
      }
    },
    computed: {}
  }
</script>
<style lang="less">

</style>
