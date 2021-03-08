<template>
  <div class="agent content">
		<div class="search_cont">
			<label>商户名称：</label><el-input v-model="merchantName" placeholder=""></el-input>
			<label>商户地址：</label><el-input v-model="businessAddress" placeholder=""></el-input>
			<label>审批状态：</label>
      <el-select v-model="approveStatus">
        <el-option v-for="item in allStatus" :label="item.name" :value="item.value" :key="item.value"></el-option>
      </el-select>
			<el-button type="primary" class="anniu" @click="search" style="margin-left:10px;">搜索</el-button>
			<el-button class="anniu" @click="addMerchant">添加商户</el-button>
		</div>
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
					label="商户编号"
					align="center"
					>
				</el-table-column>
				<el-table-column
					prop="payPattern"
					label="支付模式"
					align="center"
					>
					<template slot-scope="scope">
						<span v-if="scope.row.payPattern == 1">微信商户支付模式</span>
					</template>
				</el-table-column>
				<el-table-column
					prop="merchantName"
					label="商户名称"
					align="center"
					>
				</el-table-column>
				<el-table-column
					prop="classification"
					label="主体分类"
					align="center"
					>
					<template slot-scope="scope">
						<span v-if="scope.row.classification == 1">民营企业</span>
						<span v-if="scope.row.classification == 2">国营企业</span>
					</template>
				</el-table-column>
				<el-table-column
					prop="businessLicense"
					label="营业执照"
					align="center"
					>
					<template slot-scope="scope">
						<img :src="imgBaseUrl + scope.row.businessLicense" alt="" class="td_img">
					</template>
				</el-table-column>
				<el-table-column
					prop="businessPermission"
					label="经营许可证"
					align="center"
					>
					<template slot-scope="scope">
						<img :src="imgBaseUrl + scope.row.businessPermission" alt="" class="td_img">
					</template>
				</el-table-column>
				<el-table-column
					prop="logo"
					label="logo"
					align="center"
					>
					<template slot-scope="scope">
						<img :src="imgBaseUrl + scope.row.logo" alt="" class="td_img">
					</template>
				</el-table-column>
				<el-table-column
					prop="businessAddress"
					label="主体地址"
					align="center"
					>
				</el-table-column>
				<el-table-column
					label="状态"
					align="center"
					>
					<template slot-scope="scope">
						<span :class="['item-status', {'active': scope.row.approveStatus == 0}]" @click="changeStatus(scope.$index, 0, scope.row)">未审批</span>
						<span :class="['item-status', {'active': scope.row.approveStatus == 1}]" @click="changeStatus(scope.$index, 1, scope.row)">审批通过</span>
						<span :class="['item-status', {'active': scope.row.approveStatus == 2}]" @click="changeStatus(scope.$index, 2, scope.row)">商户冻结</span>
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
			antennaForm: {
				supplier: '', //供应商
				antennaId: '', //天线编码
				model: '', //天线型号
				gasStationName: ''
      },
      allStatus: [
				{name: '未审批',value: 0},
        {name: '审批通过',value: 1},
				{name: '商户冻结',value: 2},
      ],
			allGasStations: [
				{name: '油站1',value: 1},
				{name: '油站2',value: 2},
			],
			totalCapacitys: [
				{name: '正常',value: 1},
				{name: '冻结',value: 2},
			],
			gasMerchines: [
				{name: '加油机1',value: 1},
				{name: '加油机2',value: 2},
			],
			rules: {
				name: [
					{ required: true, message: '请输入活动名称', trigger: 'blur' },
					{ min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
				],
			},
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
    addMerchant(){
      this.$router.push('/merchant/addMerchant')
    },
		editRow(index,row){
			this.dialogVisible = true
			this.antennaForm = row
			// this.$store.dispatch('user/setMerchantPage', this.pageParams.current_page)
			this.$router.push({path: '/merchant/addMerchant', query: { merchantId: row.merchantId }})
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

