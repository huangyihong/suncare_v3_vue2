<template>
    <a-row :gutter="12">
        <a-col :sm="18">
            <a-input-number class="w-b-100" :step="0.01" placeholder="请输入"
                    v-model.lazy="amount" @change="onChange"></a-input-number>
        </a-col>
        <a-col :sm="6">
            <template v-if="oDict">
                <other-dict-select-tag placeholder="请选择单位" :dictEname="oDict"
                                       v-model="unit" @change="onChange"></other-dict-select-tag>
            </template>
            <template v-else-if="mDict">
                <m-dict-select-tag placeholder="请选择单位" :dictCode="mDict"
                                   v-model="unit" @change="onChange"></m-dict-select-tag>
            </template>
            <template v-else-if="options">
                <m-dict-select-tag placeholder="请选择单位" :options="options"
                                   v-model="unit" @change="onChange"></m-dict-select-tag>
            </template>
        </a-col>
    </a-row>
</template>

<script>
  // 作用为  数值输入框-其他字典单位
  import MDictSelectTag from "@/components/dict_medical/MDictSelectTag"
  import OtherDictSelectTag from "@/pages/config/modules/OtherDictSelectTag"

  export default {
    name: 'AmountAndUnit',
    components: {
      MDictSelectTag,
      OtherDictSelectTag,
    },
    props: {
      value: Array,
      oDict: String,
      mDict: String,
      options: Array,
    },
    model: {
      prop: 'value',
      event: 'change'
    },
    data() {
      return {
        amount: undefined,
        unit: undefined,
      }
    },
    watch: {
      value: {
        immediate: true,
        handler(val) {
          if (val === this.thisValue) {
            return
          }
          if (!val) {
            this.amount = this.unit = undefined
            return
          }
          this.thisValue = ''
          console.log('val', val)

          let [amount, unit] = val
          this.amount = amount
          this.unit = unit
        }
      }
    },
    methods: {
      onChange() {
        this.$nextTick(() => {
          let val = [this.amount, this.unit]
          if (!this.isStrsNotBlank(val)) {
            val = ''
          }
          this.thisValue = val
          this.$emit('change', val)
          console.log('change', val)
        })
      },
      isStrsNotBlank(array) {
        let bl = true
        for (let item of array) {
          bl = this.isStrNotBlank(item) && bl
          if (!bl) {
            return bl
          }
        }
        return bl
      },
      isStrNotBlank(val) {
        return val !== undefined && val !== null && (val + '').length > 0
      },
    },
    computed: {}
  }
</script>
<style scoped>

</style>
