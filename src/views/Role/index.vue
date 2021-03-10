<template>
	<div>
		<el-row :gutter="20">
			<el-col v-for="item in roles"  :key="item.role_id" :span="6">
				<el-card shadow="hover">
					<span v-text="item.role_name" style="font-size: 15px"></span>
					<div class="button-warpper">
						<el-button type="text" @click="beginUpdate(item.role_id)"><i class="el-icon-edit-outline"></i></el-button>
						<el-button type="text" @click="remove(item.role_id)"><i class="el-icon-delete"></i></el-button>
						<el-button type="text" @click="beginRoleFuncConfig(item.role_id)" > <i class="el-icon-s-tools"></i></el-button>
					</div>
				</el-card>
			</el-col>
			<el-col :span="6"  @click.native="beginAdd">
				<el-card class="btn-add">
					<i class="el-icon-plus" style="font-size: 15px;font-weight: bold"></i>
				</el-card>
			</el-col>
		</el-row>
		<el-dialog :title="edit.isEdit?'角色管理-新增':'角色管理-修改'"   width="600px"
		           :visible.sync="edit.isAdd"  :modal="false">
			<el-form :model="edit.model" :rules="edit.rules" ref="form">
				<el-form-item label="角色名称：" prop="role_name">
					<el-input placeholder="请输入角色名" v-model.trim="edit.model.role_name"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="save">确 定</el-button>
                                <el-button @click="edit.isAdd = false">取 消</el-button>
                        </span>
		</el-dialog>
		<el-drawer class="custom-drawer" :modal="false" :visible="edit2.isEdit" :show-close="false" size="500px">
			<h3 slot="title">角色功能分配</h3>
			<el-tree class="custom-tree" :data="edit2.treeData" default-expand-all :expand-on-click-node="false">
				<span slot-scope="{ node,data }" class="custom-tree-node" :class="{ parent: data.func_key === '' }">
					<span>
						<i class="el-icon-paperclip" v-if="data.func_key !== ''"></i>
						<span v-text="data.func_name"></span>
					</span>
					<span class="switch-wrapper">
						<el-switch v-model="data.open" @change="switchChangeHandler(data)"></el-switch>
					</span>
				</span>
			</el-tree>
			<div class="drawer-footer">
				<el-button type="primary" @click="roleFuncConfig">确定</el-button>
				<el-button @click="edit2.isEdit = false">取消</el-button>
			</div>
		</el-drawer>
	</div>
</template>

