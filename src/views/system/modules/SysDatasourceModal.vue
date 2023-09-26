<template>
  <a-drawer
    :title="title"
    :width="800"
    placement="right"
    :closable="false"
    @close="close"
    :visible="visible"
  >

    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-col :md="24" :sm="24">
          <a-form-item
            :labelCol="labelCol2"
            :wrapperCol="wrapperCol2"
            label="项目地名称">
            <a-input placeholder="请输入项目地名称" v-decorator="['name', validatorRules.required]"/>
          </a-form-item>
        </a-col>
        <a-col :md="24" :sm="24">
          <a-form-item
            :labelCol="labelCol2"
            :wrapperCol="wrapperCol2"
            label="项目地编码">
            <a-input placeholder="请输入项目地编码" v-decorator="['code', validatorRules.required]"/>
          </a-form-item>
        </a-col>

        <a-col :md="24" :sm="24">
          <a-form-item
            :labelCol="labelCol2"
            :wrapperCol="wrapperCol2"
            label="数据库名称(编码)">
            <a-select  placeholder="请选择数据库名称(编码)" :options="databaseOptions"   v-decorator="['databaseSource', {}]">
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="24" :sm="24">
          <a-form-item
            :labelCol="labelCol2"
            :wrapperCol="wrapperCol2"
            label="数仓project">
            <a-input placeholder="请输入数仓project" v-decorator="['dataProject', validatorRules.required]"/>
          </a-form-item>
        </a-col>

        <a-col :md="24" :sm="24">
          <a-form-item
            :labelCol="labelCol2"
            :wrapperCol="wrapperCol2"
            label="数据来源">
            <m-dict-select-tag placeholder="请选择数据来源" dictCode="ETL_SOURCE" :required="false"
                               :style="{width:'calc(100% - 85px) !important'}" class="loginList-select" v-decorator="['etlSource', {}]"></m-dict-select-tag>
            <a @click="handleToggleSearch" class="m-l-6">
              {{ toggleSearchStatus ? '收起' : '更多配置' }}
              <a-icon :type="toggleSearchStatus ? 'up' : 'down'"/>
            </a>
          </a-form-item>

        </a-col>

        <template v-if='toggleSearchStatus'>
        <a-col :md="24" :sm="24">
          <a-form-item
            :labelCol="labelCol2"
            :wrapperCol="wrapperCol2"
            label="数仓版本">
            <a-input placeholder="请输入数仓版本" v-decorator="['dataVersion', {}]"/>
          </a-form-item>
        </a-col>
        <a-col :md="24" :sm="24">
          <a-form-item
            :labelCol="labelCol2"
            :wrapperCol="wrapperCol2"
            label="solr数据源">
            <a-select  placeholder="请输入solr数据源" :options="solrOptions"   v-decorator="['solrAddr', {}]">
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="24" :sm="24">
          <a-form-item
            :labelCol="labelCol2"
            :wrapperCol="wrapperCol2"
            label="所属系统">
            <m-dict-select-tag placeholder="请选择所属系统" dictCode="SYSTEM_CODE" :showFirstAll="true" :required="false"  class="loginList-select" v-decorator="['systemCode', {}]"></m-dict-select-tag>
          </a-form-item>
        </a-col>
        <a-col :md="24" :sm="24">
          <a-form-item
            :labelCol="labelCol2"
            :wrapperCol="wrapperCol2"
            label="项目后端地址">
            <a-input placeholder="请输入项目后端地址(空为使用默认地址)" v-decorator="['suncareV3Url', {}]"/>
          </a-form-item>
        </a-col>
        <a-col :md="24" :sm="24">
          <a-form-item
            :labelCol="labelCol2"
            :wrapperCol="wrapperCol2"
            label="报告后端地址">
            <a-input placeholder="请输入报告后端地址" v-decorator="['riskportalSolrUrl', {}]"/>
          </a-form-item>
        </a-col>
        </template>
        <a-col :md="24" :sm="24">
          <a-form-item
            :labelCol="labelCol2"
            :wrapperCol="wrapperCol2"
            label="备注">
            <a-input placeholder="请输入备注" v-decorator="['remark', {}]"/>
          </a-form-item>
        </a-col>
      </a-form>
    </a-spin>
    <div class="drawer-bootom-button">
      <a-button type="primary" @click="handleOk" style="margin-right: .8rem" v-show="!disableSubmit">提交</a-button>
      <a-button @click="handleCancel" v-show="!disableSubmit">取消</a-button>
    </div>
  </a-drawer>
