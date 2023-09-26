let localAddress = 'http://localhost:8085/'
// let localAddress = 'http://10.2.74.7:8082/'
// let localAddress = 'https://ybjg.lingwww.com/'
let prodAddress = 'https://ybjg.lingwww.com/'// 咸阳
let riskportalShowIp = 'https://ybjg.lingwww.com/'//上饶
// 生产环境切换 ↓↓↓↓↓↓

//连接本地后台时用下面这个配置
let baseUrl =  '/suncare_v4'
//连接服务端后台时用下面这个配置
// let baseUrl = '/prod_suncare_v4'

//生产
let routerBase = '/'
let riskportalUrl = localAddress + '/riskportal_v3-test'

let riskctrlreportUrl = prodAddress + '/rpv4-admin'
let jeditorRouter = "";
let riskportalBaseUrl = '/rpv4-admin-pro'//风控报告新请求地址

//当前启动系统编码
let VUE_APP_SYSCODE = process.env.VUE_APP_SYSCODE
if(!VUE_APP_SYSCODE){
  VUE_APP_SYSCODE = 'search'//默认启动的系统编码
}
//设置多系统配置
const systemParam = {
  search:{
    systemCode:'search',
    systemTitle:'医保在线洞察平台',
    logoTitle:'医保在线洞察平台',
    routerBase:'/search'
  },
}

// 生产配置路径，部分文件需要用到
if (process.env.NODE_ENV === 'production') {
  baseUrl = '/suncare_v3'
  routerBase = systemParam[VUE_APP_SYSCODE].routerBase
}


const casPrefixUrl = 'http://cas.example.org:8443/cas'
// 使用方法  vue文件中：this.$config.   js文件除了以上几个直接引用，其他在main.js里面使用Vue.use注入
// 只用于本地，服务器上有另外的生产配置覆盖
module.exports = {
  'prodAddress': prodAddress,
  'localAddress': localAddress,
  'baseUrl': baseUrl,
  'routerBase': routerBase,
  'riskportalUrl': riskportalUrl,
  'riskctrlreportUrl': riskctrlreportUrl,
  'publicPath': routerBase.length === 1 ? '' : routerBase,
  'domianURL': baseUrl,
  'casPrefixUrl': casPrefixUrl,
  'imgDomainURL': baseUrl + '/sys/common/view',
  'downloadUrl': baseUrl + '/sys/common/download',
  'pdfDomainURL': baseUrl + '/sys/common/pdf/pdfPreviewIframe',
  'jeditorRouter': jeditorRouter,
  'showReportUrl': riskportalShowIp + 'riskctrlreport',
  'riskportalShowIp': riskportalShowIp,
  'riskRpv4': riskportalShowIp + "rpv4-test",//门户地址
  'riskRpv4Manger': riskportalShowIp + "riskportal_v3-test",//后台上传地址
  'riskportalBaseUrl': riskportalBaseUrl,
  'shangrao': {
    suncare_v3: 'http://localhost:8080/suncare_v3',
    // suncare_v3: 'https://shangrao.lingwww.com/suncare_v3',
    // riskportal_solr: 'http://10.175.33.173:8082/riskportal_solr',
    riskportal_solr: 'http://localhost:9090/riskportal_solr'
  },
  'shangrao3': {
    suncare_v3: 'http://localhost:8080/suncare_v3test',
    // suncare_v3: 'http://10.175.33.85/suncare_v3',
    // suncare_v3: 'https://shangrao.lingwww.com/suncare_v3',
    // riskportal_solr: 'http://10.175.33.173:8082/riskportal_solr'
    riskportal_solr: 'http://localhost:9090/riskportal_solr-test'
  },
  'shangrao5': {
    suncare_v3: 'http://localhost:8080/suncare_v3',
    // suncare_v3: 'http://10.175.33.85/suncare_v3',
    // suncare_v3: 'https://shangrao.lingwww.com/suncare_v3',
    // riskportal_solr: 'http://10.175.33.173:8082/riskportal_solr'
    riskportal_solr: 'http://localhost:9090/riskportal_solr-test'
  },
  'shangrao6': {
    suncare_v3: 'http://localhost:8080/suncare_v3',
    riskportal_solr: 'http://localhost:9090/riskportal_solr-test'
  },
  'shangrao7': {
    suncare_v3: 'http://localhost:8080/suncare_v3',
    riskportal_solr: 'http://localhost:9090/riskportal_solr-test'
  },
  'funan': {
    suncare_v3: 'http://localhost:8080/suncare_v3',
    riskportal_solr: 'http://10.63.80.131:8082/riskportal_solr'
  },
  'gaomi': {
    suncare_v3: 'http://localhost:8080/suncare_v3',
    riskportal_solr: 'http://10.63.80.131:8082/riskportal_solr'
  },
  'heze': {
    suncare_v3: 'http://localhost:8080/suncare_v3',
    riskportal_solr: 'http://10.63.80.131:8082/riskportal_solr'
  },
  'jieshou1': {
    suncare_v3: 'http://localhost:8080/suncare_v3',
    riskportal_solr: 'http://10.63.80.131:8082/riskportal_solr'
  },
  'jiaxiang': {
    suncare_v3: 'http://localhost:8080/suncare_v3',
    riskportal_solr: 'http://10.2.74.7/rpv4-solr-admin'
  },
  'jiaxiang3': {
    suncare_v3: 'http://localhost:8080/suncare_v3',
    riskportal_solr: 'http://10.2.74.7/rpv4-solr-admin'
  },
  'ganzhou': {
    suncare_v3: 'http://localhost:8080/suncare_v3',
    riskportal_solr: 'http://localhost:9090/riskportal_solr-test'
  },
  'yongfu': {
    suncare_v3: 'http://localhost:8080/suncare_v3',
    riskportal_solr: 'http://localhost:9090/riskportal_solr-test'
  },
  'yongfu__gp': {
    suncare_v3: 'http://localhost:8080/suncare_v3',
    riskportal_solr: 'http://localhost:9090/riskportal_solr-test'
  },
  //网站标志 区分不同系统
  'systemCode':systemParam[VUE_APP_SYSCODE].systemCode,
  'systemTitle':systemParam[VUE_APP_SYSCODE].systemTitle,
  'logoTitle':systemParam[VUE_APP_SYSCODE].logoTitle,
}
