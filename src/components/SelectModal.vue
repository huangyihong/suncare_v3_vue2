<template>
    <m-modal centered
             :title="title"
             :width="300"
             class="min-width-0"
             :visible="visible"
             @cancel="handleCancel"
             :bodyStyle="{padding: '0 10px'}"
             @ok="handleOk">
        <div class="list">
            <template v-for="(item,index) in selectData">
                <div class="list-item border-b-eee" :class="{'active':index === selectIndex}"
                     @click="()=>{selectIndex = index}">
                    {{item[showField]}}
                </div>
            </template>
        </div>
        <div v-if="tip" class="t-grey-aaa tip">{{tip}}</div>

    </m-modal>
</template>

<script>
  import pick from 'lodash/pick'
  import Vue from 'vue'
  import { ACCESS_TOKEN } from "@/store/mutation-types"

  export default {
    name: "ImportModal",

    components: {},
    data() {
      return {
        visible: false,
        confirmLoading: false,
        showField: undefined,
        selectData: [],
        selectIndex: undefined,
        callback: undefined,
        title: undefined,
        tip: undefined
      }
    },

    methods: {
      close() {
        this.visible = false;
      },
      handleCancel() {
        this.close()
        this.callback()
      },
      loadData(array, showField, callback = () => {
      }, { title = '请选择',tip }) {
        this.visible = true;
        this.title = title
        this.tip = tip

        this.selectData = array
        this.showField = showField
        this.selectIndex = array.length > 0?0:undefined
        this.callback = callback
      },
      handleOk() {
        this.close()
        this.callback(this.selectData[this.selectIndex])
      }

    }
  }
</script>

<style lang="less" scoped>
    .list{
        .list-item {
            &:last-child{
                border-bottom: none;
            }

            &:hover {
                background-color: #ddd;
                color: inherit;
            }
            &.active {
                background-color: #2eabff;
                color: white;
            }
            transition: background-color .3s;
            cursor: pointer;
            padding: 10px 20px

        }
    }
    .tip{
        font-size: 14px;
        text-align: right;
        margin: 5px 0;
    }


</style>
