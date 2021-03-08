<template>
  <div class="agent content">
		<el-card class="search_cont box-card">
     
      <label>日期：</label> 
      <el-date-picker
        v-model="searchData.startDate"
        type="date"
        placeholder="开始日期">
      </el-date-picker> -
      <el-date-picker
        v-model="searchData.endDate"
        type="date"
        placeholder="结束日期">
      </el-date-picker>
      <label>反馈类型：</label>
      <el-select v-model="searchData.suggestType" @change="suggestTypeChange">
        <el-option v-for="i in allSuggestType" :label="i.name" :value="i.id" :key="i.id"></el-option>
      </el-select>
			<el-button type="primary" class="anniu" @click="search" style="margin-left:10px;">搜索</el-button>
		</el-card>
		<div class="table">
			<el-table
				:data="tableData"
				border
				style="width: 95%">
				<el-table-column
					prop="wxMchId"
					label="用户昵称"
					align="center"
					>
				</el-table-column>
				<el-table-column
					prop="merchantId"
					label="反馈时间"
					align="center"
					>
				</el-table-column>
				<el-table-column
					prop="merchantId"
					label="反馈类型"
					align="center"
					>
				</el-table-column>
        <el-table-column
					prop="merchantId"
					label="问题描述"
					align="center"
					>
				</el-table-column>
				<el-table-column
					prop="businessLicense"
					label="图片"
					align="center"
					>
					<template slot-scope="scope">
						<img :src="imgBaseUrl + scope.row.businessLicense" alt="" class="td_img">
					</template>
				</el-table-column>
        <el-table-column
					prop="merchantId"
					label="联系方式"
					align="center"
					>
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
      searchData: {
        startDate: '',
        endDate: '',
        suggestType: 1,
      },
      allSuggestType: [
        {
          name: '使用习惯',
          id: 1
        },
        {
          name: '功能问题',
          id: 2
        },
        {
          name: '其他',
          id: 3
        },
      ],
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
    //车辆用途
    carTypeChange(val){

    },
    //审核状态
    authStatusChange(val){

    },
		//搜索
		search(){
			this.pageParams.current_page = 1
			this.getInitData()
    },
		check(index,row){
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
  .content /deep/ .el-card__body{
    width: 100%;
  }
	.search_cont{
    display: flex;
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

