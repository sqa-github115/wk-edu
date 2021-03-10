<!--<template>-->
	<!--<div>-->
		<!--<button @click="$emit('update:a',100)">按钮</button>-->
		<!--<button @click="$emit('rt',100)">按钮2</button>-->
		<!--&lt;!&ndash;默认插槽&ndash;&gt;-->
		<!--<slot></slot>-->
		<!--&lt;!&ndash;具名插槽&ndash;&gt;-->
		<!--<div>-->
			<!--<slot name="a"></slot>-->
		<!--</div>-->
		<!--<div>-->
			<!--<slot name="a1"></slot>-->
		<!--</div>-->
		<!--<div>-->
			<!--<slot name="a2" n="张三" :nnn="asc" :age="20"></slot>-->
		<!--</div>-->
	<!--</div>-->
<!--</template>-->

<!--<script type="text/ecmascript-6">-->
        <!--export default {-->
                <!--name: "Demo",-->
	        <!--props: ["a","r"],      //外部传进来的数据-->
		<!--model: {-->
                        <!--prop:"r",-->
			<!--event: "rt"     //要发射的事件名称-->
		<!--},-->
	        <!--data(){-->
                        <!--return{-->
                                <!--asc:{-->
                                        <!--aac:10,-->
	                                <!--bbc:11-->
                                <!--}-->
                        <!--};-->
	        <!--},-->
	        <!--computed:{-->

	        <!--},-->
	        <!--watch:{-->

	        <!--},-->
	        <!--methods:{}-->
        <!--};-->
<!--</script>-->

<!--<style lang="stylus" rel="stylesheet/stylus" scoped>-->

<!--</style>-->