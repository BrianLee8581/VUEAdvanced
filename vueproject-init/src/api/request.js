import axios from 'axios';
import { config } from 'vue/types/umd';

axios.defaults.headers['Content-Type'] = 'application/json;charset=UTF-8';

//创建axios实例
const service = axios.create({
    // axios中请求配置有baseURL选项，表示请求URL公共部分
    baseURL: process.env.VUE_APP_BASE_API,
    // 超时
    timeout: 10000
})

//request拦截器
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
export default service;