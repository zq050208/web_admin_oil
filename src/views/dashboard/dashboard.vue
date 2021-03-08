<template>
	<div class="content">
		<el-card class="search_cont">
			<label>油站名称：</label><el-input v-model="searchData.stationName" placeholder=""></el-input>
			<label>油站编号：</label><el-input v-model="searchData.stationCode" placeholder=""></el-input>
			<label>地址关键字：</label><el-input v-model="searchData.address" placeholder=""></el-input>
			<el-button type="primary" class="anniu" @click="search">搜索</el-button>
			<el-button type="primary" class="anniu" @click="addStation">添加油站</el-button>
		</el-card>
		<div class="table">
			<el-table
				:data="tableData"
				border
				style="width: 95%">
				<el-table-column
					prop="stationCode"
					label="油站编号"
					align="center"
					>
				</el-table-column>
				<el-table-column
					prop="stationName"
					label="油站名称"
					align="center"
					>
				</el-table-column>
				<el-table-column
					prop="provinceCnt"
					label="省份"
					align="center"
					>
				</el-table-column>
				<el-table-column
					prop="cityCnt"
					label="地市"
					align="center"
					>
				</el-table-column>
				<el-table-column
					prop="countyCnt"
					label="区"
					align="center"
					>
				</el-table-column>
				<el-table-column
					prop="address"
					label="地址"
					align="center"
					>
				</el-table-column>
				<el-table-column
					label="经纬度"
					align="center"
					>
					 	<template slot-scope="scope">
							<span>{{scope.row.longitude}}/</span>
							<span>{{scope.row.latitude}}</span>
						</template>
				</el-table-column>
				<el-table-column
					label="运营模式"
					align="center"
					>
					 	<template slot-scope="scope">
							<span>{{scope.row.stationType === 1 ? '车位' : '车道'}}</span>
						</template>
				</el-table-column>
				<el-table-column
					prop="parkingLotQuantity"
					label="车位/道数"
					align="center"
					>
					<template slot-scope="scope">
							<span>{{scope.row.parkingLotQuantity || scope.row.vehicleAneQuantity}}</span>
						</template>
				</el-table-column>
				<!-- <el-table-column
					prop="vehicleAneQuantity"
					label="车道数"
					align="center"
					>
				</el-table-column> -->
				<el-table-column label="操作" width="230" align="center">
					<template slot-scope="scope">
						<el-button size="mini" type="primary" @click="viewDetail(scope.$index,scope.row)">编辑</el-button>
						<!-- <el-button size="mini" type="primary" @click="editRow(scope.$index,scope.row)">编辑</el-button> -->
						<el-button size="mini" type="danger" @click="delRow(scope.$index,scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
				:current-page="pageParams.current_page"
				:page-sizes="[10, 20, 30, 50]"
				:page-size="pageParams.page_size"
				layout="total, sizes, prev, pager, next, jumper"
				:total="pageParams.total"
				style="margin-top: 20px;text-align:center;"
			>
			</el-pagination>	
		</div>
	</div>
</template>

<script>
import { getGasStationList, deleteGasStation } from '@/api/api'
export default {
	components: {},
	data(){
		return {
			searchData: {
				stationName: '',
				stationCode: '',
				address: '',
			},
			tableData: [],
			pageParams: {
				current_page: 1,
				page_size: 10,
				total: 0
			}
		}
	},
	computed:{
		
	},
	mounted(){
		// console.log("store:",this.$store.state.user.gasStationPage)
		this.getInitData()
	},
	methods:{
		getInitData(){
			const params = {
				current: this.pageParams.current_page,
				size: this.pageParams.page_size,
				...this.searchData
			}
			getGasStationList(params).then(res => {
				console.log("res:",res.respData)
				let tempData = res.respData
				this.tableData = tempData.list
				this.pageParams.page_size = tempData.size
				this.pageParams.total = tempData.total
			})
		},
		search(){
			this.pageParams.current_page = 1
			this.getInitData()
		},
		//添加油站
		addStation(){
			this.$router.push('/dashboard/addGasStation')
		},
		// 查看详情
		viewDetail(index, row){
			// this.$store.dispatch('user/setGasStationPage', this.pageParams.current_page)
			this.$router.push({path: '/dashboard/detail', query: { id: row.id }})
		},
		//编辑
		editRow(index, row){
			// this.$store.dispatch('user/setGasStationPage', this.pageParams.current_page)
			this.$router.push({path: '/dashboard/addGasStation', query: {id: row.id}})
		},
		//删除
		delRow(index,row){
			console.log(row)
			let params = {
				id: row.id
			}
			this.$confirm("确定要删除吗", "提示", {
					confirmButtonText: '确定',
					cancelButtonText: '取消'
			}).then(()=>{
				deleteGasStation(params).then(res => {
				if(res.bizCode === "SUCCESS"){
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						if(this.tableData.length === 1 && this.pageParams.current_page != 1){
							this.pageParams.current_page--
						}
						this.getInitData()
					}
				})
			})
		},
		//分页
		handleSizeChange(val) {
			this.pageParams.page_size = val
			this.getInitData()
			console.log(`每页 ${val} 条`);
		},
		handleCurrentChange(val) {
			this.pageParams.current_page = val
			this.getInitData()
			console.log(`当前页: ${val}`);
		}
	},
	created(){
		

	}
}
</script>

<style scoped lang="less">
	.content .el-input{
		width: 200px;
		margin-right: 10px;
	}
	.search_cont{
		margin-bottom: 10px;
		width: 95%;
	}

	
    

</style>
