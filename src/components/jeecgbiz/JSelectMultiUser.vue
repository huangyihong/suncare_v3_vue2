<template>
  <j-select-biz-component
    :value="value"

    name="用户"
    displayKey="realname"

    :returnKeys="returnKeys"
    :listUrl="url.list"
    :columns="columns"
    queryParamText="账号"

    v-on="$listeners"
    v-bind="$attrs"
  />
</template>

<script>
  import JSelectBizComponent from './JSelectBizComponent'

  export default {
    name: 'JSelectMultiUser',
    components: { JSelectBizComponent },
    props: ['value'],
    data() {
      return {
        returnKeys: ['id', 'username'],
        url: { list: '/sys/user/list' },
        columns: [
          { title: '姓名', align: 'center', width: 100, dataIndex: 'realname' },
          { title: '账号', align: 'center', width: 100, dataIndex: 'username' },
          { title: '电话', align: 'center', width: 100, dataIndex: 'phone' },
          { title: '出生日期', align: 'center', width: 100, dataIndex: 'birthday' }
        ]
      }
    }
  }
</script>

<style lang="less" scoped></style>