</template>

<script>

import pick from 'lodash/pick'
import moment from "moment"
import {httpAction,getAction} from '@/api/manage'
import MDictSelectTag from '@/components/dict_medical/MDictSelectTag'


export default {
  name: "SysDatasourceModal",
  components: {
    MDictSelectTag,

  },
  data() {
    return {
      title: "操作",
      visible: false,
      toggleSearchStatus:false,
      model: {},
      dictEtlSourceOptions:[],
      databaseOptions:[],
      solrOptions:[],
      labelCol: {
        xs: {span: 24},
        sm: {span: 5},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 16},
      },
      labelCol2: {
        xs: {span: 24},
        sm: {span: 5},
      },
      wrapperCol2: {
        xs: {span: 24},
        sm: {span: 19},
      },
      confirmLoading: false,
      form: this.$form.createForm(this),
      validatorRules: {
        required: {rules: [{required: true, message: '这是必填项!'}, {whitespace: true, message: '值不能是空格!'}]},
        requiredOnly: {rules: [{required: true, message: '这是必填项!'}]},
      },
      url: {
        add: "/system/sysDatasource/add",
        edit: "/system/sysDatasource/edit",
        queryDatabaseList:"/system/sysDatabase/queryList"
      },
    }
  },
  mounted() {
    getAction(this.url.queryDatabaseList).then(res => {
      if (res.success) {
        res.result.forEach(item => {
          this.databaseOptions.push({text: item.cnname, title: item.cnname, value: item.dbname})
        })
      }
    })

    getAction(this.url.queryDatabaseList,{dbtype:"solr"}).then(res => {
      if (res.success) {
        res.result.forEach(item => {
          this.solrOptions.push({text: item.cnname, title: item.cnname, value: item.dbname})
        })
      }
    })
  },
  methods: {
    handleToggleSearch(){
      this.toggleSearchStatus = !this.toggleSearchStatus;
    },
    add(record) {
      let newRecord
      if (record) {
        newRecord = {...record}
        delete newRecord.name
        delete newRecord.id
      } else {
        newRecord = {}
      }
      this.edit(newRecord);
    },
    edit(record) {
      this.form.resetFields();
      this.model = Object.assign({}, record);
      this.visible = true;
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.model, 'code', 'dataProject', 'dataVersion', 'databaseSource', 'etlSource', 'name', 'remark', 'solrAddr','systemCode',
          'suncareV3Url','riskportalSolrUrl'))
        //时间格式化
      });

    },
    close() {
      this.$emit('close');
      this.visible = false;
    },
    handleOk() {
      const that = this;
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          that.confirmLoading = true;
          let httpurl = '';
          let method = '';
          if (!this.model.id) {
            httpurl += this.url.add;
            method = 'post';
          } else {
            httpurl += this.url.edit;
            method = 'put';
          }
          let formData = Object.assign(this.model, values);
          //时间格式化

          console.log(formData)
          httpAction(httpurl, formData, method).then((res) => {
            if (res.success) {
              that.$message.success(res.message);
              that.$emit('ok');
            } else {
              that.$message.warning(res.message);
            }
          }).finally(() => {
            that.confirmLoading = false;
            that.close();
          })


        }
      })
    },
    handleCancel() {
      this.close()
    },


  }
}
</script>

<style lang="less" scoped>
.drawer-bootom-button {
  position: absolute;
  bottom: -8px;
  width: 100%;
  border-top: 1px solid #e8e8e8;
  padding: 10px 16px;
  text-align: right;
  left: 0;
  background: #fff;
  border-radius: 0 0 2px 2px;
}

.drawer-bootom-button-left {
  position: absolute;
  bottom: -8px;
  width: 100%;
  border-top: 1px solid #e8e8e8;
  padding: 10px 16px;
  text-align: left;
  left: 0;
  background: #fff;
  border-radius: 0 0 2px 2px;
}
</style>
