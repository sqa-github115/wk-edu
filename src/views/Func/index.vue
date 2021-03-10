<template>
	<div>
		<el-tree class="custom-tree" :data="treeData" default-expand-all :expand-on-click-node="false" >
			<span class="custom-tree-node" slot-scope="{ node, data }">
				<span v-text="data.func_name" :class="{ root: data.func_id === 0, unleaf: data.func_key === '', leaf: data.func_key !== '' }"></span>
				<span>
					<el-button type="text" v-if="data.func_key === ''" @click="beginAdd(data)"><i class="el-icon-plus"></i></el-button>
					<el-button type="text" v-if="data.func_id !== 0" @click="beginUpdate(data)" ><i class="el-icon-edit"></i></el-button>
					<el-button type="text" v-if="[0,44,45].indexOf(data.func_id) === -1 " :disabled="typeof(data.children) === undefined"><i class="el-icon-delete"
						@click="remove(data)"></i></el-button>
				</span>
			</span>
		</el-tree>
		<el-dialog title="提示"   width="600px" :modal="false"
			           :visible.sync="edit.isEdit" :show-close="false">
				<el-form label-width="100px" :model="edit.model" :rules="edit.rules" ref="form">
					<el-form-item label="节点类型">
						<el-radio v-model="edit.isLeaf"
						          :disabled="!(edit.mode && edit.model.func_fid === 0)" :label="false" >非叶子节点</el-radio>
						<el-radio v-model="edit.isLeaf"
						          :disabled="!(edit.mode && edit.model.func_fid === 0)" :label="true" >叶子节点</el-radio>
					</el-form-item>
					<el-form-item label="父节点名称" >
						<el-select v-model="edit.model.func_fid" :disabled="edit.mode || !edit.isLeaf">
							<el-option
							v-for="item in selectData"
							:key="item.value"
							:label="item.label"
							:value="item.value"
							></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="系统功能名称" prop="func_name">
						<el-input v-model.trim="edit.model.func_name"></el-input>
					</el-form-item>
					<el-form-item label="绑定组件" v-show="edit.isLeaf" prop="func_key">
						<el-select v-model="edit.model.func_key" placeholder="">
							<el-option
								v-for="item in Object.keys(views)"
								:key="item"
								:label="item"
								:value="item"
								:disabled="list.findIndex(func => func.func_key === item) !== -1"
							></el-option>
						</el-select>
					</el-form-item>
					<el-form-item class="button-wrapper">
						<el-button type="primary"  @click="determine">确定</el-button>
						<el-button  @click="edit.isEdit = false">取消</el-button>
					</el-form-item>
				</el-form>
			</el-dialog>
	</div>
</template>

