<template>
	<el-form label-width="130px" :model="pwd" class="demo-ruleForm" status-icon :rules="rules" ref="form">
		<el-form-item label="* 原始密码：" prop="oldPwd">
			<el-input style="width:330px;" v-model="pwd.oldPwd" type="password" showPassword clearable></el-input>
		</el-form-item>
		<el-form-item label="新密码：" prop="newPwd">
			<el-input style="width:330px;" v-model="pwd.newPwd" type="password" showPassword clearable></el-input>
		</el-form-item>
		<el-form-item label="确认新密码：" prop="againPwd">
			<el-input style="width:330px;" v-model="pwd.againPwd" type="password" showPassword clearable></el-input>
		</el-form-item>
		<el-form-item>
			<el-button type="primary" @click="determine">确定</el-button>
		</el-form-item>
	</el-form>
</template>

<script type="text/ecmascript-6">
	import demo from "../../components/demo.vue";
	//使用方
        export default {
                name:"ChangePwd",
	        data(){
                        return {
				pwd:{
				        oldPwd:'',
				        newPwd:'',
                                        againPwd:''
				},
	                        rules:{
		                                oldPwd:[
                                                        { required: true, message: '密码不能为空', trigger: 'blur' },
                                                        { min: 3, max: 20, message: '长度在 3 到 20个字符', trigger: 'blur' }
		                                ],
                                                newPwd:[
	                                                 {
                                                        validator:(rule, value, callback) =>{
                                                                let { oldPwd } = this.pwd;
                                                                if(value.length === 0)
                                                                        callback(new Error(("新密码不能为空")));
	                                                        else  if(value === oldPwd )
                                                                        callback(new Error('* 不能与旧密码相同'));
	                                                        else
	                                                                callback();
                                                                 },
		                                                 trigger: 'blur'
	                                                }
		                                ],
                                        againPwd:[
	                                        {
                                                        validator:(rule, value, callback) =>{
                                                                let { newPwd } = this.pwd;
                                                                if(value.length === 0)
                                                                        callback(new Error(("请再次输入密码")));
                                                                else  if(value !== newPwd )
                                                                        callback(new Error('* 与新密码不一致'));
                                                                else
                                                                        callback();
                                                        },
                                                        trigger: 'blur'
	                                        }
                                        ],

		                        }
                        };
	        },
	        methods:{
                        determine(){
                                this.$http({
	                                url:"user/pwdchange",
	                                method: "post",
	                                data:this.pwd
                                })
                        }
	        },

        };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

</style>