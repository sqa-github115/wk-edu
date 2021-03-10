import http from '../utils/http.js';
export default {
        namespaced:true,
        state:{
                classrooms:[],
                isInit:false,
        },
        getters:{},
        mutations:{
                _init(state,classrooms){
                        state.classrooms = classrooms;
                        state.isInit=true;
                },
                _removeClsr(state,clsr_id){
                        let i = state.classrooms.findIndex(item => item.clsr_id === clsr_id);
                        state.classrooms.splice(i, 1);
                },
                _addClsr(state,clsr){
                        state.classrooms.push(clsr)
                },
                _updateClsr(state,clsr){
                        let i = state.classrooms.findIndex(item => item.clsr_id === clsr.clsr_id);
                        state.classrooms.splice(i, 1, Object.assign({}, clsr));
                }
        },
        actions:{
                async init(context){
                        // if(context.state.isInit) return;
                        let classrooms = await http({url:'/classroom/all'});
                        context.commit('_init',classrooms)
                },
                async removeClsr(context, clsr_id){
                        await http({
                                url: '/classroom/remove/' + clsr_id,
                        });
                        context.commit('_removeClsr',clsr_id)
                },
                async addClsr(context,clsr){
                        clsr.clsr_id = await http({
                                url: "/classroom/add",
                                method: "post",
                                data: clsr
                        });
                        context.commit('_addClsr',clsr)
                },
                async updateClsr(context,clsr){
                        await http({
                                url: "/classroom/update",
                                method: "post",
                                data: clsr
                        });
                        context.commit('_updateClsr',clsr)
                },
        },
};