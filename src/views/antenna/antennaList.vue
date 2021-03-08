<template>
  <div class="agent content">
		<div class="search_cont">
			<!-- <label>部署油站：</label><el-input v-model="gasStationName" placeholder=""></el-input> -->
			<label>天线编码：</label><el-input v-model="antennaCode" placeholder=""></el-input>
			<label>天线厂家：</label><el-input v-model="deviceManufacturer" placeholder=""></el-input>
			<!-- <el-select v-model="deviceManufacturer">
				<el-option v-for="i in deviceManufacturers" :label="i.name" :value="i.value" :key="i.value"></el-option>
			</el-select> -->
			<el-button type="primary" class="search_btn" @click="search">搜索</el-button>
			<el-button class="anniu" @click="addFillMachine">添加天线</el-button>
		</div>
		<div class="table">
			<el-table
				:data="tableData"
				border
				style="width: 95%">
				<el-table-column
					prop="id"
					label="编号"
					align="center"
					>
				</el-table-column>
				<el-table-column
					prop="antennaCode"
					label="天线编号"
					align="center"
					>
				</el-table-column>
				<el-table-column
					prop="deviceManufacturer"
					label="供应商"
					align="center"
					>
				</el-table-column>
				<el-table-column
					prop="deviceModel"
					label="型号"
					align="center"
					>
				</el-table-column>
				<!-- <el-table-column
					prop="gasStationName"
					label="部署油站"
					align="center"
					>
				</el-table-column>
				<el-table-column
					prop="lx"
					label="对应加油机"
					align="center"
					>
				</el-table-column> -->
				<el-table-column
					prop="antennaStatusCnt"
					label="运行状态"
					align="center"
					>
				</el-table-column>
				<el-table-column
					prop="bindInformation"
					label="绑定信息"
					align="center"
					>
					<template slot-scope="scope">
						<span>{{scope.row.bindInformation}}</span>
					</template>
				</el-table-column>
				<!-- <el-table-column
					prop="totalCapacity"
					label="资产状态"
					align="center"
					>
				</el-table-column> -->
				<el-table-column label="操作" width="230" align="center">
					<template slot-scope="scope">
						<el-button size="mini" type="primary" @click="editRow(scope.$index,scope.row)">编辑</el-button>
						<el-button size="mini" type="danger" @click="delRow(scope.$index,scope.row)">删除</el-button>
						<el-button size="mini" type="primary" @click="bindGasStation(scope.$index,scope.row)">绑定</el-button>
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
			<el-dialog
				title="绑定天线"
				:visible.sync="binddialog"
				width="50%"
			>
				<el-row>
					<el-col :span="12">
						<label>天线ID：</label><span>{{detail.antennaId}}</span>
					</el-col>
					<el-col :span="12">
						<label>天线品牌：</label><span>{{detail.deviceManufacturer}}</span>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<label>天线型号：</label><span>{{detail.deviceModel}}</span>
					</el-col>
				</el-row>
				<label style="line-height: 40px;">绑定油站：</label>
				<el-row>
					<el-col :span="8">
						<el-select v-model="merchantCode" @change="merchantChange">
							<el-option v-for="i in merchantList" :label="i.merchantName" :value="i.id" :key="i.id"></el-option>
						</el-select>
						
					</el-col>
					<el-col :span="8">
						<el-select v-model="gasStationName" @change="gasStationChange">
							<el-option v-for="i in allGasStations" :label="i.stationName" :value="i.id" :key="i.id"></el-option>
						</el-select>
					</el-col>
					<el-col :span="8">
						<el-select v-model="laneName">
							<el-option v-for="i in allLanes" :label="i.parkingLotCode" :value="i.id" :key="i.id"></el-option>
						</el-select>
					</el-col>
					<!-- <el-col :span="12" v-if="detail.gasStationType === 1">
						<el-select v-model="carPosiitonName">
							<el-option v-for="i in allCarPositions" :label="i.name" :value="i.carPositionId" :key="i.carPositionId"></el-option>
						</el-select>
					</el-col> -->
				</el-row>
				<span slot="footer" class="dialog-footer">
					<el-button @click="binddialog = false">取 消</el-button>
					<el-button type="primary" @click="sureBindAntenna">确 定</el-button>
				</span>
			</el-dialog>
		</div>
  </div>
	
</template>

