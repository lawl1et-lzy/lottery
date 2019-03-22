import axios from 'axios';
import qs from 'qs'; 
import store from '../../store'

let BASE_URL = process.env.NODE_ENV === 'development' ? 'http://yan.eeseetech.cn' : '';
BASE_URL += '/$SERVICE';
console.log('参数',process.env.BRANCH_ENV)
export default {
  request (service, data) {
    let url = BASE_URL;
    url = url.replace('$SERVICE', service);
    data = (data === undefined) ? {} : data;
    if (data.mock) {
      url = url.replace('http://yan.eeseetech.cn', 'http://localhost:3000');
      delete data.mock
    }
    let sid = store.state.session.sid || localStorage.getItem('sid');
    data['sid'] = sid;
    return axios.post(url, qs.stringify(data), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(res => {
      if (res.status === 200) {
        return res.data
      } else {
        return Promise.reject(res.data)
      }
    })
  },
  getUrlParamsBy (name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
    var r = window.location.hash.split('?')[1]
    if (r !== undefined) {
      r = r.match(reg)
      if (r != null) return unescape(r[2])
    }
    return null
  },
  navigateWithSid (service, data) {
    let url = BASE_URL;
    url = url.replace('$SERVICE', service);
    data = data === undefined ? {} : data;
    let sid = store.state.session.sid || localStorage.getItem('sid');
    data['sid'] = sid;
    let param = '?';
    for (let key in data) {
      param += `${key}=${data[key]}&`
    }
    url += param;
    window.location.assign(url)
  }
}
