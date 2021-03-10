<template>
	<el-container>
		<el-header height="50">
			<el-form inline>
				<el-form-item label="员工名字：" >
					<el-input prefix-icon="el-icon-search" v-model.trim="search.stf_name" @change="getEmployee()"></el-input>
				</el-form-item>
				<el-form-item label="员工类型：" >
					<el-select
						v-model="search.stf_category"  @change="getEmployee()">
						<i slot="prefix" class="el-icon-search"></i>
						<el-option :value="0" label="- 所有类型 -"></el-option>
						<el-option
							v-for="employ in employeeType"
							:key="employ.dic_id"
							:label="employ.dic_name"
							:value="employ.dic_id"
						></el-option>
					</el-select>
				</el-form-item>
				<el-form-item style="float: right">
					<el-button type="success" @click="beginAdd">
						<i class="el-icon-plus"></i>
						新增
					</el-button>
				</el-form-item>
			</el-form>
		</el-header>
		<el-main>
			<el-table  :data="employeeList" border stripe >
				<el-table-column type="index" label="#"></el-table-column>
				<el-table-column label="姓名" prop="stf_name" width="100"></el-table-column>
				<el-table-column label="职务类型"  width="120">
					<template slot-scope="{ row }">
						<span v-text="employeeType.find(item => item.dic_id === row.stf_category).dic_name"></span>
					</template>
				</el-table-column>
				<el-table-column label="备注" width="450">
					<template  slot-scope="{ row }">
						<span v-if="row.stf_remark !== '' && row.stf_remark !== null "
						v-text="row.stf_remark"></span>
						<span v-else class="no-remark">暂无备注</span>
					</template>
				</el-table-column>
				<el-table-column label="员工状态" width="80">
					<template slot-scope="{ row }">
						<span v-if="row.stf_invalid === 1">在职</span>
						<span v-else class="no-role">离职</span>
					</template>
				</el-table-column>
				<el-table-column label="操作">
					<template slot-scope="{ row }">
						<el-button size="small" type="primary" icon="el-icon-edit-outline"
						           @click="beginUpdate(row)">编辑
						</el-button>
						<el-button size="small" type="warning" icon="el-icon-delete"
						           @click="dimission(row)"  v-if="row.stf_invalid">离职
						</el-button>
						<el-button size="small" type="warning" icon="el-icon-delete"
						           @click="reinstate(row)"  v-else>入职
						</el-button>
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
				@size-change="getEmployee()"
				@current-change="getEmployee(false)"
				layout="prev,pager,next,jumper, ->,sizes,total"
				:page-sizes="[6, 8,10, 12, 14, 16]"></el-pagination>
		</el-footer>
		<el-dialog
			:visible.sync="edit.isEdit"
			:show-close="false"
			:modal="false"
			width="600px">
			<h3 slot="title" v-text="`员工维护 - ${ edit.mode ? '新增' : '修改' }`" style="background-color: deepskyblue;font-size: 15px;font-weight: bold;line-height:30px;"></h3>
			<el-form label-width="100px">
				<el-form-item label="员工名字：">
					<el-input v-model.trim="edit.model.stf_name"></el-input>
				</el-form-item>
				<el-form-item label="员工类型：">
					<el-select v-model="edit.model.stf_category" placeholder="请选择员工类型">
						<el-option
							v-for="employ in employeeType"
							:key="employ.dic_id"
							:label="employ.dic_name"
							:value="employ.dic_id"
						></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="员工备注：">
					<el-input
						type="textarea"
						:rows="4"
						placeholder="请输入内容"
						v-model="edit.model.stf_remark">
					</el-input>
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
        let {mapActions, mapState} = createNamespacedHelpers('dictionary');

        export default {
                name:"Personnel",
	        data(){
                        return {
                                pagination: { total: 0, pageSize: 6, currentPage: 1 },//分页
                                search: {stf_category:0, stf_name:"", begin:0, pageSize:5},
                                employeeList: [],   //员工列表
	                        edit:{
                                        isEdit: false,           //打开dialog
                                        mode:true,      //判断模式
		                        model:{stf_name: "", stf_category:null, stf_remark:"",stf_id:null,stf_invalid:1},
	                        },
                        };
	        },
                computed: {
                        ...mapState({'employeeType': 'staff'}),
                },
	        methods:{
                        ...mapActions({'employeeInit': 'init'}),
                        dimission(employee){       //离职
                                this.$confirm(`确定要 "${employee.stf_name}"离职吗 吗？`, '提示', {type: 'warning'})
                                        .then(async() =>{
                                                await this.$http({ url: '/staff/dimission/' + employee.stf_id});
                                                this.employeeList.find(item => {
                                                        if(item.stf_id === employee.stf_id) item.stf_invalid = 0;
                                                });
                                                this.$message({message: `用户： “${employee.stf_name}”,离职成功！`, type: 'success'})
                                        })
                                        .catch(() =>{
                                        })
                        },
                        reinstate(employee){    //入职
                                this.$confirm(`确定要 "${employee.stf_name}"入职吗 吗？`, '提示', {type: 'warning'})
                                        .then(async() =>{
                                                await this.$http({ url: '/staff/reinstate/' +employee.stf_id});
                                                this.employeeList.find(item => {
                                                        if(item.stf_id === employee.stf_id) item.stf_invalid = 1;
                                                });
                                                this.$message({message: `用户： “${employee.stf_name}”,入职成功！`, type: 'success'})
                                        })
                                        .catch(() =>{
                                        })
                        },
                         beginAdd(){     //新增
                                 this.edit.model.stf_name = '';
                                 this.edit.model.stf_remark = '';
                                 this.edit.model.stf_category = null;
                                 this.edit.mode = true;
                                 this.edit.isEdit = true;
                        },
                        beginUpdate(employeeNode){
                                 console.log(employeeNode);
                               this.edit.model.stf_name =  employeeNode. stf_name;
                               this.edit.model.stf_category =  employeeNode. stf_category;
                               this.edit.model.stf_remark =  employeeNode. stf_remark;
                               this.edit.model.stf_id =  employeeNode. stf_id;
                                this.edit.mode = false;
                                this.edit.isEdit = true;
                        },
		        async save(){
				if(this.edit.mode){
                                        this.edit.model.stf_id = await this.$http({
                                                method: "post",
                                                url: "staff/add",
                                                data:this.edit.model
                                        });
                                        this.employeeList.push(Object.assign({}, this.edit.model));
                                        this.$message({
                                                message: "新增成功",
                                                type: 'success'
                                        });
				}else{
                                        await this.$http({
                                                method: 'post',
                                                url: '/staff/update',
                                                data: this.edit.model
                                        });
                                        let i = this.employeeList.findIndex(item => item.stf_name === this.edit.model.stf_name);
                                        this.employeeList.splice(i, 1, Object.assign({}, this.edit.model));
                                        this.$message({
                                                message: "修改成功",
                                                type: 'success'
                                        });
				}
                                this.edit.isEdit = false;
		        },
		         async getEmployee(fromPage1 = true){
                                 //换一批数据 相当于从第一页开始看
                                 //判断是否需要从第一页开始看
                                 if(fromPage1) this.pagination.currentPage = 1;
                                let {list, total} = await this.$http({
                                        url: "staff/list",
                                        method:"post",
                                        data:{
	                                        ...this.search,
                                                begin: this.pagination.pageSize * (this.pagination.currentPage - 1),
                                                pageSize: this.pagination.pageSize
                                        }
                                });
                                 this.employeeList = list;
                                 this.pagination.total = total;

		        }
	        },
	          created(){
                         this.getEmployee();
                 }
        };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
	.el-container
		position absolute
		left 0
		top 0
		height 100%
		width 100%
		.el-main
			background-color peachpuff
			border-bottom 1px solid #b0b0b0
			border-top 1px solid #b0b0b0
			span.no-role
				color red
		.el-footer
			display flex
			align-items center
			.el-pagination
				flex 1
	.no-remark
		color #ccc
</style>