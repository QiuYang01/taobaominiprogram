import Vue from 'vue'
import App from './App'

//https://blog.csdn.net/hong836717428/article/details/84140058
//vant-wapp 
import Toast from '../static/vant-weapp/toast/toast';
Vue.prototype.$Toast = Toast;


Vue.config.productionTip = true
App.mpType = 'app'

//引入发送请求的http
import http from './http/http'
Vue.prototype.$http = http;


const app = new Vue(App)
app.$mount()