<script type="text/ecmascript-6">
	import views from "../";
	//映射子仓库
	import { createNamespacedHelpers } from "vuex";
	let{ mapState, mapGetters, mapActions } = createNamespacedHelpers("func");



        export default {
                name:"Func",
	        data(){
                        return{
	                        views,
                                edit:{
                                        mode:true,      //true表示新增      false表示修改
                                        isEdit:false,      //判断是否进入编辑状态
	                                isLeaf:true,      //标识当前编辑的是否是叶子节点
	                                model: { func_id: 0, func_name: "", func_key: "", func_fid: -1},
	                                rules:{
                                                func_name:[
	                                                {
	                                                        validator:(rule, value, callback) =>{
	                                                                //ES6中的解构赋值 前提 声明的变量必须是要解构的值
		                                                        let { func_id, func_name, func_fid } = this.edit.model;
		                                                        if( value.length === 0)
		                                                                callback(new Error('* 功能名称不能为空'));
		                                                        else if( value.length < 2 || value.length > 50)
		                                                                callback( new Error('* 功能名称长度2 - 50'));
		                                                        else if( this.list.some(item => item.func_id !== func_id && item.func_name ===func_name && item.func_fid === func_fid))
		                                                                callback(new Error('* 功能名在当前父级中存在'));
		                                                        else
		                                                                callback()              //直接调用callback不给参数，表示通过验证
	                                                        },
		                                                trigger:"blur"
	                                                }
                                                ],
		                                func_key:[
			                                {
                                                                validator:(rule, value, callback) =>{
	                                                                if( this.edit.mode && this.edit.isLeaf && value ==="")
	                                                                        callback(new Error('* 叶子节点必须绑定组件！'));
	                                                                else
	                                                                        callback()
                                                                },
                                                                trigger:"blur"
			                                }
                                                ],
	                                }
                                }
                        };
	        },
                computed:{
	                ...mapState(["list"]),
	                ...mapGetters(["listToTree"]),
                        treeData() {
                                return [ {
                                        func_id:0,
	                                func_name: "Root",
	                                func_key: "",
	                                func_fid: -1,
	                                children:this.listToTree
//	                                children:this.$store.getters["func/listToTree"] 原始写法
                                }];
                        },
	                selectData(){
                          let result = [ { label: "Root", value: 0  } ];
                          this.list.filter(item => item.func_key === "").forEach(item => {
                                result.push({ label: item.func_name ,value: item.func_id });
                          });
                          return result;
	                },
	        },
	       async created(){
	               // 通知func子仓库去初始化list所有功能组件
//                       this.$store.dispatch("func/init");
			this.init()
	        },
	        methods:{
		        ...mapActions(["init","addFunc", "updateFunc", "removeFunc"]),
	               remove(node){
                               this.$confirm(`确定要删除"${node.func_name}"节点吗？`,"警告","warning")
		                       .then(async () =>{
//		                               await  this.$store.dispatch("func/removeFunc",node.func_id);
			                       await this.removeFunc(node.func_id);
                                               this.$message({
                                                       showClose: true,
                                                       message: `删除"${node.func_name}"节点成功，请刷新使用新功能`,
                                                       type: 'success'
                                               });
		                       })
		                       .catch(() =>{});
	               },
                        beginAdd(parentNode){
                               this.$refs.form && this.$refs.form.resetFields();  //重置表单验证
	                       this.edit.mode = true;
	                       //判断是不是叶子
                                this.edit.model.func_key = "";
                                this.edit.isLeaf = parentNode.func_id !== 0;
                                this.edit.model.func_id = 0;
                                this.edit.model.func_name ="";
                                this.edit.model.func_fid = parentNode.func_id;
                                //打开对话框开始准备工作
                                this.edit.isEdit = true;
		        },
                        beginUpdate(node){
                                this.$refs.form && this.$refs.form.resetFields();  //重置表单
                                this.edit.mode = false;

                                //判断是不是叶子
                                this.edit.isLeaf = node.func_key !== "";
                                this.edit.model.func_id = node.func_id;
                                this.edit.model.func_name =node.func_name;
                                this.edit.model.func_key = node.func_key;
                                this.edit.model.func_fid = node.func_fid;
                                this.edit.isEdit = true;
                        },
                         determine(){
                                //找到表单触发验证
	                        this.$refs.form.validate(async valid => {
	                                if(!valid) return;
                                        if(this.edit.mode){
//                                                await this.$store.dispatch('func/addFunc', Object.assign({},this.edit.model));
	                                        await this.addFunc(Object.assign({},this.edit.model));
                                                this.$message({
                                                        message:`添加成功! 请刷新页面，启用新菜单...`,
                                                        type:'success'
                                                });
                                        }else{
//                                                await this.$store.dispatch('func/updateFunc',Object.assign({},this.edit.model));
	                                        await this.updateFunc(Object.assign({},this.edit.model));
                                                this.$message({
                                                        message:`修改成功! 请刷新页面，启用新菜单...`,
                                                        type:'success'
                                                });
                                        }
                                        this.edit.isEdit = false;
	                        });
                        },
	        }
        };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
	.custom-tree
		width 500px
		span.custom-tree-node
			flex: 1
			display: flex
			justify-content: space-between
			align-items: center
			font-size: 15px
			span.root
				color: brown !important
				font-weight bold
			span.unleaf
				color: #36404E
			span,leaf
				/*color: deeppink*/
				color: deepskyblue
				/*color: #67c23a*/
	.el-form-item{
		margin 0
		padding 10px 0
	}
	.el-form-item__label
			width :125px;

</style>