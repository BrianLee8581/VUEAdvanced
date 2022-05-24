import axios from 'axios';
import { loginreq, req } from './axiosFun';
import request from '@/api/request';

//登陆方法
export function login(username,password) {
    const data = {
        username,
        password,
    }
    return request({
        url: '/api/login',
        headers : {
            //用于请求头中，是否去localstorage中获取token
            isToken : false
        },
        method: 'post',
        data: data
    })
}
// 查询列表
export function userList(parameter){
    return request({
      url: '/api/rbacManager/manager/'+parameter.page+'/'+parameter.limit,
      headers: {
        //用于请求头中 是否去localstorage中获取token
        isToken: true
      },
      method: 'get'
    })
  }
// 保存用户
export function userSave(parameter){
    return request({
      url: '/api/rbacManager/manager',
      headers: {
        //用于请求头中 是否去localstorage中获取token
        isToken: true
      },
      method: 'post',
      data:parameter
    })
  }