<template>
	<el-container class="page-container">
		<el-header height="60px">
			<!--<video id="video" src="../../assets/music/TheWordAlive-RISE.mp3" controls="controls" hidden="hidden" autoplay="autoplay"  loop="loop"> </video>-->
			<h1>后台管理系统V.9.12.05</h1>
			<div>
				<span class="user-right">
					<em v-text="name"></em>欢迎登录
				</span>
				<el-button size="small" class="logout" @click="Logout" type="primary">退出登录</el-button>
			</div>
		</el-header>
		<el-container>
			<el-aside width="240px">
				<el-menu background-color="#36404E" text-color="#fff" active-text-color="#ffd04b"
					:default-active="activeFuncKey" @select="menuSelectHandler">
					<template v-for="item in menuData" >
						<el-menu-item v-if="item.func_key" :index="item.func_key" :key="item.func_id">
							<i class="el-icon-menu"></i>
							<span slot="title" v-text="item.func_name"></span>
						</el-menu-item>
						<el-submenu v-else :index="item.func_id.toString()"  :key="item.func_id">
							<template slot="title">
								<i class="el-icon-setting"></i>
								<span v-text="item.func_name"></span>
							</template>
							<template v-if="item.children">
								<el-menu-item v-for="item2 in item.children" :index="item2.func_key"  :key="item2.func_id">
									<i class="el-icon-menu"></i>
									<span v-text="item2.func_name"></span>
								</el-menu-item>
							</template>
						</el-submenu>
					</template>
				</el-menu>
			</el-aside>
			<el-container>
				<el-main style="min-width: 1200px">
					<el-tabs type="card" closable v-model="activeFuncKey" @tab-remove="tabRemoveHandler">
						<!--在menu找到func_key与activeFuncKeys中的值想到拿到func_name-->
						<el-tab-pane :label="menu.find(item => item.func_key === func_key).func_name"
						             v-for="(func_key,i) in activeFuncKeys" :key="i" :name="func_key">
							<component :is="views[func_key]"></component>
						</el-tab-pane>
					</el-tabs>
				</el-main>
				<el-footer height="40px">
					版权所有&copy; 2009H5全体同学 网址：www.taobao.com
				</el-footer>
			</el-container>
		</el-container>
	</el-container>
</template>

<script type="text/ecmascript-6">
	import views from '../../views';
	import ElSubmenu from "../../../node_modules/element-ui/packages/menu/src/submenu.vue";

        import {createNamespacedHelpers} from 'vuex';
        import ElButton from "../../../node_modules/element-ui/packages/button/src/button.vue";
        let {mapActions} = createNamespacedHelpers('dictionary');


        export default {
                components: {
                        ElButton,
                        ElSubmenu},
                name:"Home",
		data(){
	          return{
	                  views,
                          name:sessionStorage.getItem("user_name"),
	                  activeFuncKey:"",
		          activeFuncKeys:[],
                          menu: []
	          };
		},
		computed:{
                        menuData(){
		                let result = [];
		                //一级分类无父节点
		                this.menu.filter(item => item.func_fid === 0).forEach(item =>{
					let node = Object.assign({},item);
					//找一级分类的子节点
					let children = this.menu.filter(item2 => item2.func_fid === item.func_id);
					if(children.length > 0){
					        node.children =[];
					        children.forEach(item2 =>node.children.push(Object.assign({},item2)));
					}
					result.push(node);
		                });
		                return result;
			}
		},
		methods:{
                        ...mapActions({'employeeInit': 'init'}),
		        menuSelectHandler(index,indexPath){
		                this.activeFuncKey= index ;
					if(this.activeFuncKeys.indexOf(index) === -1){
                                                this.activeFuncKeys.push(index);
					}
		        },
                        tabRemoveHandler(name){
		                this.activeFuncKeys.splice(this.activeFuncKeys.indexOf(name),1);
		                if(this.activeFuncKeys.indexOf(this.activeFuncKey) === -1){   //刚刚删除的是激活的
		                        this.activeFuncKey = this.activeFuncKeys[0] || "";
		                }
                        },
			Logout(){
                                sessionStorage.removeItem("token");
                                sessionStorage.removeItem("user_name");
                                this.$router.replace({path:"/login"});
			}
		},
	        async created(){
                        this.$store.dispatch("dictionary/init");
		         this.menu = await this.$http({
			         url:"/user/getmenu",
			         method:"post"
		         });
//                         this.employeeInit();

                }
	};
</script>

<style lang="stylus" type="text/stylus" scoped>
	span{
		font-size 15px
	}
	.page-container{
		height:100%;
		min-width 1500px;
	}
	.el-header{
		background-color: #6b7995;
		color : #fff;
		font-size 20px
		display flex
		align-items center
		justify-content space-between
	}
	.el-header em{
		font-style normal
		color #0ad2ff
	}
	.el-header .logout{
		font-size 13px
		padding 2px
	}
	.el-aside{
		background-color #36404E;
	}
	 .el-menu{
		border-right : none;
	}
	.el-main{
		background-color:#fffefafc;
		position relative;
	}
	.el-footer{
		background-color #536072;
		/*display flex*/
		line-height 40px
		text-align center
		align-items center
		color: #fff;
		font-size: 12px;
	}
	.el-button{
		font:14px;
		padding 12px 10px
	}
</style>