/*引入Vue框架*/
import Vue from 'vue';
/*引入资源请求插件*/
import axios from 'axios';

import { baseUrl } from '@/config/env'

import Qs from 'qs'

import { getStore } from '@/utils/utils.js'
import { USER_INFO_KEY } from '@/config/env'
import router from '@/router'


let token = '';
axios.defaults.baseURL = baseUrl;
axios.defaults.timeout = 6000;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.headers.common['token'] = token;

// 请求体中的数据会以json字符串的形式发送到后端
// Content-Type: application/json ： 
// 请求体中的数据会以普通表单形式（键值对）发送到后端
// Content-Type: application/x-www-form-urlencoded：
// 它会将请求体的数据处理为一条消息，以标签为单元，用分隔符分开。既可以上传键值对，
// 也可以上传文件。
// Content-Type: multipart/form-data： 

//添加一个请求拦截器
axios.interceptors.request.use(function(config) {
    let user = JSON.parse(getStore(USER_INFO_KEY));
    if (user) {
        token = user.token;
    }
    config.headers.common['token'] = token;
    return config;
}, function(error) {
    console.log("error: ");
    console.log(error);
    return Promise.reject(error);
});

// 添加一个响应拦截器
axios.interceptors.response.use(function(response) {
    console.log(response.data.code);
    if (response.data && response.data.code) {
        if (parseInt(response.data.code) === 203 || response.data.msg === 'token无效') {
            //未登录
            response.data.msg = "登录信息已失效，请重新登录";
            // road.$message.error(response.data.msg);
            // routerIndex.push('/login');
            router.push('login');
        }
    }
    return response;
}, function(error) {
    // Do something with response error
    // console.dir(error);
    // road.$message.error("服务器连接失败");
    return Promise.reject(error);
})


/*使用axios插件*/
Vue.prototype.$axios = axios;
Vue.prototype.$qs = Qs;

export default ({

});