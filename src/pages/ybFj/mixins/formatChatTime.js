//是否显示时间
export function isShowTime(thisTime,prevTime){
  let minute = 1000 * 60;
  //是否显示时间
  let flag = false
  if(!prevTime){
    flag = true
  }else if(new Date(thisTime).getTime()-new Date(prevTime).getTime()>=10*minute){
    flag = true
  }
  return flag
}

//格式化时间
export function formatChatTime(thisTime,prevTime) {
  let flag = isShowTime(thisTime,prevTime)
  if(!flag){
    return ''
  }
  let timestamp = parseInt(new Date(thisTime).getTime() / 1000)//参数时间戳
  let curTimestamp = parseInt(new Date().getTime() / 1000); //当前时间戳
  let timestampDiff = curTimestamp - timestamp; // 参数时间戳与当前时间戳相差秒数

  let curDate = new Date(curTimestamp * 1000); // 当前时间日期对象
  let tmDate = new Date(timestamp * 1000);  // 参数时间戳转换成的日期对象

  let Y = tmDate.getFullYear(), m = tmDate.getMonth() + 1, d = tmDate.getDate();
  let H = tmDate.getHours(), i = tmDate.getMinutes(), s = tmDate.getSeconds();
  if (timestampDiff < 60) { // 一分钟以内
    return "刚刚";
  } else if (timestampDiff < 3600) { // 一小时前之内
    return Math.floor(timestampDiff / 60) + "分钟前";
  } else if (curDate.getFullYear() == Y && curDate.getMonth() + 1 == m && curDate.getDate() == d) {
    return '今天 ' + pairNum(H) + ':' + pairNum(i);
  } else {
    var newDate = new Date((curTimestamp - 86400) * 1000); // 参数中的时间戳加一天转换成的日期对象
    if (newDate.getFullYear() == Y && newDate.getMonth() + 1 == m && newDate.getDate() == d) {
      return '昨天 ' + pairNum(H) + ':' + pairNum(i);
    } else if (curDate.getFullYear() == Y) {
      return pairNum(m) + '月' + pairNum(d) + '日 ' + pairNum(H) + ':' + pairNum(i);
    } else {
      return Y + '年' + pairNum(m) + '月' + pairNum(d) + '日 ' + pairNum(H) + ':' + pairNum(i);
    }
  }
}
// 给小于10的数字补 0
export function pairNum(num) {
  return (String(num).length == 1 ? '0' : '') + num;
}