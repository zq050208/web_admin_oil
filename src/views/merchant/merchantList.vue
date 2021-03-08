<template>
  <div class="agent content">
		<el-card class="search_cont box-card">
			<label>商户编码：</label><el-input v-model="merchantCode" placeholder=""></el-input>
			<label>商户名称：</label><el-input v-model="merchantName" placeholder=""></el-input>
			<el-button type="primary" class="anniu" @click="search" style="margin-left:10px;">搜索</el-button>
			<el-button class="anniu" @click="addMerchant">添加商户</el-button>
		</el-card>
		<div class="table">
			<el-table
				:data="tableData"
				border
				style="width: 95%">
				<el-table-column
					prop="id"
					label="商户id"
					align="center"
					>
				</el-table-column>
				<el-table-column
					prop="merchantCode"
					label="商户编码"
					align="center"
					>
				</el-table-column>
				<el-table-column
					prop="merchantName"
					label="商户名称"
					align="center"
					>
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
import { getMerchantList, editStore, deleteStore, } from '@/api/api'
import config from '@/api/config'
export default {
	data(){
		return {
			imgBaseUrl: config.UPLOAD_IMG_BASE_URL,
			merchantName: '',
			merchantCode: '',
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
				merchantCode: this.merchantCode,
        merchantName: this.merchantName,
				current: this.pageParams.current_page,
				size: this.pageParams.page_size
			}
			getMerchantList(params).then(res => {
        if(res.bizCode === "SUCCESS"){
          let tempData = res.respData
          this.tableData = tempData.merchantNameVOList
          this.pageParams.page_size = tempData.size
          this.pageParams.total = tempData.total
        }
			})
    },
   
		//搜索
		search(){
			this.pageParams.current_page = 1
			this.getInitData()
    },
    addMerchant(){
      this.$router.push('/merchant/addMerchant')
    },
		editRow(index,row){
			this.dialogVisible = true
			this.antennaForm = row
			// this.$store.dispatch('user/setMerchantPage', this.pageParams.current_page)
			this.$router.push({path: '/merchant/addMerchant', query: { merchantId: row.id }})
			console.log("row:",row)
		},
		//删除
		delRow(index,row){
			let params = {
				id: row.id,
			}
			this.$confirm("确定删除吗", "提示", {
				confirmButtonText: '确定',
				cancelButtonText: '取消'
			}).then(()=>{
				deleteStore(params).then(res => {
					if(res.bizCode === "SUCCESS"){
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

