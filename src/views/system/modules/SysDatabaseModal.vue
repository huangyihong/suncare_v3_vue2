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
            label="数据库编码">
            <a-input placeholder="请输入数据库编码" v-decorator="['dbname', validatorRules.required]"
            />
          </a-form-item>
        </a-col>
        <a-col :md="24" :sm="24">
          <a-form-item
            :labelCol="labelCol2"
            :wrapperCol="wrapperCol2"
            label="数据库中文名称">
            <a-input placeholder="请输入数据库中文名称" v-decorator="['cnname', validatorRules.required]"/>
          </a-form-item>
        </a-col>
        <a-col :md="24" :sm="24">
          <a-form-item
            :labelCol="labelCol2"
            :wrapperCol="wrapperCol2"
            label="数据库类型">
            <m-dict-select-tag dictCode="DB_TYPE" :required="false"  class="loginList-select" v-decorator="['dbtype', validatorRules.required]"  @change="change"></m-dict-select-tag>
          </a-form-item>
        </a-col>
        <a-col :md="24" :sm="24">
          <a-form-item
            :labelCol="labelCol2"
            :wrapperCol="wrapperCol2"
            label="驱动名称">
            <a-input placeholder="请输入驱动名称" v-decorator="['dbver', {}]"/>
          </a-form-item>
        </a-col>
        <a-col :md="24" :sm="24">
          <a-form-item
            :labelCol="labelCol2"
            :wrapperCol="wrapperCol2"
            label="连接的URL">
            <a-input placeholder="请输入连接的URL" v-decorator="['url', validatorRules.requiredOnly]" />
          </a-form-item>
        </a-col>
        <a-col :md="24" :sm="24">
          <a-form-item
            :labelCol="labelCol2"
            :wrapperCol="wrapperCol2"
            label="数据库用户名">
            <a-input placeholder="请输入数据库用户名" v-decorator="['dbUser', validatorRules.required]"/>
          </a-form-item>
        </a-col>
        <a-col :md="24" :sm="24">
          <a-form-item
            :labelCol="labelCol2"
            :wrapperCol="wrapperCol2"
            label="数据库密码">
            <a-input-password placeholder="请输入数据库密码" v-decorator="['dbPassword', validatorRules.required]"
                              :visibilityToggle="false"/>
          </a-form-item>
        </a-col>
       <!-- <a-col :md="24" :sm="24">
          <a-form-item
            :labelCol="labelCol2"
            :wrapperCol="wrapperCol2"
            label="项目地">

            <m-dict-select-tag dictCode="SOLR_DATA_SOURCE" :required="false" class="loginList-select" v-decorator="['dataSource', validatorRules.required]" ></m-dict-select-tag>

          </a-form-item>
        </a-col>-->
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
      <a-button type="primary" @click="testDbConnection" style="float: left">测试连接</a-button>
      <a-button type="primary" @click="handleOk" style="margin-right: .8rem" v-show="!disableSubmit">提交</a-button>
      <a-button @click="handleCancel" v-show="!disableSubmit">取消</a-button>
    </div>

  </a-drawer>
</template>

<script>
import {httpAction, getAction} from '@/api/manage'
import pick from 'lodash/pick'
import MDictSelectTag from '@/components/dict_medical/MDictSelectTag'


export default {
  name: "SysDatabaseModal",
  components: {
    MDictSelectTag
  },
  data() {
    return {
      title: "操作",
      visible: false,
      dictOptions: [],
      model: {},
      labelCol: {
        xs: {span: 24},
        sm: {span: 10},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 14},
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
        add: "/system/sysDatabase/add",
        edit: "/system/sysDatabase/edit",
        testDbConnection: "/system/sysDatabase/testDbConnection",
      },
      dbnameReadonly: false,
    }
  },
  beforeMount() {

  },
  methods: {
    change(val) {
      console.log("---",val)

      if(val=='sqlserver'){
        this.form.setFieldsValue({dbver:"com.microsoft.sqlserver.jdbc.SQLServerDriver",
          url:"jdbc:sglserver://127.0.0.1:1433;DatabaseName=dbName"})
      }
      if(val=='oracle'){
        this.form.setFieldsValue({dbver:"oracle.jdbc.driver.OracleDriver",
          url:"jdbc:oracle:thin:@192.168.119.66:20521:orcl"})
      }
      if(val=='hive'){
        this.form.setFieldsValue({dbver:"org.apache.hive.jdbc.HiveDriver",
          url:"jdbc:hive2://192.168.0.83:10000/database"})
      }
      if(val=='mysql'){
        this.form.setFieldsValue({dbver:"com.mysql.jdbc.Driver",
          url:"jdbc:mysql://127.0.0.1:3307/suncare_v4_test8"})
      }
      if(val=='solr'){
        this.form.setFieldsValue({dbver:"",
          url:"http://127.0.0.1:8983/solr"})
      }
      if(val=='greenplum'){
        this.form.setFieldsValue({dbver:"org.postgresql.Driver",
          url:"jdbc:postgresql://localhost:5432/db"})
      }

    },
    add(record) {
      let newRecord
      if (record) {
        newRecord = {...record}
        delete newRecord.dbname
        delete newRecord.id
      } else {
        newRecord = {}
      }
      this.edit(newRecord);
    },
    edit(record) {
      this.form.resetFields();
      this.model = Object.assign({}, record);
      this.dbnameReadonly = !!this.model.dbname
      this.visible = true;
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.model, 'dbname', 'cnname', 'dbtype',
          'dbver', 'url', 'dbUser', 'dbPassword', 'dataSource', 'remark'))
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
          if (!this.dbnameReadonly) {
            httpurl += this.url.add;
            method = 'post';
          } else {
            httpurl += this.url.edit;
            method = 'put';
          }
          let formData = Object.assign(this.model, values);

          console.log(formData)
          httpAction(httpurl, formData, method).then((res) => {
            if (res.success) {
              that.$message.success(res.message);
              that.$emit('ok');
              that.$emit('reloadDb');
              that.close();
            } else {
              that.$message.warning(res.message);
            }
          }).finally(() => {
            that.confirmLoading = false;
          })
        }
      })
    },
    handleCancel() {
      this.close()
    },

    testDbConnection() {
      const that = this;
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          that.confirmLoading = true;
          let formData = Object.assign(this.model, values);

          console.log(formData)
          httpAction(that.url.testDbConnection, formData, 'post').then((res) => {
            if (res.success) {
              that.$message.success(res.message);
            } else {
              that.$message.warning(res.message);
            }
          }).finally(() => {
            that.confirmLoading = false;
          })
        }
      })
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