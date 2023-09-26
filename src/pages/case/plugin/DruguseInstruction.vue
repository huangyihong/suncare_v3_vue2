<template>
    <a-spin :spinning="confirmLoading">
        <h3 class="m-b-6" style="font-weight: bold">说明书：</h3>
        <at-table
                size="small"
                :pagination="false"
                :columns="[
                                    {title: '药品名称',dataIndex: 'drugName',scopedSlots: { customRender: 'name' }},
                                    {title: '生产企业',dataIndex: 'enterprise'},
                                    {title: '修订日期',dataIndex: 'revisionDate',width: 180}
                                ]"
                :dataSource="dataSource"
                :loading="confirmLoading">
            <template slot="name" slot-scope="text, record, index">
                <a @click="loadPdf(record.filenames)" v-if="record.filenames && record.filenames.length > 0">{{text}}</a>
                <span v-else>{{text}}</span>
            </template>
            <a slot="action" slot-scope="text, record, index" @click="selectData.splice(index, 1)">
                移除
            </a>
        </at-table>
        <pdf-view ref="pdfView" height="800px" v-show="pdfViewShow"></pdf-view>
    </a-spin>
</template>

<script>
  import { getAction, postAction } from '@/api/manage'
  import JUpload from '@/components/jeecg/JUpload'
  import PdfView from '@/pages/case/plugin/PdfView'
// 酮咯酸氨丁三醇注射液
  const jsxTemp = {
    props: ['jsx'],
    render() {
      return (
        this.jsx
      )
    }
  }
  export default {
    name: 'DruguseInstruction',
    components: {jsxTemp, JUpload, PdfView},
    props: {
      selectData: {
        type: Array,
        default: [{
          name: '药品测试1',
          code: '86900000000041'
        }, {
          name: '药品测试2',
          code: 'X-001-FYB'
        }]
      }
    },
    data() {
      this.url = {
        drugInstruction: '/config/medicalDrugInstruction/listByItemCodes'
      }
      return {
        confirmLoading: false,
        pdfViewShow: false,
        dataSource: [],
        dataMap: {},
        fields: [{
          name: '说明书编码',
          code: 'code'
        }, {
          name: '说明书修订日期',
          code: 'revisionDate'
        }, {
          name: '说明书药品名称',
          code: 'name'
        }, {
          name: '规格',
          code: 'specificaion'
        }, {
          name: '执行标准',
          code: 'standard'
        }, {
          name: '生产企业名称',
          code: 'enterprise'
        }, {
          name: '说明书来源',
          code: 'source'
        }, {
          name: '说明书附件',
          code: 'filenames',
          customRender: val => {
            return <j-upload disabled={true} value={val}/>
          }
        }],

      }
    },
    watch: {
      selectData: {
        immediate: true,
        handler(val) {
          console.log('selectData',val)
          this.pdfViewShow = false
          if (val && val.length > 0) {
            let codes = val.map(r => r.code)
            this.loadInstruction(codes)
          } else {
            this.dataSource = []
          }
        }
      }
    },
    methods: {
      loadInstruction(codes) {
        this.confirmLoading = true

        getAction(this.url.drugInstruction, { itemCodes: codes.join(',') }).then(res => {
          if (res.success) {
            let data = res.result
            // this.dataMap = data
            // console.log('this.dataMap', this.dataMap)
            this.dataSource = []
            for (let code of codes) {
              let list = data[code]
              if(!list || list.length === 0){
                continue
              }

              for(let [index,item] of list.entries()){
                item.drugCode = code
                item.drugName = this.selectData.find(r => r.code === code).name
                if(item.filenames){
                  let filePaths = item.filenames.split(',')
                  if(filePaths.length > 0){
                    list[index] = filePaths.map(r => ({...item,filenames: r }))
                  }
                }
              }
              list = list.flat(1)

              if(list.length === 1){
                this.dataSource.push(list[0])
              } else {
                this.dataSource.push(...list.map((r,i) => ({...r,name: `${r.name}(${i + 1})`})))
              }
            }
            if(this.dataSource.length > 0){
              this.loadPdf(this.dataSource[0].filenames)
            }
          } else {
            this.$message.warning(res.message);
          }
        }).finally(() => {
          this.confirmLoading = false
        })
      },
      loadPdf(filenames){
        let suffix = filenames.substring(filenames.lastIndexOf('.') + 1).toLowerCase()
        if (suffix === "png" || suffix === "jpeg" || suffix === "bmp" || suffix === "jpg") {
          this.pdfViewShow = true
          this.$refs.pdfView.loadImg('/sys/common/view/' + filenames)
        } else if(suffix === "doc" || suffix === "docx" ){
          this.pdfViewShow = true
          this.$refs.pdfView.loadData('/sys/common/wordPreview/' + filenames)
        } else if(suffix === "pdf"){
          this.pdfViewShow = true
          this.$refs.pdfView.loadData('/sys/common/download/' + filenames)
        } else {
          this.$message.warning('附件格式不支持显示');
        }
      }
    },
    computed: {}
  }
</script>
<style scoped>

</style>
