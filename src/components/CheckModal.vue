<template>
    <m-modal
            :centered="false"
            :title="title"
            :width="500"
            class="min-width-0"
            :visible="visible"
            @cancel="close"
            @ok="handleOk">
        <a-spin :spinning="confirmLoading">
            <div :style="{ borderBottom: '1px solid #E9E9E9' }">
                <a-checkbox :indeterminate="indeterminate" :checked="checkAll" @change="onCheckAllChange">
                    全选
                </a-checkbox>
            </div>
            <br/>
            <a-checkbox-group v-model="checkedList" :options="plainOptions" @change="onChange"/>
            <div v-if="Object.keys(loadingMap).length > 0">
                <template v-for="code in checkedList">
                    <div>
                        <a-icon type="loading" v-if="loadingMap[code]"></a-icon>
                        <a-icon type="close" class="t-red" v-else-if="errorMsgMap[code]"/>
                        <a-icon type="check" class="t-redt-green" v-else/>
                        {{codeNameMap[code]}}
                        <span class="t-red">{{errorMsgMap[code]}}</span>
                    </div>
                </template>
            </div>
        </a-spin>

    </m-modal>
</template>

<script>

  export default {
    name: "CheckModal",
    components: {},
    props: {
      showLoading: Boolean
    },
    data() {
      return {
        confirmLoading: false,
        visible: false,
        checkedList: [],
        indeterminate: true,
        checkAll: false,
        plainOptions: [
          { label: 'Apple', value: 'Apple' },
          { label: 'Pear', value: 'Pear' },
          { label: 'Orange', value: 'Orange' },
        ],
        isSubmited: false,
        loadingMap: {},
        errorMsgMap: {}
      }
    },
    computed: {
      codeNameMap() {
        let obj = {}
        this.plainOptions.forEach(r => {
          obj[r.value] = r.label
        })
        return obj
      }
    },
    methods: {
      loadData({
                 title = '请选择',
                 options = [],
                 selectData = [],
                 mDict,
                 selectAll,
               }, callback = () => {
      }) {
        this.visible = true;
        this.title = title
        if (mDict) {
          this.confirmLoading = true
          this.$util.initDict(mDict).then(data => {
            this.plainOptions = data.map(r => ({ label: r.value, value: r.code }))
            this.checkedList = selectAll?this.plainOptions.map(r => r.value) : selectData
            this.onChange(this.checkedList)
          }).finally(() => {
            this.confirmLoading = false
          })
        } else {
          this.plainOptions = options.map(r => ({ label: r.value, value: r.code }))
          this.checkedList = selectAll?this.plainOptions.map(r => r.value) : selectData
          this.onChange(this.checkedList)
        }
        this.callback = callback
      },
      handleOk() {
        if (this.showLoading) {
          this.errorMsgMap = {}
          this.loadingMap = this.checkedList.reduce((prev, cur) => {
            prev[cur] = true
            return prev
          }, {})
        }

        this.callback(this.checkedList, this.close, (code, msg) => {
          this.loadingMap = { ...this.loadingMap, [code]: false }
          this.errorMsgMap = { ...this.errorMsgMap, [code]: msg }
        })
      },
      close() {
        this.visible = false;
      },
      onChange(checkedList) {
        this.indeterminate = !!checkedList.length && checkedList.length < this.plainOptions.length;
        this.checkAll = checkedList.length === this.plainOptions.length;
        if (this.showLoading) {
          this.loadingMap = {}
        }
      },
      onCheckAllChange(e) {
        Object.assign(this, {
          checkedList: e.target.checked ? this.plainOptions.map(r => r.value) : [],
          indeterminate: false,
          checkAll: e.target.checked,
        });
      },
    }
  }
</script>

<style lang="less" scoped>
    .list {
        .list-item {
            &:last-child {
                border-bottom: none;
            }

            &.active {
                background-color: #2eabff;
                color: white;
            }

            &:hover {
                background-color: #2eabff;
                color: white;
            }

            transition: background-color .3s;
            cursor: pointer;
            padding: 10px 20px

        }
    }

    .tip {
        font-size: 14px;
        text-align: right;
        margin: 5px 0;
    }


</style>
