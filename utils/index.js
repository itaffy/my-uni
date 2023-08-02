//object转string,用于签名计算
export function obj2str(args, url) {
  let keys = Object.keys(args)
  keys = keys.sort() //参数名ASCII码从小到大排序（字典序）；
  let newArgs = {}
  keys.forEach(function(key) {
    if (args[key] !== null && args[key] !== "" && args[key] !== 'undefined') { //如果参数的值为空不参与签名；
      newArgs[key] = args[key] //参数名区分大小写；
    }
  })
  Object.assign(newArgs, {
    key: url.toUpperCase()
  })
  let string = ''
  for (let k in newArgs) {
    string += '&' + k + '=' + newArgs[k]
  }
  string = md5(string.substr(1)).toUpperCase()
  return string
}

// 对象转路由参数
export function routeUrlParms(parms) {
  let str = ''
  let num = 0
  for (let keys in parms) {
    let item = (parms[keys] || parms[keys] == 0) ? parms[keys] : ''
    num++;
    if (num == 1) {
      str += '?' + keys + '=' + item
    } else {
      str += '&' + keys + '=' + item
    }
  }
  return str
}