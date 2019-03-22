import axios from 'axios'
import qs from 'qs'
import store from '../../store'

// 获取 当前环境的API
let BASE_URL = process.env.API || ''
console.log('BASE_URL', BASE_URL)

// 全局配置URL
axios.defaults.baseURL = BASE_URL

// 请求拦截器
axios.interceptors.request.use(function (config) {
  if (config.method === 'post') {
    config.data = qs.stringify(config.data)
  }
  console.log('request', config)
  return config
}, function (err) {
  // 对请求错误做些什么
  console.log(err)
  return Promise.reject(err)
})

// 响应拦截器
axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  console.log('response', response)
  return response.data
}, function (err) {
  // 对响应错误做点什么
  console.log(err)
  // if (err.response.status === 403) {
  //   console.log()
  // }
  // if (err.response.status === 500) {

  // }
  // if (err.response.status === 502) {

  // }
  // if (err.response.status === 404) {

  // }
  return Promise.reject(err)
})

// 导出配置
export default {
  request (url, data) {
    data = data || {}
    let sid = store.state.session.sid || localStorage.getItem('sid')
    data['sid'] = sid
    return axios.post(url, data)
  }
}
