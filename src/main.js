import Vue from "vue";
import "./assets/css/reset.css";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import  router from "./router";
import store from "./store";
import app from "./App.vue";
import http from "./utils/http";


Vue.prototype.$http = http;
Vue.use(ElementUI);

//创建根实例，并渲染根实例
new Vue({
   el:"#app",
        components:{app},
        template: "<app/>",
        router,
        store
});