<script type="text/ecmascript-6">
        import { createNamespacedHelpers } from "vuex";
        let { mapState,mapActions } = createNamespacedHelpers("role");
        let {
                mapGetters: mapGetersFromFunc,
	        mapActions: mapActionsFromFunc
        } = createNamespacedHelpers("func");

        export default {
                name:"Role",
	        data(){
                        return {
	                        edit:{
                                        isAdd:false,    //添加
                                        isEdit:false,    //进入编辑
                                        model: { role_id: 0, role_name: ""},
                                        rules:{
                                                role_name:[
                                                        {
                                                                validator:(rule, value, callback) =>{
                                                                        //ES6中的解构赋值 前提 声明的变量必须是要解构的值
                                                                        let { role_name} = this.edit.model;
                                                                        if( value.length === 0)
                                                                                callback(new Error('* 角色名称不能为空'));
                                                                        else if( value.length < 2 || value.length > 10)
                                                                                callback( new Error('* 角色名称长度2 - 10'));
                                                                        else if( this.roles.some(item => item.role_name ===role_name ))
                                                                                callback(new Error('* 角色名存在'));
                                                                        else
                                                                                callback()              //直接调用callback不给参数，表示通过验证
                                                                },
                                                                trigger:"blur"
                                                        }
                                                ]
                                        }
	                        },
	                        edit2:{ //判断进入角色功能分配
	                                isEdit:false,
		                        model: { role_id: 0, role_func_ids:""},
		                        treeData:[]
	                        }
                        };
	        },
	        computed:{
                        ...mapState(["roles"]),
                        ...mapGetersFromFunc(["listToTree"])
	        },
                methods:{
	                ...mapActions(["init","addRole","updateRole","removeRole"]),
	                ...mapActionsFromFunc({ 'initFunc': 'init' }),
	                save(){
                                this.$refs.form.validate(async valid => {
                                        if(!valid) return;
                                        if(this.edit.isEdit){
                                                await this.addRole(Object.assign({},this.edit.model));
                                                this.$message({
                                                        message:`添加成功! `,
                                                        type:'success'
                                                });
                                        }else{
                                                await this.updateRole(Object.assign({},this.edit.model));
                                                this.$message({
                                                        message:`修改成功!`,
                                                        type:'success'
                                                });
                                        }
                                        this.edit.isAdd = false;
                                });
	                },
                        beginAdd(){     //新增
                                this.$refs.form && this.$refs.form.resetFields();
                                this.edit.isAdd = true;
                                this.edit.isEdit = true;
                        },
                        beginUpdate(id){  //修改
                                this.$refs.form && this.$refs.form.resetFields();
                                this.edit.model.role_id = id;
                                this.edit.model.role_name = this.roles[this.roles.findIndex(item => item.role_id === id)].role_name;
                                this.edit.isAdd = true;
                                this.edit.isEdit = false;
                        },
                        remove(node){   //删除
                                this.$confirm(`确定要删除吗？`,"警告","warning")
                                        .then(async () =>{
                                                await this.removeRole(node);
                                                this.$message({
                                                        showClose: true,
                                                        message: `删除角色成功，请刷新使用新功能`,
                                                        type: 'success'
                                                });
                                        })
                                        .catch(() =>{});
                        },
	                updateTreeData(roleFuncIds){
                                //更新tree.Data
		                let result = JSON.parse(JSON.stringify(this.listToTree));
		                console.log(result);
		                result.forEach(item => {
		                        item.open = roleFuncIds.indexOf(item.func_id !== -1);
		                        item.children && item.children.forEach( item2 => item2.open = roleFuncIds.indexOf(item2.func_id) !==-1)
		                });
		                this.edit2.treeData = result;
	                },
                        async beginRoleFuncConfig(role_id){
				let roleFuncs = await this.$http({ url: "/role_function/list/" +role_id  });
				let roleFuncIds = roleFuncs.reduce((result, item) =>{
				      result.push(item.func_id);
				      return result;
				},[]);
				this.updateTreeData(roleFuncIds);

				this.edit2.model.role_func_ids = "";
				this.edit2.model.role_id = role_id;

                                this.edit2.isEdit = true;
                        },
                        switchChangeHandler(node){      //开关
	                        console.log(node)
				if(node.func_key === ""){       //非叶子节点
				        node.children && node.children.forEach( item => item.open = node.open);
				}else{          //叶子节点
					if(node.children !==0 ) return;
				        let parent = this.edit2.treeData.find(item =>item.func_id === node.func_fid);
				        parent.open = parent.children.some(item => item.open);
				}
                        },
                        async roleFuncConfig() {
                                // 发送ajax之前统计树中所有的open为true的func_id
                                let func_ids = [];
                                this.edit2.treeData.forEach(item => {
                                        if(item.open) func_ids.push(item.func_id);
                                        item.children && item.children.forEach(item2 => {
                                                if(item2.open) func_ids.push(item2.func_id);
                                        })
                                });
                                this.edit2.model.role_func_ids = func_ids.join(',');

                                //发送ajax
                                await this.$http({
                                        url: "role_function/config",
                                        method: "post",
                                        data: this.edit2.model
                                });
                                // ajax发送成功返回后的相应界面
                                this.edit2.isEdit = false;
                                this.$message({ message: "角色功能已经分配成功！",type: "success" });
                        }
	        },
	        watch: {
	                listToTree(){
	                        this.edit2.isEdit = false;
	                        this.updateTreeData([]);
	                }
	        },
	        async created(){
			this.init();
			await this.initFunc();
                }
        };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
	.el-form-item
		display: flex
	.el-col
		margin-top: 30px
		.el-card
			color: #fff
			padding: 10% 0
			border-radius: 6px
			background-color: deepskyblue
			text-align: center
			cursor pointer
			position relative
			&.btn-add
				background-color transparent
				color: deepskyblue
				border: 2px dashed deepskyblue
			.button-warpper
				position absolute
				right 0
				button 5px
				margin-right 5px
				.el-button
					font-size 22px
					color #FFFFFF

	.custom-tree
		width: 400px
		margin: 20px 0 50px 50px
		span.custom-tree-node
			flex: 1
			display: flex
			justify-content: space-between
			align-items: center
			&.parent
				padding-right: 50px
				color: #0094ff
	.drawer-footer
		text-align: center
</style>