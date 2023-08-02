import http from './interface'
export const $http = (url, method, data, json) => {
  //设置请求前拦截器
  http.interceptor.request = (config) => {
    // uni.showLoading({
    // 	title:'加载中...'
    // })
    config.header = {
      'content-type': json ? 'application/json' : 'application/x-www-form-urlencoded',
      "Authorization": uni.getStorageSync('Authorization')
    }
  }
  //设置请求结束后拦截器
  http.interceptor.response = async (response) => {
    //判断返回状态 执行相应操作
    // uni.hideLoading()
    // 请根据后端规定的状态码判定
    if (response.statusCode === 401) { //token失效
      return response.data = await doRequest(response, url) //动态刷新token,并重新完成request请求
    } else {
      if (response.statusCode !== 200) {
        uni.showToast({
          title: '网络连接失败，请检查网络状态',
          icon: 'none'
        })
      }
    }
    if (response.data.code === 401) {
      uni.clearStorage()
      uni.redirectTo({
        url: '/pages/login/login'
      })
    }

    return response;
  }
  return http.request({
    method: method,
    url: url,
    dataType: 'json',
    data,
  })
}

async function login() {
  //返回环宇token所需的login code
  return new Promise(resolve => {
    uni.login({
      provider: 'weixin',
      success(loginRes) {
        resolve(loginRes.code)
      },
      fail() {}
    });
  })
}

async function doRequest(response, url) {
  // var code = await login()
  // var res = await get('/v1/oauth/refreshToken/code/'+code, {})
  // if (res && res.data.data.token) {
  // 	let config = response.config
  // 	uni.setStorageSync("token", res.data.data.token);
  // 	config.header['Authorization'] = res.data.data.token
  // 	let json = config.header["Content-Type"] === 'application/json'
  // 	const resold = await $http(url, config.method, {
  // 		...config.data
  // 	}, json)
  // 	return resold
  // } else {
  uni.clearStorage()
  uni.showToast({
    title: "授权失效",
    icon: 'none'
  })
  uni.redirectTo({
    url: '/pages/login/login'
  })
  return false
  // }
}

function postJson(url, data) {
  return $http(url, 'POST', data)
}

function get(url, data) {
  return $http(url, 'GET', data)
}

function post(url, data) {
  return $http(url, 'POST', data, true)
}

function put(url, data) {
  return $http(url, 'PUT', data, true)
}

function del(url, data) {
  return $http(url, 'DELETE', data, true)
}

function postURL(url, data) {
  let postUrl = url + '?'
  for (let key in data) {
    if (key !== 'baseUrl')
      postUrl += `${key}=${data[key]}&`
  }
  postUrl = postUrl.slice(0, -1)
  return $http(postUrl, 'POST', data, true)
}

export default {
  postJson,
  get,
  post,
  put,
  del,
  postURL
}