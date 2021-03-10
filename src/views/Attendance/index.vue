<template>
	<div>
		考勤管理组件
	<el-upload accept=".jpg,.png"   ref="upload"
	           list-type="picture-card"
	           action="student/avatarupload"
	           :headers="uploadHeaders"
	           name="avatar"
		:before-upload="beforeAvatarUpload"
		:on-success="avatarUploadSuccess"
		:on-remove="avatarRemove">
		<i class="el-icon-plus"></i>
		<!--提示信息-->
		<div slot="tip" class="hint">只能上传jpg/png图片且大小不超过2M！
			<el-button :disabled="avatar.model.stu_avatar_new===''" type="primary" @click="aaa">确定</el-button></div>
	</el-upload>

	</div>
</template>

<script type="text/ecmascript-6">
        export default {
                name:"Attendance",
	        data(){
                        return {
                                uploadHeaders:{ "Authorization": sessionStorage.getItem("token") },
	                        avatar: {       //头像上传数据
                                        isUpload:false,                 //是否进入上传
		                        model: {
                                                stu_id:7,
			                        stu_avatar_old: null,
			                        stu_avatar_new: ""
		                        }
	                        }
		        };
	        },
	        methods:{
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
                        avatarRemove(file, fileList){
                                this.avatar.model.stu_avatar_new = '';
                        },
                        async aaa(){
                                await this.$http({
	                                url:"/student/avatarupdate",
	                                method: "post",
	                                data:this.avatar.model,
                                });
                                this.$message.success("上传成功");
                                this.avatar.isUpload = false;           //关闭上传头像对话框
	                        this.$refs.upload.clearFiles();         //重置上传控件，为下一次上传做准备
                        }
	        },
        };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
	.hint
		color: red
</style>