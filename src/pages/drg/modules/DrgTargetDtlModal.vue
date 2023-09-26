<template>
  <m-modal
    ref="modal"
    centered
    :title="title"
    :width="1000"
    :bodyStyle="{padding: '10px 24px 0 24px'}"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :maskClosable="false"
    destroyOnClose
    @cancel="handleCancel"
    @max="isMax=> {isMax? heightRatio+=0.2: heightRatio-=0.2}"
    :footer="null">
    <a-layout >
      <a-layout-sider style="background-color: white;width:200px;">
        <a-anchor class="m-t-20" :affix="false" showInkInFixed :getContainer="modalBody" @click="handleClick">
          <a-anchor-link href="#mdcInfo" title="MDC入组"/>
          <a-anchor-link href="#adrgInfo" title="ADRG入组"/>
          <a-anchor-link href="#drgInfo" title="DRG入组"/>

        </a-anchor>
      </a-layout-sider>
      <a-layout-content id="content"  style="background: #f0f2f5;overflow: auto" :style="{height:tabHeight}">
        <div id="mdcInfo" class="content-item">
          <a-card hoverable :loading="loading">
            <div>
              <div class="content-box">
                <div class="content-label">主诊断编码</div><div class="content-text">{{bean.mdcDiagCode||'—'}}</div>
              </div>
              <div class="content-box">
                <div class="content-label">主诊断名称</div><div class="content-text">{{bean.mdcDiagName||'—'}}</div>
              </div>
              <div class="content-box">
                <div class="content-label">是否器官移植,呼吸机使用超过96小时或ECMO</div><div class="content-text">{{bean.mdcaFlag||'—'}}</div>
              </div>
              <div class="content-box">
                <div class="content-label">是否出生<29天内的新生儿</div><div class="content-text">{{bean.babyFlag||'—'}}</div>
              </div>
              <div class="content-box">
                <div class="content-label">是否HIV感染疾病及相关操作</div><div class="content-text">{{bean.hivFlag||'—'}}</div>
              </div>
              <div class="content-box">
                <div class="content-label">是否多发严重创伤</div><div class="content-text">{{bean.multWoundFlag||'—'}}</div>
              </div>
              <div class="content-box">
                <div class="content-label">MDC入组结果</div><div class="content-text">{{visitDrgBean.mdc||'—'}} {{visitDrgBean.mdcName}}</div>
              </div>
            </div>
          </a-card>
        </div>
        <div id="adrgInfo" class="content-item">
          <a-card hoverable  :loading="loading">
            <div>
              <div class="content-box">
                <div class="content-label">主要手术和操作编码</div><div class="content-text">{{bean.surgeryCodes||'—'}}</div>
              </div>
              <div class="content-box">
                <div class="content-label">主要手术和操作名称</div><div class="content-text">{{bean.surgeryNames||'—'}}</div>
              </div>
              <div class="content-box">
                <div class="content-label">主要手术和操作时间</div><div class="content-text">{{bean.surgeryTimes||'—'}}</div>
              </div>
              <div class="content-box">
                <div class="content-label">是否可找到对应分组条件的ADRG组</div><div class="content-text">{{bean.meetAdrgFlag||'—'}}</div>
              </div>
              <div class="content-box">
                <div class="content-label">是否手术室手术</div><div class="content-text">{{bean.roomSurgeryFlag||'—'}}</div>
              </div>
              <div class="content-box">
                <div class="content-label">ADRG入组结果</div><div class="content-text">{{visitDrgBean.adrg||'—'}} {{visitDrgBean.adrgName}}</div>
              </div>
            </div>
          </a-card>
        </div>
        <div id="drgInfo" class="content-item">
          <a-card hoverable  :loading="loading">
            <div>
              <div class="content-box">
                <div class="content-label">是否需要判断并发症或合并症</div><div class="content-text">{{bean.judgeSecDiagFlag||'—'}}</div>
              </div>
              <div class="content-box">
                <div class="content-label">是否有效MCC</div><div class="content-text">{{bean.mcc||'—'}}</div>
              </div>
              <div class="content-box">
                <div class="content-label">是否有效CC</div><div class="content-text">{{bean.cc||'—'}}</div>
              </div>
              <div class="content-box">
                <div class="content-label">DRG入组结果</div><div class="content-text">{{visitDrgBean.drg||'—'}} {{visitDrgBean.drgName}}</div>
              </div>
            </div>
          </a-card>
        </div>
      </a-layout-content>
    </a-layout>
  </m-modal>
</template>

<script>
import { getAction } from '@/api/manage'
import { mapGetters } from 'vuex'
import DetailList from '@/components/tools/DetailList'
const DetailListItem = DetailList.Item
export default {
  name: "DrgTargetDtlModal",
  components: {
    DetailList,
    DetailListItem
  },
  data() {
    return {
      title: "DRG分组逻辑查看",
      visible: false,
      model: {},
      confirmLoading: false,
      heightRatio: 0.8,

      url: {
        query:'/drg/drgTask/queryDrgTargetDtl',
      },

      bean:{},
      visitDrgBean:{},
      loading:false,
    }
  },
  computed: {
    ...mapGetters(["height"]),
    tabHeight() {
      let y = this.height * this.heightRatio - 111
      return (y < 200 ? 200 : y) + 'px'
    }
  },
  methods: {
    modalBody() {
      return document.getElementById('content');
    },
    handleClick(e, link) {
      e.preventDefault();
    },
    close() {
      this.$emit('close');
      this.visible = false;
    },
    handleCancel() {
      this.close()
    },
    showData(record){
      this.visible = true;
      this.loadDrgTargetDtl(record.id)
    },
    loadDrgTargetDtl(visitDrgId){
      this.loading = true
      getAction(this.url.query, {visitDrgId}).then((res) => {
        if (res.success) {
          this.bean = res.result
          if(this.bean&&this.bean.visitDrg){
            this.visitDrgBean = this.bean.visitDrg
          }
        }else{
          this.$message.warning(res.message);
        }
      }).finally(() => {
        this.loading = false;
      })
    },
  }
}
</script>
<style lang="less" scoped>
  .content-item {
    padding: 10px 10px 0 10px;
    .ant-card-hoverable{
      cursor: auto;
    }
  }
  .content-item:last-child {
    padding: 10px 10px 10px 10px;
  }
  .content-box{
    display:flex;
    width:600px;
    border-top: 0px solid #dbdbdb;
    border-left: 1px solid #dbdbdb;
    border-right: 1px solid #dbdbdb;
    border-bottom: 1px solid #dbdbdb;
  }
  .content-box:first-child{
    border-top: 1px solid #dbdbdb;
  }
  .content-label{
    width:200px;
    background-color: #f0f2f5;
    padding:6px;
  }
  .content-text{
    width:400px;
    padding:6px;
    word-wrap: break-word;
  }
</style>