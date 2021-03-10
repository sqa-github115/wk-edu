<template>
	<div class="pg" >
			<!--<div class="homepage-hero-module">-->
				<!--<div class="video-container">-->
					<!--<video :style="fixStyle" autoplay loop muted class="fillWidth" v-on:canplay="canplay">-->
						<!--<source src="../../assets/video/星空.mp4" type="video/mp4"/>-->
						<!--浏览器不支持 video 标签，建议升级浏览器。-->
						<!--<source src="../../assets/video/星空.mp4" type="video/webm"/>-->
						<!--浏览器不支持 video 标签，建议升级浏览器。-->
					<!--</video>-->
				<!--</div>-->
			<!--</div>-->
		<div class="login-wrapper">
			<h1>潍科后台管理系统</h1>
		</div>
		<el-form :model="model" :rules="rules" ref="model" status-icon>
			<h2>登录</h2>
			<!--prop触发验证-->
			<el-form-item prop="user_name">
				<el-input suffix-icon="el-icon-s-custom" v-model="model.user_name">
					<template slot="prepend"><span class="prepend-text" >用户名：</span></template>
				</el-input>
			</el-form-item>
			<!--prop触发验证-->
			<el-form-item prop="user_pwd">
				<el-input suffix-icon="el-icon-lock" v-model="model.user_pwd" showPassword clearable>
					<template slot="prepend"><span class="prepend-text" >密码：</span></template>
				</el-input>
			</el-form-item>
			<el-form-item class="button-wrapper">
				<el-button plain @click="dd('model')">登录</el-button>
			</el-form-item>
		</el-form>
		<div class="wrapper">
			<ul class="bg-bubbles">
				<li></li>
				<li></li>
				<li></li>
				<li></li>
				<li></li>
				<li></li>
				<li></li>
				<li></li>
				<li></li>
				<li></li>
			</ul>
		</div>
	</div>
</template>

<script type="text/ecmascript-6">
	export default {
	  name:"Login",
		data(){
	          return{
                          vedioCanPlay: false,
                          fixStyle: '',
	            model:{
	                    user_name:"",
		            user_pwd:""
	            },
                    rules:{
                            user_name: [
                                    { required: true, message: '* 用户名称不能为空', trigger: 'blur' },
                                    { min: 3, max: 20, message: '* 长度在 3 到 20个字符', trigger: 'blur' },
	                            {
                                            required: true,
                                            pattern: /^[\u4e00-\u9fa5_ a-zA-Z0-9.-]+$/ ,
		                            message:'姓名不支持特殊字符',
		                            trigger: ' blur'
				 }
                            ],
                            user_pwd: [
                                    { required: true, message: '请输入用户密码', trigger: 'blur' },
                                    { min: 3, max: 20, message: '长度在 3 到 20个字符', trigger: 'blur' }
                            ],
                    },
	          };
		},
		methods:{
                        canplay() {
                                this.vedioCanPlay = true
                        },
		        dd(model){
                                this.$refs[model].validate((valid) => {
                                        if (valid) {
							this.login();
                                        } else {

                                                return false;
                                        }
                                });
		        },
		        async login(){
		                let token = await this.$http({
			                url:"/user/login",
			                method:"post",
			                data:this.model
		                });
		                sessionStorage.setItem("token",token);
		                sessionStorage.setItem("user_name",this.model.user_name);
		                this.$router.replace('/home');
		        },
		},
//                mounted: function() { //屏幕自适应
//                        window.onresize = () => {
//                                const windowWidth = document.body.clientWidth;
//                                const windowHeight = document.body.clientHeight;
//                                const windowAspectRatio = windowHeight / windowWidth;
//                                let videoWidth;
//                                let videoHeight;
//                                if (windowAspectRatio < 0.5625) {
//                                        videoWidth = windowWidth;
//                                        videoHeight = videoWidth * 0.5625;
//                                        this.fixStyle = {
//                                                height: windowWidth * 0.5625 + 'px',
//                                                width: windowWidth + 'px',
//                                                'margin-bottom': (windowHeight - videoHeight) / 2 + 'px',
//                                                'margin-left': 'initial'
//                                        }
//                                } else {
//                                        videoHeight = windowHeight;
//                                        videoWidth = videoHeight / 0.5625;
//                                        this.fixStyle = {
//                                                height: windowHeight + 'px',
//                                                width: windowHeight / 0.5625 + 'px',
//                                                'margin-left': (windowWidth - videoWidth) / 2 + 'px',
//                                                'margin-bottom': 'initial'
//                                        }
//                                }
//                        };
//                        window.onresize()
//                        (function(){
//                                //存放图片路径的数组
//                                let imgSrcArr = [
//                                        "../../assets/video/星空.mp4",
//                                ];
//
//
//                                let imgWrap = [];
//
//
//                                function preloadImg(arr) {
//                                        for(let i =0; i< arr.length ;i++) {
//                                                imgWrap[i] = new Image();
//                                                imgWrap[i].src = arr[i];
//                                        }
//                                }
//                                preloadImg(imgSrcArr);
//                        })()
//                }
	};
</script>

