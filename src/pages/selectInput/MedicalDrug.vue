<template>
  <div>
      <a-select
              class="radius-right-none"
        :mode="multi?'multiple':'default'"
        :placeholder="placeholderVal"
        v-model="codes"
        :open="false"
        :showArrow="false"
        :loading="loading"
        :maxTagCount="maxTagCount"
        :allowClear="!disable"
        :style="{width: disable?'100%':'calc(100% - 64px)'}"
              @change="onChange">
        <template v-if="showKey">
          <a-select-option v-for="item in selectData" :key="item[code]" :value="item[code]" :disabled="disable">
            {{item[name]}}({{item[code]}})
          </a-select-option>
        </template>
        <template v-else>
          <a-select-option v-for="item in selectData" :key="item[code]" :value="item[code]" :disabled="disable">{{item[name]}}
          </a-select-option>
        </template>
      </a-select>
      <a-button type="primary" class="radius-left-none" style="width: 64px" @click="openSelect" v-if="!disable">选择</a-button>
    <m-modal
      title="请选择药品"
      :visible="selectVisible"
      @ok="handleSelectOk"
      @cancel="handleSelectClose"
    >
      <select-component ref="selectRef" :selected="selectData" :selectType="multi?'checkbox':'radio'"></select-component>
    </m-modal>
  </div>
</template>

<script>
  import { getAction } from '@/api/manage'
  import SelectComponent from "@/pages/selectMulti/MedicalDrug"
  import selectInputMixin from "./mixin"

  export default {
    name: 'MedicalDrug',
    mixins: [selectInputMixin],
    components: {
      SelectComponent
    },
    data() {
      return {
        code: 'code',
        name: 'name'
      }
    },
    methods: {
      loadData(codes) {
        this.loading = true
        getAction(`/config/medicalDrug/queryByCodes`, { codes }).then((res) => {
          if (res.success) {
            let data = res.result
            this.selectData.splice(0, data.length, ...data)
          }
        }).finally(() => {
          this.loading = false
        })

      }
    },
    computed: {}
  }
</script>
<style scoped>

</style>
