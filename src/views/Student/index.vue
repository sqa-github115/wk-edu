<template>
	<el-container>
		<el-header height="50" style="flex-shrink: 0">
			<el-form inline >
				<el-form-item label="学生姓名：">
					<el-input @change="getStudent()" v-model.trim="search.stu_name"
					          prefix-icon="el-icon-search" style="width: 190px"></el-input>
				</el-form-item>
				<el-form-item label="所有班级">
					<el-select @change="getStudent()" v-model="search.stu_cls_id"
					           style="width: 190px">
						<i slot="prefix" class="el-icon-search"></i>
						<el-option :value="0" label="- 全部 -"></el-option>
						<el-option :value="null" label="- 无班级 -"></el-option>
						<el-option
							v-for="item in classList"
							:key="item.cls_id"
							:value="item.cls_id"
							:label="item.cls_name">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="学生学历">
					<el-select @change="getStudent()" v-model="search.stu_qualification"
					           style="width: 190px">
						<i slot="prefix" class="el-icon-search"></i>
						<el-option :value="0" label="- 全部 -"></el-option>
						<el-option
							v-for="item in qualification"
							:key="item.dic_id"
							:value="item.dic_id"
							:label="item.dic_name">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item style="float: right">
					<el-button type="danger" icon="el-icon-download" >导出学生信息</el-button>
				</el-form-item>
				<el-form-item  style="float: right">
					<el-button type="success" icon="el-icon-share" @click="batch">批量分班</el-button>
				</el-form-item >
				<el-form-item  style="float: right">
					<el-button type="primary" icon="el-icon-plus" @click=" beginAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-header>
		<el-main>
			<el-table :data="studentList" height="380" border stripe  @selection-change="handleSelectionChange">
				<el-table-column fixed type="index" label="#"></el-table-column>
				<el-table-column fixed type="selection" width="48px" align="center" ></el-table-column>
				<el-table-column fixed label="学生姓名" prop="stu_name" width="100px"></el-table-column>
				<el-table-column label="班级" width="120px">
					<template slot-scope="{ row }">
						<span v-if="row.stu_cls_id !==null"
						      v-text="classList.length >0&&classList.find(item =>item.cls_id === row.stu_cls_id).cls_name"></span>
						<span v-else class="no-remark">暂无班级</span>
					</template>
				</el-table-column>
				<el-table-column label="存档照片" width="100px">
						<template slot-scope="{ row }">
							<el-popover v-if="row.stu_avatar !==null"  placement="right" trigger="click">
								<span class="flt" v-text="row.stu_name"></span>
								<img class="preview" :src="row.stu_avatar" alt="">
								<p slot="reference" class="look" style="text-align: center">预览</p>
							</el-popover>
							<span v-else class="no-look">暂无照片</span>
						</template>
				</el-table-column>
				<el-table-column label="性别" width="60px">
					<template slot-scope="{ row }">
						<span v-text="row.stu_sex?'男':'女'"></span>
					</template>
				</el-table-column>
				<el-table-column label="联系电话" prop="stu_phone" width="120px"></el-table-column>
				<el-table-column label="电系电话(备用)" prop="stu_phone2" width="120px"></el-table-column>
				<el-table-column label="出生日期" prop="stu_born" width="120px"></el-table-column>
				<el-table-column label="学历" width="120px">
					<template slot-scope="{ row }">
						<span v-text="qualification.find(item => item.dic_id ===row.stu_qualification ).dic_name"></span>
					</template>
				</el-table-column>
				<el-table-column label="毕业院校" width="200px">
					<template slot-scope="{row}">
						<span v-if="row.stu_school !==''" v-text="row.stu_school"></span>
						<span v-else class="no-look">暂无院校</span>
					</template>
				</el-table-column>
				<el-table-column label="院校专业"  width="200px">
					<template slot-scope="{row}">
						<span v-if="row.stu_major !==''" v-text="row.stu_major"></span>
						<span v-else class="no-look">暂无专业</span>
					</template>
				</el-table-column>
				<el-table-column label="家庭住址" prop="stu_address" width="240px"></el-table-column>
				<el-table-column label="备注" width="260px">
					<template slot-scope="{ row }">
						<span v-if="row.stu_remark !=='' " v-text="row.stu_remark"></span>
						<span v-else class="no-remark">暂无备注</span>
					</template>
				</el-table-column>
				<el-table-column fixed="right" label="操作" align="center" width="410px">
					<template slot-scope="{ row }">
						<el-button size="small"  type="success" icon="el-icon-share"  @click="division(row)">分班</el-button>
						<el-button size="small"  type="danger" @click="avatarOpen(row)" icon="el-icon-picture">照片存档</el-button>
						<el-button size="small"  type="primary" @click="beginUpdate(row)" icon="el-icon-edit">编辑</el-button>
						<el-button size="small"  type="warning">删除</el-button>
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
				@size-change="getStudent()"
				@current-change="getStudent(false)"
				layout="prev,pager,next,jumper, ->,sizes,total"
				:page-sizes="[5, 8,10, 12, 14, 16]"></el-pagination>
		</el-footer>
		<!--分班-->
		<el-dialog
			:visible="branch.judge"
			:show-close="false"
			:modal="false"
			width="700px" >
			<h3 slot="title"
			    style="background-color: deepskyblue;font-size: 15px;font-weight: bold;line-height:30px;">分班</h3>
			<el-form >
				<el-form-item label="分班：">
					<el-select v-model="branch.model.stu_cls_id" >
						<el-option :value="null" label="- 无班级 -"></el-option>
						<el-option
							v-for="item in classList"
							:key="item.cls_id"
							:value="item.cls_id"
							:label="item.cls_name"
							:disabled="item.cls_end !== null">
						</el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<span slot="footer">
				<el-button type="primary" @click="divisionUp">确定</el-button>
				<el-button @click="branch.judge = false">取消</el-button>
			</span>
		</el-dialog>
		<!--增加/修改-->
		<el-dialog
			:visible="edit.isStudentEdit"
			:show-close="false"
			:modal="false"
			width="700px">
			<h3 slot="title" v-text="`学生维护 - ${ edit.mode ? '新增' : '修改' }`"
			    style="background-color: deepskyblue;font-size: 15px;font-weight: bold;line-height:30px;"></h3>
			<el-form  label-width="120px" :rules="edit.rules" ref="form" :model="edit.model" @validate="formValidateHandler">
				<el-form-item label="学生姓名：" prop="stu_name">
					<el-input v-model.trim="edit.model.stu_name" placeholder="请输入学生姓名"></el-input>
				</el-form-item>
				<el-form-item label="性别：">
					<el-radio v-model="edit.model.stu_sex" :label="1">男</el-radio>
					<el-radio v-model="edit.model.stu_sex" :label="0">女</el-radio>
				</el-form-item>
				<el-form-item label="联系电话：" prop="stu_phone" >
					<el-input v-model.trim="edit.model.stu_phone" maxlength="11"  show-word-limit placeholder="请输入手机号"></el-input>
				</el-form-item>
				<el-form-item label="备用电话：" prop="stu_phone2" >
					<el-input v-model.trim="edit.model.stu_phone2" maxlength="11" show-word-limit placeholder="请输入备用联系电话(手机号/座机号)">
						<template slot="append">例如：028-88888888</template>
					</el-input>
				</el-form-item>
				<el-form-item prop="stu_born" label="出生日期：" >
					<div class="block">
						<el-date-picker

							value-format="yyyy-MM-dd"
							v-model="edit.model.stu_born"
							type="date"
							placeholder="选择日期时间"
							:picker-options="dataTime">
						</el-date-picker>
					</div>
				</el-form-item>
				<el-form-item label="学生学历" prop="stu_qualification">
					<el-select v-model="edit.model.stu_qualification" placeholder="- 请输选择学生学历 -">
						<el-option
							v-for="item in qualification"
							:key="item.dic_id"
							:value="item.dic_id"
							:label="item.dic_name">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="在读/毕业院校："  >
					<el-input v-model.trim="edit.model.stu_school" placeholder="请选择在读/毕业院校(选填)"></el-input>
				</el-form-item>
				<el-form-item label="在校学习专业：" >
					<el-input v-model.trim="edit.model.stu_major" placeholder="请选择在校学习专业(选填)"></el-input>
				</el-form-item>
				<el-form-item label="家庭住址：" prop="stu_address">
					<el-input v-model.trim="edit.model.stu_address" placeholder="请选择家庭住址"></el-input>
				</el-form-item>
				<el-form-item label="备注：" prop="stu_remake">
					<el-input type="textarea"  row="3" v-model.trim="edit.model.stu_remark" placeholder="请输入学生备注"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer">
				<el-button type="primary" @click="save">保存</el-button>
				<el-button @click="edit.isStudentEdit = false">取消</el-button>
			</span>
		</el-dialog>
		<!--照片-->
		<el-dialog
			:visible.sync="avatar.isUpload"
			:show-close="false"
			:modal="false" style="min-height: 600px">
			<div class="content">
				<!--照片存档-->
				<div  class="box" v-if="avatar.model.stu_avatar_old !== null">
					<span> 个人照片：</span>
					<div class="pic">
						<img :src="avatar.model.stu_avatar_old" alt="">
						<p style="text-align: center">当前照片存档</p>
					</div>
				</div>
				<div>
					<el-upload accept=".jpg,.png"   ref="upload"
					           style="display: flex"
					           list-type="picture-card"
					           action="student/avatarupload"
					           :headers="uploadHeaders"
					           name="avatar"
					           :before-upload="beforeAvatarUpload"
					           :on-success="avatarUploadSuccess"
					           :on-remove="avatarRemove">
						<i class="el-icon-plus"></i>
						<!--提示信息-->
					</el-upload>
					<div style="color: red;margin-top: 5px;" slot="tip" >只能上传jpg/png图片且大小不超过2M！</div>
				</div>
			</div>
				<span slot="footer">
					<el-button :disabled="avatar.model.stu_avatar_new===''" type="primary" @click="getZp">确定</el-button>
					<el-button @click="clearUploadedImage">取消</el-button>
				</span>
		</el-dialog>
	</el-container>