<style lang="stylus" scoped>
	.pg
		width:100%;
		height:100%;
		/*background url("./login_bg.png")*/

	@keyframes aaa
		0%{
			transform: rotateY(0deg) translateY(-80%)
		}
		100%{
			transform: rotateY(30deg) translateY(-20%)
		}

	@keyframes bbb {
		0%{
			transform: translateY(-50%) translateX(0%)
		}
		100%{
			transform: translateY(-50%) translateX(25%)
		}
	}
	.login-wrapper
		perspective: 500px
		position: fixed
		transform: translateY(-50%) translateX(0%)
		top: 50%
		right: 50%
		animation: bbb 1s 1.5s
		z-index 2
		animation-fill-mode: forwards
		h1
			border-bottom: 1px solid cadetblue
			transform: rotateY(0deg)
			transform-origin: left center
			font-size: 80px
			text-shadow: -10px 10px 10px #000
			white-space: nowrap
			padding:30px 50px
			/*color: #b0b0b0*/
			color #FFFFFF
			position: relative
			animation: aaa 1.5s
			animation-fill-mode: forwards
	/*&:before            !* &反选前一级的自身 *!
		content: "教学管理系统"
		position: absolute
		top: 100%
		left: 0
		padding: 30px 50px
		transform: scaleY(-0.8)    !* Y轴的负值，把字倒过来 *!
		opacity: .8*/

	.el-form
		width: 400px
		padding: 30px 40px
		border-radius: 8px
		position: fixed
		top: 50%
		left: 50%
		transform: translate(0,-50%)
		box-shadow: 0 0 15px #b0b0b0
		z-index: 2
		background-color #FFFFFF
		h2
			text-align: center
			font-size: 28px
			margin-bottom: 10px
			color: #666
		.prepend-text
			display: inline-block
			width: 40px
		.button-wrapper
			text-align: right
	.el-form-item
		.el-form-item__error
			font-size 12px

	.wrapper {
		background: #50a3a2;
		background: -webkit-linear-gradient(top left, #0093E9 0%, #80D0C7 100%);
		background: linear-gradient(to bottom right, #0093E9 0%, #80D0C7 100%);
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		overflow: hidden;
	}
	.bg-bubbles {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 1;
	}
	.bg-bubbles li {
		position: absolute;
		list-style: none;
		display: block;
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background-color: rgba(255, 255, 255, 0.15);
		bottom: -160px;
		-webkit-animation: square 25s infinite;
		animation: square 25s infinite;
		-webkit-transition-timing-function: linear;
		transition-timing-function: linear;
	}
	.bg-bubbles li:nth-child(1) {
		left: 10%;
	}
	.bg-bubbles li:nth-child(2) {
		left: 20%;
		width: 80px;
		height: 80px;
		-webkit-animation-delay: 2s;
		animation-delay: 2s;
		-webkit-animation-duration: 17s;
		animation-duration: 17s;
	}
	.bg-bubbles li:nth-child(3) {
		left: 25%;
		-webkit-animation-delay: 4s;
		animation-delay: 4s;
	}
	.bg-bubbles li:nth-child(4) {
		left: 40%;
		width: 60px;
		height: 60px;
		-webkit-animation-duration: 22s;
		animation-duration: 22s;
		background-color: rgba(255, 255, 255, 0.25);
	}
	.bg-bubbles li:nth-child(5) {
		left: 70%;
	}
	.bg-bubbles li:nth-child(6) {
		left: 80%;
		width: 120px;
		height: 120px;
		-webkit-animation-delay: 3s;
		animation-delay: 3s;
		background-color: rgba(255, 255, 255, 0.2);
	}
	.bg-bubbles li:nth-child(7) {
		left: 32%;
		width: 160px;
		height: 160px;
		-webkit-animation-delay: 7s;
		animation-delay: 7s;
	}
	.bg-bubbles li:nth-child(8) {
		left: 55%;
		width: 20px;
		height: 20px;
		-webkit-animation-delay: 15s;
		animation-delay: 15s;
		-webkit-animation-duration: 40s;
		animation-duration: 40s;
	}
	.bg-bubbles li:nth-child(9) {
		left: 25%;
		width: 10px;
		height: 10px;
		-webkit-animation-delay: 2s;
		animation-delay: 2s;
		-webkit-animation-duration: 40s;
		animation-duration: 40s;
		background-color: rgba(255, 255, 255, 0.3);
	}
	.bg-bubbles li:nth-child(10) {
		left: 90%;
		width: 160px;
		height: 160px;
		-webkit-animation-delay: 11s;
		animation-delay: 11s;
	}
	@-webkit-keyframes square {
		0% {
			-webkit-transform: translateY(0);
			transform: translateY(0);
		}
		100% {
			-webkit-transform: translateY(-700px) rotate(600deg);
			transform: translateY(-700px) rotate(600deg);
		}
	}
	@keyframes square {
		0% {
			-webkit-transform: translateY(0);
			transform: translateY(0);
		}
		100% {
			-webkit-transform: translateY(-700px) rotate(600deg);
			transform: translateY(-700px) rotate(600deg);
		}
	}
</style>