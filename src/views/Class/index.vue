<template>
	<el-container>
		<el-header height="50">
			<el-form inline>
				<el-form-item label="班级名称：">
					<el-input prefix-icon="el-icon-search" v-model="search.cls_name"
					          @change="getClass()"></el-input>
				</el-form-item>
				<el-form-item label="班级专业：">
					<el-select v-model="search.cls_dic_id_major" @change="getClass()">
						<el-option :value="0" label="- 所有类型 -"></el-option>
						<el-option
							v-for="major in $store.getters['dictionary/getGroupByKey']('class_major')"
							:key="major.dic_id"
							:label="major.dic_name"
							:value="major.dic_id"
						>
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="班级状态：">
					<el-select v-model="search.cls_status" @change="getClass()">
						<el-option :value="0" label="- 所有类型 -"></el-option>
						<el-option :value="1" label="开课中"></el-option>
						<el-option :value="2" label="未开课"></el-option>
						<el-option :value="3" label="结课"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button class="el-icon-plus" type="success" @click="beginAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-header>
		<el-main>
			<el-table :data="classInformation" border stripe  height="100%">
				<el-table-column type="index" label="#"></el-table-column>
				<el-table-column label="班级名称" prop="cls_name" width="100"></el-table-column>
				<el-table-column label="班级专业">
					<template slot-scope="{ row }">
						<span v-text="$store.getters['dictionary/getGroupByKey']('class_major').find(item => item.dic_id === row.cls_dic_id_major).dic_name"></span>
					</template>
				</el-table-column>
				<el-table-column label="教学老师">
					<template slot-scope="{row}">
						<span v-text="teaching.find(item => item.stf_id === row.cls_stf_id_teacher).stf_name"></span>
					</template>
				</el-table-column>
				<el-table-column label="教务老师">
					<template slot-scope="{row}">
						<span v-text="admin.find(item => item.stf_id === row.cls_stf_id_admin).stf_name"></span>
					</template>
				</el-table-column>
				<el-table-column label="就业老师">
					<template slot-scope="{row}">
						<span v-text="job.find(item => item.stf_id === row.cls_stf_id_job).stf_name"></span>
					</template>
				</el-table-column>
				<el-table-column label="教室">
					<template slot-scope="{ row }">
						<span v-if="row.cls_clsr_id !==null "
						      v-text="roomList.find(item => item.clsr_id === row.cls_clsr_id).clsr_name"></span>
						<span v-else class="no-room"> 暂无教室</span>
					</template>
				</el-table-column>
				<el-table-column label="开课时间" prop="cls_begin" width="150"></el-table-column>
				<el-table-column label="结课时间" prop="cls_end" width="150"></el-table-column>
				<el-table-column label="班级状态" >
					<template slot-scope="{ row }">
						<span class="noClass" v-if="row.cls_begin === null && row.cls_end === null ">未开课</span>
						<span class="classStart" v-else-if="row.cls_end === null && row.cls_begin !== null">开课中</span>
						<span class="classEnding" v-else="row.cls_end !== null&& row.cls_begin !== null">结课</span>
					</template>
				</el-table-column>
				<el-table-column label="备注" prop="cls_remark">
					<template slot-scope="{ row }">
						<span v-if="row.cls_remark !==''&& row.cls_remark !==null "
						      v-text="row.cls_remark"></span>
						<span v-else class="no-room"> 暂无备注</span>
					</template>
				</el-table-column>
				<el-table-column label="操作" fixed="right" width="180">
					<template slot-scope="{ row }">
						<el-button size="small" type="primary" icon="el-icon-edit-outline"
						           @click="beginUpdate(row)">修改
						</el-button>
						<el-button v-if="row.cls_begin === null && row.cls_end === null " size="small"
						           @click="classStart(row)" type="success">开课 </el-button>
						<el-button v-if="row.cls_end === null&& row.cls_begin !== null" size="small"
						           @click="classEnding(row)" type="danger">结课 </el-button>
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
				@size-change="getClass()"
				@current-change="getClass(false)"
				layout="prev,pager,next,jumper, ->,sizes,total"
				:page-sizes="[6, 8,10, 12, 14, 16]"></el-pagination>
		</el-footer>
		<el-dialog
			:visible.sync="edit.isEdit"
			:show-close="false"
			:modal="false"
			width="600px">
			<h3 slot="title" v-text="`班级维护 - ${ edit.mode ? '新增' : '修改' }`"
			    style="background-color: deepskyblue;font-size: 15px;font-weight: bold;line-height:30px;"></h3>
			<el-form label-width="100px" ref="form" :model="edit.model" :rules="edit.rules" @validate="formvalidateHandler">
				<el-form-item label="班级名称：" prop="cls_name">
					<el-input v-model.trim="edit.model.cls_name"></el-input>
				</el-form-item>
				<el-form-item label="班级专业：" prop="cls_dic_id_major">
					<el-select v-model="edit.model.cls_dic_id_major" placeholder="请选择专业">
						<el-option
							v-for="major in $store.getters['dictionary/getGroupByKey']('class_major')"
							:key="major.dic_id"
							:label="major.dic_name"
							:value="major.dic_id"
						></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="教学老师：" prop="cls_stf_id_teacher">
					<el-select v-model="edit.model.cls_stf_id_teacher" placeholder="请选择专业">
						<el-option
							v-for="teach in teaching"
							:key="teach.stf_id"
							:label="teach.stf_name"
							:value="teach.stf_id"
						></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="教务老师：" prop="cls_stf_id_admin">
					<el-select v-model="edit.model.cls_stf_id_admin" placeholder="请选择专业">
						<el-option
							v-for="admin in admin"
							:key="admin.stf_id"
							:label="admin.stf_name"
							:value="admin.stf_id"
						></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="就业老师：" prop="cls_stf_id_job">
					<el-select v-model="edit.model.cls_stf_id_job" placeholder="请选择专业">
						<el-option
							v-for="job in job"
							:key="job.stf_id"
							:label="job.stf_name"
							:value="job.stf_id"
						></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="班级备注：">
					<el-input
						type="textarea"
						:rows="4"
						placeholder="请输入内容"
						v-model="edit.model.cls_remark">
					</el-input>
				</el-form-item>
			</el-form>
			<span slot="footer">
				<el-button type="primary" @click="save">确定</el-button>
				<el-button @click="edit.isEdit = false">取消</el-button>
			</span>
		</el-dialog>
		<el-dialog
			:visible.sync="start"
			:show-close="false"
			:modal="false" >
			<!--开课操作-->
			<h3 slot="title" style="background-color: deepskyblue;font-size: 15px;font-weight: bold;line-height:30px;">开班</h3>
			<el-form>
				<el-form-item label="教室：">
					<el-select v-model="edit.model.cls_clsr_id" placeholder="请选择">
						<el-option
							v-for="item in roomList"
							:key="item.clsr_id"
							:label="item.clsr_name"
							:value="item.clsr_id"
							:disabled="item.clsr_occupy === 1"
						></el-option>
					</el-select>
				</el-form-item>
				<!--<el-form-item label="老师">-->
					<!--<el-select>-->
						<!--<el-option v-for="item in $store.getters['dictionary/getGroupByKey']('staff_category')"-->
						           <!--:key="item.dic_id"-->
						           <!--:label="item.dic_name"-->
						           <!--:value="item.dic_id">-->

						<!--</el-option>-->
					<!--</el-select>-->
				<!--</el-form-item>-->
			</el-form>
			<span slot="footer">
				<el-button type="primary" @click="define">确定</el-button>
				<el-button @click="start = false">取消</el-button>
			</span>
		</el-dialog>
	</el-container>
