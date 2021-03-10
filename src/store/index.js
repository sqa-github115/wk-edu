import Vue from "vue";
import Vuex from "vuex";
import func from "./func.js";
import role from "./role.js"
import room from "./room.js"
import dictionary from "./dictionary.js"
import http from "../utils/http.js"

Vue.use(Vuex);

let store = new Vuex.Store({
        modules:{ func, role , room, dictionary},
        //存储组件公共数据
        state:{ http },
        // 当仓库中的state中的数据，组件在用时都要经过一定的处理计算才用，
        //可让仓库在getters中算好后再让多个组件去用。
        //getters相当于是仓库的计算属性
        getters:{},
        // vuex规定: 只有mutations节点中的方法才可以修改state节点中保存的数据
        // vuex规定:  mutations节点中的方法在调用时第一个参数总是state本身
        //vuex规定：mutations节点中的方法组件在调用时必须用commit()来调用
        //vuex规定：mutations节点中的代码只能是同步的代码，不可以包含异步的耗时代码
        mutations:{},
        //vuex规定：actions节点中的方法可以包含异步耗时的代码，但绝对不可以修改state中的数据
        //vuex规定：actions节点中的方法在调用时第一个参数是一个仓库的上下文对象，里面包的重要属性有：
        //state、commit
        //vuex规定：actions节点中的方法组件调用时必须用dispatch()来进行间接调用
        actions:{}
});

export default store;   //导出仓库