<script>
import { 
	getAntennaList,
	deleteAntenna,
	getAllStationNames,
	getAllVehiclePark,
	bindAntennaForStation,
	getMerchantList
} from '@/api/api'
export default {
	data(){
		return {
			deviceManufacturer: '', //天线厂家
			antennaCode: '', //天线编码
			deviceManufacturers: [{name: '厂家1',value: 1},
				{name: '厂家2',value: 2},],
			tableData: [
				{
					antennaId: '0001',
					antennaCode: 'HGN86878J',
					deviceManufacturer: '金溢科技',
					deviceModel: 'V60',
					antennaStatus: '正常'
				}
			],
			gasStationName: '',
			laneName: '',
			carPosiitonName: '',
			allGasStations: [
				{
					stationName: '北环加油站',
					id: 1,
					gasStationType: 1, //1车位 2车道
				},
				{
					stationName: '冠德加油站',
					id: 2,
					gasStationType: 2, //1车位 2车道
				}
			],
			allLanes: [
				{
					parkingLotCode: '车道1',
					id: 1
				},
				{
					parkingLotCode: '车道2',
					id: 2
				},
			],
			detail: {
				antennaId: '',
				deviceManufacturer: '',
				deviceModel: '',
				gasStationType: 1
			},
			pageParams: {
				current_page: 1,
				page_size: 10,
				total: 0
			},
			binddialog: false,
			merchantList: [],
			merchantCode: ''
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
				deviceManufacturer: this.deviceManufacturer,
				antennaCode: this.antennaCode,
				current: this.pageParams.current_page,
				size: this.pageParams.page_size
			}
			getAntennaList(params).then(res => {
				let tampData = res.respData
				this.tableData = tampData.list
				this.pageParams.page_size = tampData.size
				this.pageParams.total = tampData.total
			})
		},
		getMerchantList(){
			//获取归属主体
      getMerchantList().then(res => {
        this.merchantList = res.respData.merchantNameVOList
        // this.merchantCode = res.respData.merchantNameVOList[0].id
      })
		},
		//添加天线
		addFillMachine(){
			this.$router.push({path: '/antenna/addAntenna'})
		},
		//天线绑定油站
		async bindGasStation(index, row){
			await this.getMerchantList()
			this.binddialog = true
			const { id, deviceManufacturer, deviceModel } = row
			this.detail.antennaId = id
			this.detail.deviceManufacturer = deviceManufacturer
			this.detail.deviceModel = deviceModel
			this.merchantCode = ''
			this.gasStationName = ''
			this.laneName = ''
		},
		//选择商户
		merchantChange(val){
			console.log("id:",val)
			let params = {
				merchantId: val
			}
			getAllStationNames(params).then(res => {
				if(res.bizCode === "SUCCESS"){
					this.allGasStations = res.respData
				}
			})
		},
		gasStationChange(val){
			let tempArr = this.allGasStations.filter(item => {
				return item.id === val
			})
			this.detail.gasStationType = tempArr[0].gasStationType
			console.log(val)
			let params = {
				id: val
			}
			getAllVehiclePark(params).then(res => {
				if(res.bizCode === "SUCCESS"){
					this.allLanes = res.respData
				}
			})
		},
		sureBindAntenna(){
			let params = {
				antennaId: this.detail.antennaId,
				merchantCode: this.merchantCode,
				stationId: this.gasStationName,
				parkAneId: this.laneName,
			}
			bindAntennaForStation(params).then(res => {
				if(res.bizCode === "SUCCESS"){
					this.$message({
						message: '绑定成功',
						type: 'success'
					});
					this.binddialog = false
				}
			})
		},
		//搜索
		search(){
			this.pageParams.current_page = 1
			this.getInitData()
		},
		editRow(index,row){
			// this.$store.dispatch('user/setAntennaPage', this.pageParams.current_page)
			this.$router.push({path: '/antenna/addAntenna', query: { id: row.id }})
			// console.log("row:",row)
		},
		//删除
		delRow(index,row){
			let params = {
				id: row.id
			}
			this.$confirm("确定要删除吗", "提示", {
					confirmButtonText: '确定',
					cancelButtonText: '取消'
			}).then(()=>{
				deleteAntenna(params).then(res => {
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
	.search_btn{
		margin-left: 15px;
	}
	.el-row{
		margin: 10px 0;
	}
</style>

