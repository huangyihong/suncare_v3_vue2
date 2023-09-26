/**
 * 基础数据模块 通用新增修改删除js
 */
import { mapGetters } from 'vuex'
import { httpAction,getAction } from '@/api/manage'
import { BatchTaskMixin } from '@/pages/config/modules/MedicalAuditLog/BatchTaskMixin'

export const CommonAddEditMixin = {
  mixins:[BatchTaskMixin],
  components: {

  },
  data(){
    return {
      visible: false,
      confirmLoading: false,
      userInfoBean: null,//登录用户信息
      readonly:false,//只读
      form: this.$form.createForm(this),
      params:{},//传过来的参数
      model: {},//当前form的model

    }
  },
  beforeMount(){
    this.userInfoBean = this.userInfo()
  },
  methods:{
    ...mapGetters(["userInfo"]),
    //设置新增字段信息
    setCreatField(record){
      record.createStaffName = this.userInfoBean.realname;
      record.createStaff = this.userInfoBean.id;
      record.createTime = new Date();
      return record;
    },
    //设置修改字段信息
    setUpdateField(record){
      record.updateStaffName = this.userInfoBean.realname;
      record.updateStaff = this.userInfoBean.id;
      record.updateTime = new Date();
      return record;
    },
    //设置删除字段信息
    setDeleteField(record){
      record.deleteStaffName = this.userInfoBean.realname;
      record.deleteStaff = this.userInfoBean.id;
      record.deleteTime = new Date();
      return record;
    },
    close () {
      this.$emit('close');
      this.visible = false;
    },
    //确定保存
    handleOk () {
      if(this.model.fntype==='delete'||this.model.fntype==='batchDelete'){
        if(this.model.id){
          this.delete();
        }else{
          this.deleteAll();//全部删除
        }
      }else{
        this.saveOrUpdate();
      }
    },
    handleCancel () {
      this.close()
    },
    //新增
    add () {
      let record = {};
      record.fntype='add';
      this.edit(record);
    },
    //修改赋值之前设值
    beforSetEdit(record){
      this.readonly = true;
      this.form.resetFields();
      this.model = Object.assign({}, record);
      if(this.model.fntype==='add'){
        this.model = this.setCreatField(this.model);
        this.readonly = false;
      }
      if(this.model.fntype==='update'){
        this.model = this.setUpdateField(this.model);
        this.readonly = false;
      }
      if(this.model.fntype==='delete'||this.model.fntype==='batchDelete'){
        this.model = this.setDeleteField(this.model);
        this.readonly = true;
      }
      if(this.model.fntype==='batchDelete'&&!this.model.id) {//全部删除
        this.params = record.params;
      }
      this.visible = true;
    },
    save(values){
      const that = this;
      that.confirmLoading = true;
      let httpurl = '';
      let method = '';
      if(!that.model.id||(that.model.id&&that.model.fntype==='add')){
        httpurl+=that.url.add;
        method = 'post';
      }else{
        httpurl+=that.url.edit;
        method = 'put';
      }
      let formData = Object.assign(that.model, values);
      httpAction(httpurl,formData,method).then((res)=>{
        if(res.success){
          that.$message.success(res.message);
          that.$emit('ok');
          that.close();
        }else{
          that.$message.warning(res.message);
        }
      }).finally(() => {
        that.confirmLoading = false;
      })
    },
    //选择记录删除
    delete(){
      const that = this;
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          that.confirmLoading = true;
          let formData = Object.assign(that.model, values);
          httpAction(this.url.del,formData,'put').then((res)=>{
            if(res.success){
              that.$message.success(res.message);
              that.$emit('ok');
              that.close();
            }else{
              that.$message.warning(res.message);
            }
          }).finally(() => {
            that.confirmLoading = false;
          })
        }
      })
    },
    //全部删除
    deleteAll() {
      const that = this;
      that.confirmLoading = true;
      that.params.deleteReason1 = that.form.getFieldValue('deleteReason');
      getAction(that.url.delAll,that.params,'get').then((res)=>{
        if(res.success){
          that.$message.success(res.message);
          that.$emit('ok');
          that.close();
        }else{
          that.$message.warning(res.message);
        }
      }).finally(() => {
        that.confirmLoading = false;
      })

      //打开批量操作日志
      this.openImportTaskPage()
    },
  }
}