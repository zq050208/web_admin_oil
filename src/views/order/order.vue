<template>
	<div class="content">
		<el-card class="search_cont box-card">
			<label>油站名称：</label><el-input v-model="searchData.stationName" placeholder=""></el-input>
			<label>订单号：</label><el-input v-model="searchData.transactionNo" placeholder=""></el-input>
			<!-- <label>地址：</label><el-input v-model="searchData.address" placeholder=""></el-input> -->
			<label>支付状态：</label>
			<el-select v-model="searchData.status" @change="payStatusChange">
				<el-option v-for="i in allPayStatus" :label="i.status" :value="i.id" :key="i.id"></el-option>
			</el-select>
			<el-button type="primary" class="anniu" @click="search" style="margin-left: 10px;">搜索</el-button>
		</el-card>
		<div class="table">
			<el-table
				:data="tableData"
				border
				style="width: 95%"
				:header-row-style="{
					'background-color': '#fafafa',
				}"
			>
				<el-table-column
					prop="transactionNo"
					label="订单号"
					align="center"
					>
				</el-table-column>
				<el-table-column
					prop="stationName"
					label="油站名称"
					align="center"
					>
				</el-table-column>
				<!-- <el-table-column
					prop="fillingMachineCode"
					label="油机"
					align="center"
					>
				</el-table-column> -->
				<el-table-column
					prop="oilGunNo"
					label="枪号"
					align="center"
					>
				</el-table-column>
				<el-table-column
					prop="oilsVarieties"
					label="油号"
					align="center"
					>
				</el-table-column>
				<el-table-column
					prop="amount"
					label="结算金额"
					align="center"
					>
					<template slot-scope="scope">
						<span>{{scope.row.amount/100}}</span>
					</template>
				</el-table-column>
				<el-table-column
					prop="status"
					label="订单状态"
					align="center"
					>
          <template slot-scope="scope">
						<span v-if="scope.row.status.toLowerCase() === 'unpaid'">未支付</span>
						<span v-if="scope.row.status.toLowerCase() === 'paid'">已支付</span>
						<span v-if="scope.row.status.toLowerCase() === 'settled'">已结算</span>
						<span v-if="scope.row.status.toLowerCase() === 'close'">交易关闭</span>
					</template>
				</el-table-column>
				<el-table-column
					prop="payTime"
					label="支付时间"
					align="center"
					>
				</el-table-column>
				<el-table-column
					prop="address"
					label="地址"
					align="center"
					>
				</el-table-column>
				<el-table-column label="操作" width="230" align="center">
					<template slot-scope="scope">
						<!-- <el-button size="mini" type="primary" plain @click="refund(scope.$index,scope.row)">退款</el-button> -->
						<el-button size="mini" type="primary" plain @click="detail(scope.$index,scope.row)">详情</el-button>
						
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
import { getOrderList } from '@/api/api'
export default {
components: {},
	data(){
		return {
			searchData: {
				stationName: '',
				transactionNo: '',
				address: '',
			},
			tableData: [],
			pageParams: {
				current_page: 1,
				page_size: 10,
				total: 0
			},
			allPayStatus: [
				{status: '全部', id: 0},
				{status: '未支付', id: 1},
				{status: '已支付', id: 2},
			]
		}
	},
	computed:{
		
	},
	mounted(){
		this.getInitData()
	},
	methods:{
		getInitData(){
			const params = {
				current: this.pageParams.current_page,
				size: this.pageParams.page_size,
				...this.searchData
			}
			getOrderList(params).then(res => {
				if(res.bizCode === "SUCCESS"){
					let tempData = res.respData[0]
					this.tableData = tempData.payOrderList
					this.pageParams.page_size = tempData.size
					this.pageParams.total = tempData.total
				}
			})
		},
		search(){
			console.log(this.$router)
			this.getInitData()
		},
		//查看订单详情
		detail(){

		},
    // refund(index,row){

    // },
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
