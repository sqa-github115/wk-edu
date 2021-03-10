<template>
	<el-container>
		<el-header>
			<el-form :inline="true">
				<el-form-item label="用户名：">
					<el-input
						v-model.trim="search.user_name"
						clearable
						prefix-icon="el-icon-search"
						placeholder="输入用户名搜索"
						@change="getUser()"
					></el-input>
				</el-form-item>
				<el-form-item label="用户角色：">
					<el-select
						v-model="search.role_id"
						@change="getUser()">
						<el-option :value="-1" label="- 全部 -"></el-option>
						<el-option :value="0" label="- 无角色 -"></el-option>
						<el-option
							v-for="role in roleList"
							:key="role.role_id"
							:label="role.role_name"
							:value="role.role_id"
						></el-option>
					</el-select>
				</el-form-item>
				<el-form-item style="float: right">
					<el-button type="primary" @click="beginAdd">
						<i class="el-icon-plus"></i>
						新增
					</el-button>
				</el-form-item>
			</el-form>
		</el-header>
		<el-main>
			<el-table height="400px" :data="userList" border stripe>
				<el-table-column type="index" label="#" align="center"></el-table-column>
				<el-table-column prop="user_name" label="用户名" width="150"></el-table-column>
				<el-table-column label="用户角色" width="200" align="center">
					<template slot-scope="{ row }">
						<span v-if="row.role_id !== null && roleList.length > 0"
						      v-text="roleList.find(item => item.role_id === row.role_id).role_name"></span>
						<span v-else class="no-role">无角色</span>
					</template>
				</el-table-column>
				<el-table-column label="操作">
					<template slot-scope="{ row }">
						<el-button size="small" type="primary" icon="el-icon-edit-outline"
						           @click="beginUpdate(row)">修改
						</el-button>
						<el-button size="small" type="warning" icon="el-icon-delete"
						           @click="remove(row.user_name)">删除
						</el-button>
						<el-popover placement="right">
							<el-button @click="beginRoleFuncConfig(row)"
								slot="reference" size="small" type="success" icon="el-icon-setting">角色分配 </el-button>
							<el-form  inline>
								<el-form-item label="角色：">
									<el-select v-model="edit.model.role_id">
										<el-option label="- 无角色 -" :value="0"></el-option>
										<el-option
											v-for="role in roleList"
											:key="role.role_id"
											:label="role.role_name"
											:value="role.role_id"></el-option>
									</el-select>
								</el-form-item>
								<el-form-item>
									<el-button type="success" @click="roleFuncConfig">分配</el-button>
								</el-form-item>
							</el-form>
						</el-popover>
					</template>
				</el-table-column>
			</el-table>
		</el-main>
		<el-footer>
			<el-pagination
				background
				:total="pagination.total"
				:page-size.sync="pagination.pageSize"
				:current-page.sync="pagination.currentPage"
				@size-change="getUser()"
				@current-change="getUser(false)"
				layout="prev,pager,next,jumper, ->,sizes,total"
				:page-sizes="[6, 8,10, 12, 14, 16]"></el-pagination>
		</el-footer>
		<el-dialog
			:visible.sync="edit.isEdit"
			:show-close="false"
			:modal="false"
			width="500px">
			<h3 slot="title" v-text="`用户编辑 - ${ edit.mode ? '新增' : '修改' }`"></h3>
			<el-form label-width="80px" :model="edit.model" :rules="edit.rules" ref="form" status-icon @validate="formValidateHandler">
				<el-form-item label="用户名：" prop="user_name">
					<el-input v-model="edit.model.user_name" :disabled="!edit.mode"></el-input>
				</el-form-item>
				<el-form-item label="密码：" prop="user_pwd">
					<el-input v-model="edit.model.user_pwd"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer">
				<el-button type="primary" @click="save">确定</el-button>
				<el-button @click="edit.isEdit = false">取消</el-button>
			</span>
		</el-dialog>
	</el-container>
</template>

