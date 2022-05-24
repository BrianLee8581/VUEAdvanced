import axios from 'axios';
import { Notification, MessageBox, Message, Loading } from 'element-ui'
axios.defaults.headers['Content-Type'] = 'application/json;charset=UTF-8';

//创建axios实例
const service = axios.create({
    // axios中请求配置有baseURL选项，表示请求URL公共部分
    baseURL: process.env.VUE_APP_BASE_API,
    // 超时
    timeout: 10000
})

//request请求拦截器
service.interceptors.request.use(config => {
    //是否需要设置token
    const token = localStorage.getItem('logintoken');
    const isToken = (config.headers || {}).isToken === false;
    if (token !== ""&& !isToken) {
        config.headers['Authorization'] = token;
    }
    //get请求映射params阐述
    if (config.method === 'get'&& config.params) {
        let url = config.url + '?'+ tansParams(config.params);
        url = url.slice(0,-1);
        config.params = {};
        config.url = url;
    }
    return config;
}, error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
})

// 响应拦截器
service.interceptors.response.use(res => {
    console.log("全局的响应处理",res);
    // 未设置状态码则默认成功状态
    const code = res.data.code || 200;
    // 获取错误信息
    const msg =  res.data.msg
    if (code === 401) {
      MessageBox.confirm('登录状态已过期，您可以继续留在该页面，或者重新登录', '系统提示', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        setTimeout(() => {
          this.$store.commit('logout', 'false')
          this.$router.push({ path: '/login' })
          this.$message({
            type: 'success',
            message: '已退出登录!'
          })
        }, 1000)
      }).catch(() => {});
      return Promise.reject('无效的会话，或者会话已过期，请重新登录。')
    } else if (code === 500) {
      Message({
        message: msg,
        type: 'error'
      })
      return Promise.reject(new Error(msg))
    } else if (code !== 200) {
      Notification.error({
        title: msg
      })
      return Promise.reject('error')
    } else {
      //如果你的响应码是200 则直接返回res
      return res
    }
  },
  error => {
    console.log('err' + error)
    let { message } = error;
    if (message == "Network Error") {
      message = "后端接口连接异常";
    }
    else if (message.includes("timeout")) {
      message = "系统接口请求超时";
    }
    else if (message.includes("Request failed with status code")) {
      message = "系统接口" + message.substr(message.length - 3) + "异常";
    }
    Message({
      message: message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
  )
export default service;