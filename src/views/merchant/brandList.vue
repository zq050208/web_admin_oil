<template>
  <div class="agent content">
		<el-card class="search_cont box-card">
			<label>品牌名称：</label><el-input v-model="merchantName" placeholder=""></el-input>
			<el-button type="primary" class="anniu" @click="search" style="margin-left:10px;">搜索</el-button>
			<el-button class="anniu" @click="addBrand">添加品牌</el-button>
		</el-card>
		<div class="table">
			<el-table
				:data="tableData"
				border
				style="width: 95%">
				<el-table-column
					prop="wxMchId"
					label="编号"
					align="center"
					>
				</el-table-column>
				<el-table-column
					prop="merchantId"
					label="品牌名称"
					align="center"
					>
				</el-table-column>
				<el-table-column
					prop="businessLicense"
					label="品牌Logo"
					align="center"
					>
					<template slot-scope="scope">
						<img :src="imgBaseUrl + scope.row.businessLicense" alt="" class="td_img">
					</template>
				</el-table-column>
				<el-table-column
					prop="businessPermission"
					label="运营图"
					align="center"
					>
					<template slot-scope="scope">
						<img :src="imgBaseUrl + scope.row.businessPermission" alt="" class="td_img">
					</template>
				</el-table-column>
				<el-table-column label="操作" width="230" align="center">
					<template slot-scope="scope">
						<el-button size="mini" type="primary" @click="editRow(scope.$index,scope.row)">编辑</el-button>
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
import { getStoreList, editStore, deleteStore } from '@/api/api'
import config from '@/api/config'
export default {
	data(){
		return {
			imgBaseUrl: config.UPLOAD_IMG_BASE_URL,
			merchantName: '',
			businessAddress: '',
			approveStatus: '',
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
		this.getInitData()
	},
	methods:{
		getInitData(){
			const params = {
				merchantName: this.merchantName,
				businessAddress: this.businessAddress,
				approveStatus: this.approveStatus,
				current: this.pageParams.current_page,
				size: this.pageParams.page_size
			}
			getStoreList(params).then(res => {
				this.tableData = res.data[0].records
				this.pageParams.page_size = res.data[0].size
				this.pageParams.total = res.data[0].total
				console.log("res:",res)
			})
		},
		//搜索
		search(){
			this.pageParams.current_page = 1
			this.getInitData()
    },
    addBrand(){
      this.$router.push('/merchant/addBrand')
    },
		editRow(index,row){
			this.dialogVisible = true
			// this.$store.dispatch('user/setMerchantPage', this.pageParams.current_page)
			this.$router.push({path: '/merchant/addBrand', query: { merchantId: row.merchantId }})
			console.log("row:",row)
		},
		changeStatus(index, status, row){
			this.$confirm("是否修改商户状态，修改状态会涉及商户结算的问题，请谨慎选择。", "提示", {
				confirmButtonText: '确定',
				cancelButtonText: '取消'
			}).then(()=>{
				let params = {
					merchantId: row.merchantId,
					approveStatus: status
				}
				editStore(params).then(res => {
					if(res.code === 0){
						this.$message({
							message: '修改成功',
							type: 'success'
						});
						this.tableData[index].approveStatus = status
					}
				})
			})
		},
		//删除
		delRow(index,row){
			let params = {
				merchantId: row.merchantId,
			}
			this.$confirm("确定删除吗", "提示", {
				confirmButtonText: '确定',
				cancelButtonText: '取消'
			}).then(()=>{
				deleteStore(params).then(res => {
					if(res.code === 0){
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getInitData()
					}
				})
			})
		},
		handleSizeChange(val) {
			this.pageParams.current_page = 1
			this.pageParams.page_size = val
			this.getInitData()
			// console.log(`每页 ${val} 条`);
		},
		handleCurrentChange(val) {
			this.pageParams.current_page = val
			this.getInitData()
			// console.log(`当前页: ${val}`);
		}

	},
	created(){
		
	}
}
</script>

<style scoped>
  .agent .el-input{
		width: 200px;
		margin-right: 10px;
	}
	.search_cont{
		margin-bottom: 10px;
		width: 95%;
	}
	.add_antenna_popup{
		position: absolute;
		top: 0;
		left: 0;
	}
	.el-form-item{
		width: 50%;
	}
	.item-status{
		display: inline-block;
		padding: 5px;
		border: 1px solid #eee;
		border-radius: 5px;
		margin-left: 2px;
		margin-top: 2px;
	}
	.item-status.active{
		background: #409EFF;
		color: #ffffff;
	}
	.td_img{
		width: 50px;
		/* height: 50px; */
	}
</style>