</template>

<script type="text/ecmascript-6">
        import {createNamespacedHelpers} from 'vuex';
        import ElForm from "../../../node_modules/element-ui/packages/form/src/form.vue";

        let {mapState, mapGetters} = createNamespacedHelpers('dictionary');
        let {mapActions: mapActionsClassroom, mapState: mapStateClassroom} = createNamespacedHelpers('room');


        export default {
                components: {ElForm},
                name: "Class",
                data(){
                        return {
                                pagination: {total: 0, pageSize: 6, currentPage: 1},  //分页
                                search: {cls_name: "", cls_dic_id_major: null, cls_status: null, },   //搜索
                                classInformation: [],    //获取的现有的教室信息
                                edit: {                  //新增
                                        isEdit: false,
                                        mode: true,      //true表示新增      false表示修改
                                        model: {
                                                cls_name: "",
                                                cls_dic_id_major: null,
                                                cls_clsr_id: null,
                                                cls_stf_id_teacher: null,
                                                cls_stf_id_admin: null,
                                                cls_stf_id_job: null,
                                                cls_remark: null,
                                                cls_id:null,
                                                cls_begin:null,
	                                        cls_end:null,
                                        },
                                        rules: {
                                                cls_name: [
                                                        {required: true,
                                                                validator: async(rule, value, callback) =>{
                                                                        if(!this.edit.mode) callback();
                                                                        else if(await this.$http({
                                                                                        method: "post",
                                                                                        url: "/class/valid_name",
                                                                                        data: {cls_name: value}
                                                                                }))
                                                                                callback(new Error("班级名字不合理"));
                                                                        else
                                                                                callback();

                                                                },
                                                                trigger: "blur"
                                                        },
                                                ],
	                                        cls_dic_id_major:[
                                                        { required: true, message: '必选项', trigger: 'blur' },
	                                        ],
                                                cls_stf_id_teacher:[
                                                        { required: true, message: '必选项', trigger: 'blur' },
                                                ],
                                                cls_stf_id_admin:[
                                                        { required: true, message: '必选项', trigger: 'blur' },
                                                ],
                                                  cls_stf_id_job:[
                                                        { required: true, message: '必选项', trigger: 'blur' },
                                                ]
                                        }
                                },
                                teaching: [],    //教师
                                admin: [],       //教务
                                job: [],           //就业
	                        start:false,    //开课
                        };
                },
                computed: {
//                        ...mapState({'majorList': 'major'}),
                        ...mapStateClassroom({'roomList': 'classrooms'}),//教室列表
                },
                methods: {
                        ...mapActionsClassroom({'room': 'init'}),
                        //新增
                        beginAdd(){
                                this.$refs.form && this.$refs.form.resetFields();  //重置表单验证
                                this.edit.model.cls_name = '';
                                this.edit.model.cls_dic_id_major = null;
                                this.edit.model.cls_clsr_id = null;
                                this.edit.model.cls_stf_id_teacher = null;
                                this.edit.model.cls_stf_id_admin = null;
                                this.edit.model.cls_stf_id_job = null;
                                this.edit.model.cls_remark = null;
                                this.edit.model.cls_id = null;

                                this.edit.mode = true;
                                this.edit.isEdit = true;//打开面板
                        },
                        //修改
                        beginUpdate(node){
//	                        console.log(node);
                                this.$refs.form && this.$refs.form.resetFields();  //重置表单验证
                                this.edit.model.cls_name = node.cls_name;
                                this.edit.model.cls_dic_id_major = node.cls_dic_id_major;
                                this.edit.model.cls_clsr_id = node.cls_clsr_id;
                                this.edit.model.cls_stf_id_teacher = node.cls_stf_id_teacher;
                                this.edit.model.cls_stf_id_admin = node.cls_stf_id_admin;
                                this.edit.model.cls_stf_id_job = node.cls_stf_id_job;
                                this.edit.model.cls_remark = node.cls_remark;
                                this.edit.model.cls_id = node.cls_id;
                                this.edit.model.cls_begin = node.cls_begin;
                                this.edit.model.cls_end = node.cls_end;
                                this.edit.mode = false;
                                this.edit.isEdit = true;
                        },
                        formvalidateHandler(prop,valid,message) {
                                // 绑定表单的validate事件，判断当前验证的对象是不是班级名称，如果是，在this关键字的clsNameValidateResult上保存验证结果
                                if( prop === "cls_name" ) this.clsNameValidateResult = valid;
//                                console.log(valid,prop)
                        },
                        async save(){
                                if(this.edit.mode){   //是否为新增
                                        if(this.clsNameValidateResult === false) return;
                                        if(typeof  this.clsNameValidateResult === "undefined"){
                                                await new Promise(resolve =>this.$refs.form.validateField("cls_name", message =>{
                                                        if(message === "") resolve();
                                                }));
                                        }
                                }
                                let formValidateField = ["cls_dic_id_major","cls_stf_id_teacher","cls_stf_id_admin","cls_stf_id_job"];
                                await Promise.all(formValidateField.map(item => {
                                        return new Promise(resolve => this.$refs.form.validateField(item ,message => {
                                                if( message === "" ) resolve();
                                        }));
                                }));
                                if(this.edit.mode){
                                        await this.$http({
                                                method: "post",
                                                url: "class/add",
                                                data: this.edit.model,
                                        });
                                        this.classInformation.push(Object.assign({}, this.edit.model));
                                        this.$message({
                                                message: "新增成功",
                                                type: 'success'
                                        });
                                }else{
					await this.$http({
						method: "post",
						url: "class/update",
						data: this.edit.model
					});
					let i = this.classInformation.findIndex(item => item.cls_id === this.edit.model.cls_id);
                                        this.classInformation.splice(i, 1, Object.assign({}, this.edit.model));
                                        this.$message({
                                                message: "修改成功",
                                                type: 'success'
                                        });
                                }
                                this.edit.isEdit = false;
                        },
                        //开课
	                 classStart(data){
                                 this.edit.model.cls_clsr_id = null;
                                this.$confirm(`确定要对班级 "${data.cls_name}"进行 开课 操作吗?`, '警告', {type: 'warning'})
                                .then(async() =>{
                                         this.start = true;
                                this.edit.model.cls_id = data.cls_id;
                                this.edit.model.cls_clsr_id = data.cls_clsr_id;
                                })
                                        .catch(() =>{
                                        });
	                },
                        //开课保存
                        async define(){
	                         //修改room的使用状态  通过ajax中携带的cls_clsr_id
	                        let tim = await this.$http({
	                                method: "post",
	                                url: "class/begin",
	                                data:this.edit.model
	                        });
                                        let i = this.classInformation.findIndex(item => item.cls_id === this.edit.model.cls_id);
                                        this.classInformation[i].cls_begin = tim;
                                        this.classInformation[i].cls_clsr_id = this.edit.model.cls_clsr_id;
	                                this.roomList.find(item => item.clsr_id === this.edit.model.cls_clsr_id).clsr_occupy = 1;
//	                                console.log( this.roomList.filter(item => item.clsr_id === this.edit.model.cls_clsr_id));
                                        this.start = false;
                                        this.$message({
                                                message: `开课成功`,
                                                type: 'success'
                                        });
                        },
                        //结课
                        classEnding(data){
                                this.$confirm(`确定要对班级 "${data.cls_name}"进行 开课 操作吗?`, '警告', {type: 'warning'})
                                        .then(async() =>{
                                                this.edit.model.cls_id = data.cls_id;
                                                let tim = await this.$http({
                                                        method: "post",
                                                        url: "class/end",
                                                        data:this.edit.model
                                                });

                                                let i = this.classInformation.findIndex(item => item.cls_id === this.edit.model.cls_id);
                                                this.classInformation[i].cls_end = tim;
                                                this.roomList.find(item => item.clsr_id ===this.edit.model.cls_clsr_id).clsr_occupy = 0;
                                                this.$message({
                                                        message: `结课成功`,
                                                        type: 'success'
                                                });
                                        })
                                        .catch(() =>{
                                        });
                        },
                        async getClass(fromPage1 = true){
                                if(fromPage1) this.pagination.currentPage = 1;
                                let {list, total} = await this.$http({
                                        url: "/class/list",
                                        method: "post",
                                        data: {
                                                ...this.search,
                                                begin: this.pagination.pageSize * (this.pagination.currentPage - 1),
                                                pageSize: this.pagination.pageSize
                                        }
                                });
                                this.classInformation = list;
                                this.pagination.total = total;
                        }
                },
	        watch: {
                        'edit.mode'(newValue) {
                                if(newValue === false) delete this.PhoneValidateResult;
                        }
                },
                created(){
//                        //教学
//                       let p1 = this.$http({ url: "staff/listbycategory/" + 4, });
//                        .then(list => this.teaching = list);
//
//                        //教务
//                        let p2 = this.$http({ url: "staff/listbycategory/" + 5, });
//                                .then(list => this.admin = list);
//                        //就业
//                        let p3 = this.$http({ url: "staff/listbycategory/" + 6, });
//                                .then(list => this.job = list);
                        let p1 = this.$http({ url: "/staff/listbycategory/" + 4 });
                        let p2 = this.$http({ url: "/staff/listbycategory/" + 5 });
                        let p3 = this.$http({ url: "/staff/listbycategory/" + 6 });
//                        let p4 = this.getClass();        //获取班级列表
                        let p4 = this.$http({
                                url: "/class/list",
                                method: "post",
                                data: {
                                        ...this.search,
                                        begin: this.pagination.pageSize * (this.pagination.currentPage - 1),
                                        pageSize: this.pagination.pageSize
                                }
                        });
                        let p5 = this.room();    //获取教室
                        Promise.all([ p1,p2,p3,p4,p5 ])
                                .then( ([teacherList,adminList,jobList,classList]) => {
                                        this.teaching = teacherList;
                                        this.admin = adminList;
                                        this.job = jobList;
                                        this.classInformation = classList.list;
                                        this.pagination.total = classList.total;
                                })
                                .catch(error => {console.log(error)})
                },
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
			border-bottom 1px solid #b0b0b0
			border-top 1px solid #b0b0b0
		.el-footer
			display flex
			align-items center
			.el-pagination
				flex 1

	.no-room
		color: #ccc
	.noClass
		color #CCB015
	.classStart
		color greenyellow
	.classEnding
		color #ccc
</style>
