/*
 * 模块 : 表格查询相关配置
 * 作者 : 罗永梅（381612175@qq.com）
 * 日期 : 2017-8-31
 * 版本 : version 1.0
 */
import Common from 'common/common.js'

export default {
	data() {
		return {
			// 判断是否是查询状态
			isQuery: false
		}
	},
	methods: {
    //获取日期
    getDate(date){
      this.infoForm.publishDate= date
    },
		// 获取查询开始日期
		getStartDate(date) {
			console.log('get start date:' + date);
      this.queryForm.sTime = date;
		},
		// 获取查询结束日期
		getEndDate(date) {
			console.log('get end date:' + date);
			this.queryForm.eTime = date;
		},
		// 查询
		// form:表单对象， getValid:是否需要验证表单
		query(form, getValid) {
			// 修改当前页码
			this.page.pageNo = 1;

			if(getValid == 'valid'){
				// 表单验证
				this.$refs[form].validate((valid)=>{
					// 传值true表示要筛选用户列表
					if (valid) this.getTableList(true);
					else this.$Message.warning('查询失败！填写有误');
				})
			}
			else this.getTableList(true);
		},
		// 删除查询对象属性（清空对象）
		clearQuery(){
			for(let key in this.queryForm){
				delete this.queryForm[key];
			}
		},
		// 重置查询内容
		resetQuery(form){
			// this.clearQuery();
			this.$refs[form].resetFields();
			if(this.queryForm.sTime) this.queryForm.sTime = '';
			if(this.queryForm.eTime) this.queryForm.eTime = '';
			this.getTableList();
		}
	}
}
