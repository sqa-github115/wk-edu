import http from "../utils/http.js"

export default {
        namespaced: true,
        state:{
                list:[],
                staff:[],       //职位
                major:[],       //专业
                education:[],   //教育背景
                isInit: false
        },
        getters: {
                //让计算属性返回一个函数
               getGroupByKey(state){
                       return function(groupkey){
                               return state.list.filter(item => item.dic_group_key === groupkey)
                       };
               }
        },
        mutations:{
                _init(state, staff) {
                        state.staff = staff.filter(item => item.dic_group_key === "staff_category");
                        state.major = staff.filter(item => item.dic_group_key === "class_major");
                        state.education = staff.filter(item => item.dic_group_key === "qualification");
                        state.list = staff;
                        state.isInit = true;
                },
        },
        actions:{
                // async init(context) {
                //         let aa = await http({
                //                 url:"dictionary/all",
                //         });
                //         console.log(aa);
                //         context.commit("_init", aa)
                // },
                async init({state,commit,rootState}) {
                        if(state.isInit) return;
                        let aa = await rootState.http({
                                url:"dictionary/all",
                        });
                        console.log(aa);
                        commit("_init", aa)
                },



        }
}