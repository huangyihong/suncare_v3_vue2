export function filterOption(input, option) {
  let val = input
  let item = option.componentOptions.children[0].text

  if(val == item){//把value相同的搜索出来
    return true;
  }
  if(item.indexOf(val) != -1){//名称中包含的搜索出来
    return true;
  }
  if(val){
    val = val.replace(/，/ig,',');
    var valArr1 = val.split('#')
    for(var j = 0; j < valArr1.length; j++) {
      var flag = true;
      var valArr2 = valArr1[j].split(',')
      for(var i = 0; i < valArr2.length; i++) {
        if(item.indexOf(valArr2[i]) == -1){//不包含
          flag =  false
        }
      }
      if(flag){
        return true
      }
    }
    return false
  }
  return false;//不知道的就不管了
}