<script type="text/ecmascript-6">
        import {createNamespacedHelpers} from 'vuex';

        let {mapActions, mapState} = createNamespacedHelpers('role');
        export default {
                name: 'User',
                data(){
                        return {
                                search: { user_name: '',   role_id: -1 },
                                pagination: { total: 0, pageSize: 6, currentPage: 1 },
                                userList: [],
                                edit: {
                                        isEdit: false,
                                        mode: true,
                                        model: { user_name: '',  user_pwd: '', role_id: null },
	                                rules:{
                                                user_name:[
	                                                {
                                                                validator: async (rule,value,callback) =>{
                                                                        if(!this.edit.mode)  callback();
                                                                        else if(!/^[a-zA-Z][a-zA-Z0-9]{2,19}$/.test(value))
                                                                                callback(new Error("* 用户长度 3 - 20 ，不能为空"));
	                                                                else if(await this.$http({ method: "post",url:"/user/valid_name",data:{ user_name: value}}))
                                                                                callback(new Error ("用户名存在"));
                                                                        else
	                                                                        callback();

                                                                },
		                                                trigger:"blur"
	                                                }
                                                ],
		                                user_pwd: [
			                                { required: true, message:"* 密码不能为空",trigger: "blur"},
			                                { min: 3,max: 20, message:"*密码长度3 - 20", trigger: "blur"}
		                                ]
	                                }
                                }
                        }
                },
                computed: {
                        ...mapState({'roleList': 'roles'}),
                },
                methods: {
                        ...mapActions({'roleInit': 'init'}),
                        async getUser(fromPage1 = true){
                                //换一批数据 相当于从第一页开始看
                                //判断是否需要从第一页开始看
                                if(fromPage1) this.pagination.currentPage = 1;
                                let {list, total} = await this.$http({
                                        method: 'post',
                                        url: '/user/list',
                                        data: {
                                                ...this.search,
                                                begin: this.pagination.pageSize * (this.pagination.currentPage - 1),
                                                pageSize: this.pagination.pageSize
                                        }
                                });
                                console.log(this.pagination.pageSize * (this.pagination.currentPage - 1));
                                this.userList = list;
                                this.pagination.total = total;
                        },
                        remove(user_name){
                                this.$confirm(`确定删除用户： "${user_name}" 吗？`, '提示', {type: 'warning'})
                                        .then(async() =>{
                                                await this.$http({method: 'post', url: '/user/remove/' + user_name});
                                                let i = this.userList.findIndex(item => item.user_name === user_name);
                                                this.userList.splice(i, 1);
                                                this.$message({message: `用户： “${user_name}”,删除成功！`, type: 'success'})
                                        })
                                        .catch(() =>{
                                        })
                        },
                        beginAdd(){
                                this.$refs.form && this.$refs.form.resetFields();  //重置表单验证
                                this.edit.model.user_name = '';
                                this.edit.model.user_pwd = '';
                                this.edit.model.role_id = null;
                                this.edit.mode = true;
                                this.edit.isEdit = true;
                        },
                        beginUpdate(user){
                                this.$refs.form && this.$refs.form.resetFields();  //重置表单验证
                                this.edit.model.user_name = user.user_name;
                                this.edit.model.user_pwd = user.user_pwd;
                                this.edit.model.role_id = user.role_id;
                                this.edit.mode = false;
                                this.edit.isEdit = true;
                        },
                        formValidateHandler(prop,valid,message){
                                if(prop === "user_name") this.userNameValidateResult = valid;
                        },
                        async save(){
                                if(this.edit.mode){   //是否为新增
                                        if(this.userNameValidateResult === false) return;
                                        if(typeof  this.userNameValidateResult === "undefined"){
                                                await new Promise(resolve =>this.$refs.form.validateField("user_name", message =>{
                                                    if(message === "") resolve();
                                                }));
                                        }
                                }
                                await new Promise(resolve =>this.$refs.form.validateField("user_pwd",message =>{
                                        if(message === "") resolve();
                                }));
                                //代码能执行到这里，说明用户名和密码都通过了验证，可以执行后续真正的新增与操作修改
                                if(this.edit.mode){
                                        //新增
                                        await this.$http({
                                                method: 'post',
                                                url: '/user/add',
                                                data: this.edit.model
                                        });
                                        this.userList.push(Object.assign({}, this.edit.model));
                                        this.$message({
                                                message: "新增成功",
                                                type: 'success'
                                        });
                                }else{
                                        await this.$http({
                                                method: 'post',
                                                url: '/user/change_pwd',
                                                data: this.edit.model
                                        });
                                        let i = this.userList.findIndex(item => item.user_name === this.edit.model.user_name);
                                        this.userList.splice(i, 1, Object.assign({}, this.edit.model));
                                        this.$message({
                                                message: "修改成功",
                                                type: 'success'
                                        });
                                }
                                this.edit.isEdit = false;
                        },
                        beginRoleFuncConfig(user){
                                this.edit.model.user_name = user.user_name;
                                this.edit.model.role_id = user.role_id || 0;
                        },
                        async roleFuncConfig(){
                                await this.$http({ method: "post", url: "/user/config_role", data:this.edit.model});
	                        let target = this.userList.find(item =>item.user_name === this.edit.model.user_name);
	                        target.role_id = this.edit.model.role_id || null;
                                this.$message({ message:`用户：${this.edit.model.user_name},角色分配成功！`, type:"success"});

                        },
                },
                watch: {
                        'edit.isEdit'(newValue) {
                                if(newValue === false) delete this.userNameValidateResult;
                        }
                },
                created(){
                        this.roleInit();
                        this.getUser();
                }
        }
        //这个页面什么时候需要去请求新的用户数据
        //1 created
        //2 搜索框失去焦点 和 change的时候
        //3 select 改变的时候
        //4 页码改变时
        //5 页容量变化
</script>

<style lang="stylus" type="text/stylus" scoped>
	.el-container
		position absolute
		left 0
		top 0
		height 100%
		width 100%
		.el-main
			border-bottom 1px solid #b0b0b0
			border-top 1px solid #b0b0b0
			span.no-role
				color #b0b0b0
		.el-footer
			display flex
			align-items center
			.el-pagination
				flex 1
</style>