</template>

<script type="text/ecmascript-6">
        import {createNamespacedHelpers} from 'vuex';

        let {mapActions, mapState} = createNamespacedHelpers('dictionary');

        export default {
                name: "Student",
                data(){
                        return {
				dataTime:{      //禁用当天之后的时间
                                        disabledDate(time) {
                                                return time.getTime() > Date.now() ;
                                        },
				},
                                classList: [],   //班级
                                studentList: [],     //学生信息列表
                                pagination: {total: 0, pageSize: 5, currentPage: 1},
                                search: {stu_name: "", stu_cls_id: 0, stu_qualification: 0},
                                edit: {
                                        mode:true,
                                        isStudentEdit: false,     //是否进入新增
                                        model: {
                                                stu_name: "",
                                                stu_avatar: null,
                                                stu_cls_id: null,
                                                stu_sex: 1,
                                                stu_phone: null,
                                                stu_phone2: null,
                                                stu_born: "",
                                                stu_qualification: null,
                                                stu_school: "",
                                                stu_major: "",
                                                stu_address: "",
                                                stu_remark: "",
                                                stu_id:null,
                                        },
	                                rules:{
                                                stu_name:[
	                                                { required: true,
	                                                        validator: (rule, value, callback) => {
	                                                        if(value === '')
                                                                        callback(new Error("* 姓名不能为空"));
								else if(!/^[\u4e00-\u9fa5]{2,6}$/.test(value))
                                                                        callback(new Error("* 请输入正确姓名(汉字) 2 - 6 个字"));
								else
                                                                        callback();
	                                                        },
                                                                trigger:"blur"
	                                                }
                                                ],
		                                stu_phone:[
			                                {
                                                                required: true,
                                                                validator:async (rule, value, callback) => {
                                                                    if(value === '')
                                                                                callback(new Error("* 电话不能为空"));
                                                                        else if(!/^[1]+[3,7,8]+\d{9}$/.test(value))
                                                                                callback(new Error("* 请输入正确电话11位"));
                                                                        else  if(!this.edit.mode)  callback();
                                                                        else if(await this.$http({ method: "post",url:"/student/valid_phone",data:{ stu_phone: value}}))
                                                                                callback(new Error("* 请输入正确电话11位"));
                                                                        else
                                                                                callback();
                                                                },
                                                                trigger:"blur"
			                                }
		                                ],
		                                stu_phone2:[
			                                {
			                                        required:true,
                                                                validator:async (rule, value, callback) => {
                                                                        if(value === '')
                                                                                callback(new Error("* 备用电话不能为空"));
                                                                        else if(! /^\d{11}$/.test(value))
                                                                                callback(new Error("* 请输入正确电话11位"));
                                                                        else
                                                                                callback();
                                                                },
                                                                trigger:"blur"
			                                }
		                                ],
		                                stu_born:[
                                                        { required: true, message: '出生年月必填', trigger: 'blur' },
		                                ],
                                                stu_qualification:[
                                                        { required: true, message: '* 学历必填', trigger: 'blur' },
                                                ],
		                                stu_address:[
                                                        { required: true, message: '* 家庭住址必填', trigger: 'blur' },
		                                ],
	                                }
                                },
	                        //分班
                                branch:{
                                        judge:false,    //打开
	                                model:{ stu_id:null, stu_ids:[], stu_cls_id:null}
                                },
                                stu_ids:[],
	                        //照片
                                uploadHeaders:{ "Authorization": sessionStorage.getItem("token") },
                                avatar: {       //头像上传数据
                                        isUpload:false,                 //是否进入上传
                                        model: {
                                                stu_id:null,
                                                stu_avatar_old: null,
                                                stu_avatar_new: ""
                                        }
                                }
                        };
                },
                computed: {
                        ...mapState({'qualification': 'education'}),
                },
                methods: {
                        //分班
                        handleSelectionChange(val){     //获取
                                console.log(val);
                                this.branch.model.stu_ids = [];
				val.forEach(item => {
                                        this.branch.model.stu_ids.push( item.stu_id);
				})
                        },
                        //批量
                        batch(){
	                        if(!this.branch.model.stu_ids.length > 0){
                                        this.$confirm('请勾选要分班的学生', '提示', {
                                                confirmButtonText: '确定',
                                                showCancelButton:false,
                                                type: 'warning'
                                        })
	                        }else{
                                        this.branch.model.stu_id = null;
                                        this.branch.judge=true;
	                        }
                        },
                        //单个
                        division(row){
	                        console.log(row);
	                        this.branch.model.stu_cls_id = row.stu_cls_id;
	                        this.branch.model.stu_id = row.stu_id;
	                        this.branch.model.stu_ids = [];
				this.branch.judge=true;
                        },
	                //分班保存
                        async divisionUp(){
                                if(this.branch.model.stu_id !== null){
                                      await this.$http({
                                                url: "/student/assignclass",
                                                method: "post",
                                                data:this.branch.model,
                                        });
                                        let i = this.studentList.findIndex(item => item.stu_id === this.branch.model.stu_id);
                                        console.log(i);
                                       this.studentList[i].stu_cls_id = this.branch.model.stu_cls_id;
                                        this.$message({
                                                message: "分班成功",
                                                type: 'success'
                                        });
                                }else{
                                                await this.$http({
                                                        url: "/student/assignclass",
                                                        method: "post",
                                                        data:this.branch.model,
                                                });
                                                this.studentList.forEach(item => {
                                                        if(this.branch.model.stu_ids.indexOf(item.stu_id) !== -1){
                                                                item.stu_cls_id =this.branch.model.stu_cls_id
                                                        }
                                                });
                                                this.$message({
                                                        message: "批量分班成功",
                                                        type: 'success'
                                                });
                                }
				this.branch.judge = false;

                        },
	                //新增/修改
                        beginAdd(){
                                this.$refs.form && this.$refs.form.resetFields();


                                this.edit.model.stu_name="";
                                        this.edit.model.stu_avatar=null;
                                        this.edit.model.stu_cls_id=null;
                                        this.edit.model.stu_sex= 1;
                                        this.edit.model.stu_phone= null;
                                        this.edit.model.stu_phone2= null;
                                        this.edit.model. stu_born= "";
                                        this.edit.model.stu_qualification= null;
                                        this.edit.model.stu_school= "";
                                        this.edit.model.stu_major= "";
                                        this.edit.model.stu_address= "";
                                        this.edit.model.stu_remark= "";

                                        this.edit.isStudentEdit = true;
                                        this.edit.mode = true;
	                },
                        beginUpdate(student){
                                this.$refs.form && this.$refs.form.resetFields();
                                this.edit.model.stu_name=student.stu_name;
                                this.edit.model.stu_avatar=student.stu_avatar;
                                this.edit.model.stu_cls_id=student.stu_cls_id;
                                this.edit.model.stu_sex= student.stu_sex;
                                this.edit.model.stu_phone= student.stu_phone;
                                this.edit.model.stu_phone2=student.stu_phone2;
                                this.edit.model. stu_born= student.stu_born;
                                this.edit.model.stu_qualification=student.stu_qualification;
                                this.edit.model.stu_school= student.stu_school;
                                this.edit.model.stu_major= student.stu_major;
                                this.edit.model.stu_address= student.stu_address;
                                this.edit.model.stu_remark= student.stu_remark;
                                this.edit.model.stu_id= student.stu_id;

                                this.edit.isStudentEdit = true;
                                this.edit.mode = false;
                        },
                        formValidateHandler(prop,valid,message){
                                //验证新增or修改
                                if(prop === "stu_phone") this.PhoneValidateResult = valid;
                        },
	                async save(){
                                if( this.PhoneValidateResult === false ) return;
                                if( typeof this.PhoneValidateResult === "undefined" ){
                                        await new Promise( resolve => this.$refs.form.validateField("stu_phone",(message) => {
                                                if( message === "" ) resolve();
                                        }))
                                }
                                let formValidateField = ["stu_name","stu_phone2","stu_born","stu_qualification","stu_address"];
                                await  Promise.all(formValidateField.map(item => {
                                        return new Promise(resolve => this.$refs.form.validateField(item, (message) => {
                                                if(message === "") resolve();
                                        }))
                                }));
		                if(this.edit.mode){
                                        this.edit.model.stu_id = await this.$http({
						url: "/student/add",
						method: "post",
						data:this.edit.model
					});
                                        this.studentList.push(Object.assign({}, this.edit.model));
                                        this.$message({
                                                message: "新增成功",
                                                type: 'success'
                                        });
		                }else{
                                        await this.$http({
                                                url: "/student/update",
                                                method: "post",
                                                data:this.edit.model
                                        });
                                        let i = this.studentList.findIndex(item => item.stu_id === this.edit.model.stu_id);
                                        this.studentList.splice(i,1,Object.assign({},this.edit.model));
                                        this.$message({
                                                message: "修改成功",
                                                type: 'success'
                                        });
		                }
		                this.edit.isStudentEdit = false;
	                },
                        async getStudent(fromPage1 = true){
                                if(fromPage1) this.pagination.currentPage = 1;
                                let {list, total} = await this.$http({
                                        method: "post",
                                        url: "student/list",
                                        data: {
                                                ...this.search,
                                                begin: this.pagination.pageSize * (this.pagination.currentPage - 1),
                                                pageSize: this.pagination.pageSize
                                        }
                                });
                                this.pagination.total = total;
                                this.studentList = list;
                        },

                        //照片
                        avatarOpen(row){
                                //打开时更新 最新的数据
				this.avatar.model.stu_id = row.stu_id;
				this.avatar.model.stu_avatar_old = row.stu_avatar;
				this.avatar.model.stu_avatar_new = '';
                                this.avatar.isUpload = true;
                        },
                        beforeAvatarUpload(file){
                                const isJPG = file.type === 'image/jpeg';
                                const isPNG = file.type === 'image/png';
                                const isLt2M = file.size / 1024 / 1024 < 2;

                                if ((!isJPG) && (!isPNG)) {
                                        this.$message.error('上传头像图片只能是 JPG 或 PNG 格式!');
                                }
                                if (!isLt2M) {
                                        this.$message.error('上传头像图片大小不能超过 2MB!');
                                }
                                return (isJPG || isPNG) && isLt2M;
                        },
                        avatarUploadSuccess({status, data, message}, file, fileList){          //上传成功以后的钩子函数
                                switch(status) {
                                        case 200:
                                                this.avatar.model.stu_avatar_new = data;
                                                console.log(fileList);
                                                if(fileList.length > 1) fileList.shift();       //删除第一个
                                                break;
                                        case 401:

                                        case 404:
                                        case 199:
                                        case 500:
                                                this.$message.error(message);
                                }
                        },
                        clearUploadedImage () {
                                this.$refs.upload.clearFiles();
                                this.avatar.isUpload = false;
                        },
                        avatarRemove(file, fileList){
                                this.avatar.model.stu_avatar_new = '';
                        },
                        async aaa(){
                                let pic = await this.$http({
                                        url:"/student/avatarupdate",
                                        method: "post",
                                        data:this.avatar.model,
                                });
                                let i =this.studentList.findIndex(item =>item.stu_id ===this.avatar.model.stu_id );
                                this.studentList[i].stu_avatar = pic;
                                this.$message.success("上传成功");
                                this.avatar.isUpload = false;           //关闭上传头像对话框
                                this.$refs.upload.clearFiles();         //重置上传控件，为下一次上传做准备
                        },
                        getZp(){
                                this.aaa();
//                                this.getStudent();
                        }
                },
                watch: {
                        'edit.isStudentEdit'(newValue) {
                                if(newValue === false) delete this.PhoneValidateResult;
                        }
                },
                created(){
                        this.getStudent();
                        //获取所有班级
                        this.$http({url: "class/all"})
                                .then(item => this.classList = item);
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
			/*border-bottom 1px solid #b0b0b0*/
			/*border-top 1px solid #b0b0b0*/
			background-color peachpuff
		span.no-role
				color #b0b0b0
		.el-footer
			display flex
			align-items center
			.el-pagination
				flex 1

	.no-remark
		color #ccc
	.content
		display flex
	.box
		display flex
		margin-right 5px
		border-right 2px solid #ccc
		.pic
			margin-bottom 10px
			margin-left 10px
			img
				width 144px
				height 187px
				padding 10px
	.el-upload--picture-card
		padding 10px
	.look
		color #00a2ef
	.no-look
		color #ccc
	.preview
		width 144px
		height 187px
		padding 10px
		margin-left 5px
	.flt
		float left
</style>