<template>
	<div>
		<div style="height:30px;line-height: 20px;font-size: 12px;"><span class="hint1"></span>闲置<span class="hint2"></span>使用中</div>
		<el-row :gutter="20">
			<el-col v-for="item in classrooms" :key="item.clsr_id" :span="6">
				<el-card shadow="hover" :class="{ inUse:item.clsr_occupy}">
					<span v-text="item.clsr_name" style="font-size:13px;"></span>
					<div class="mask">
						<div class="button-wrapper">
							<el-button type="text" @click.stop="beginUpdateClsr(item)" class="el-icon-edit-outline"></el-button>
							<el-button type="text" @click.stop="removeClsr(item)" v-if="item.clsr_occupy === 0" class="el-icon-delete"></el-button>
						</div>
					</div>
				</el-card>
			</el-col>
			<el-col :span="6" @click.native="beginAddClsr">
				<el-card class="btn-add"><i class="el-icon-plus"></i></el-card>
			</el-col>
		</el-row>
		<el-dialog :modal="false" :title="edit.mode?'新增':'修改'" :visible.sync="edit.isEdit" :show-close="false"
		           :close-on-click-modal="false"
		           :close-on-press-escape="false" width="600">
			<el-form label-width="100px" :model="edit.model" :rules="edit.rules" ref="form">
				<el-form-item label="教室名字:" prop="clsr_name">
					<el-input v-model.trim="edit.model.clsr_name"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="edit.isEdit=false">取消</el-button>
				<el-button type="primary" @click="saveClsr">确定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script type="text/ecmascript-6">
        import {createNamespacedHelpers} from 'vuex';
        let {mapState,mapActions} = createNamespacedHelpers('room');

        export default {
                name:"Classroom",
                data(){
                        return{
                                edit:{
                                        isEdit:false,
                                        mode:true,
                                        model:{clsr_id:-1,clsr_name:'',clsr_occupy:0},
                                        rules: {                 //表单自定义验证
                                                clsr_name: [
                                                        {
                                                                validator: (rule, value, callback) =>{
                                                                        //ES6中的解构赋值
                                                                        let {clsr_id, clsr_name} = this.edit.model;
                                                                        if(value.length === 0)
                                                                                callback(new Error('* 角色名称不能为空'));
                                                                        else if(value.length < 2 || value.length > 20)
                                                                                callback(new Error('* 角色名称长度2-20'));
                                                                        else if(this.classrooms.some(item => item.clsr_id !== clsr_id && item.clsr_name === clsr_name))
                                                                                callback(new Error('* 当前教室名称已经存在'));
                                                                        else
                                                                                callback(); //直接调用不给参数，表示验证通过
                                                                },
                                                                trigger: 'blur'
                                                        }
                                                ],
                                        }
                                },
                        };
                },
                computed:{
                        ...mapState(['classrooms']),
                },
                methods:{
                        ...mapActions(['init','addClsr','updateClsr']),
                        removeClsr(node){
                                this.$confirm(`你确定要删除 "${node.clsr_name}"节点吗?`, '警告', {type: 'warning'})
                                        .then(async() =>{
                                                await this.$store.dispatch('room/removeClsr',node.clsr_id);
                                                this.$message({
                                                        message: `"${ node.clsr_name }"节点，删除成功! 请刷新页面，启用新菜单...`,
                                                        type: 'success'
                                                });
                                        })
                                        .catch(() =>{
                                        });
                        },
                        beginAddClsr(){
                                this.$refs.form && this.$refs.form.resetFields();  //重置表单
                                this.edit.mode = true;
                                this.edit.model.clsr_name='';
                                this.edit.isEdit=true;
                        },
                        beginUpdateClsr(node){
                                this.$refs.form && this.$refs.form.resetFields();  //重置表单
                                this.edit.mode = false;
                                this.edit.model.clsr_name=node.clsr_name;
                                this.edit.model.clsr_id=node.clsr_id;
                                this.edit.model.clsr_occupy=node.clsr_occupy;
                                this.edit.isEdit=true;
                        },
                        saveClsr(){
                                //防止用户什么都不输入就点击确定 所以要加一层保护
                                //找到这个表单 设置validate返回一个回调函数，把要执行的代码在回调函数里执行
                                this.$refs.form.validate(async valid =>{
                                        //如果返回的是假  就说明没有输入直接点击  直接return出去
                                        if(!valid) return;
                                        if(this.edit.mode){
                                                await this.addClsr(Object.assign({},this.edit.model));
                                                this.$message({
                                                        message: `"${ this.edit.model.clsr_name }"教室，添加成功! 请刷新页面，启用新菜单...`,
                                                        type: 'success'
                                                });
                                        }else{
                                                await this.updateClsr(Object.assign({},this.edit.model));
                                                this.$message({
                                                        message: `"${ this.edit.model.clsr_name }"教室，更改成功! 请刷新页面，启用新菜单...`,
                                                        type: 'success'
                                                });
                                        }
                                        this.edit.isEdit = false;
                                })
                        },
                },
              async created(){
                       await this.init();
                },
        };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
	span.hint2
		margin-left:15px
		display:inline-block
		width:30px
		height:30px
		background-color: #F9CC9D
	span.hint1
		display:inline-block
		width:30px
		height:30px
		background-color: #B8FFAC
	.el-col
		margin-top:30px
		margin-bottom:20px
		.btn-add
		.el-card.inUse
			background-color: #F9CC9D
		.el-card
			position:relative
			text-align: center
			padding: 10% 0
			cursor:pointer
			background-color: #B8FFAC
			position relative
			&.btn-add
				border: 1px dashed #0094ff
				border-radius: 4px
				background-color:transparent;
				color:#0094ff

	.mask
		position: absolute;
		left: 0;
		top: -130px;
		width: 100%;
		height: 100%;
		background-color: rgba(0,0,0,.6);
		display: flex;
		justify-content: center;
		align-items: center;
		.button-wrapper
			width 100%
			height:100%;
			display flex
			align-items center
			justify-content center
			.el-button
				font-size 30px
				width:50px;
				height:50px;
				color #FFFFFF

	.el-card:hover .mask
		top 0

</style>