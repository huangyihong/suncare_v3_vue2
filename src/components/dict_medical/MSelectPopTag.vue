<template>
  <a-popover trigger="click" v-model="visible">
    <div slot="content">
      <template v-for="(item, index) in options">
        <a @click="selectOk(item)" class="block" :title="`item.value(${item.code})`">{{item.value}}</a>
      </template>
    </div>
    <a>
      <slot>
        <template v-if="value !== null && value !== undefined && value.length > 0">
          {{filterDictText(options,value)}}
        </template>
        <template v-else-if="required && options.length > 0">
          {{filterDictText(options,options[0].code)}}
        </template>
        <template v-else>选择
        </template>
      </slot>
      <slot name="icon">
        <a-icon type="down" :style="{transform: `rotate(${visible?'-180':'0'}deg)`}"
                style="transition: all 0.3s;font-size: 14px"/>
      </slot>
    </a>
  </a-popover>
</template>

<script>
  import { filterDictText } from '@/components/dict_medical/DictSelectUtil'

  export default {
    name: 'MSelectPopTag',
    components: {},
    props: {
      options: {
        type: Array,
        default: () => []
      },
      value: String,
      required: {
        type: Boolean,
        default: false
      },
    },
    data() {
      return {
        visible: false,
        filterDictText
      }
    },
    methods: {
      selectOk(item) {
        this.visible = false
        this.$emit('input', item.code)
        this.$emit('ok', item)
      }
    },
    computed: {}
  }
</script>
<style scoped>

</style>
