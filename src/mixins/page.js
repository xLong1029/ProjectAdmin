/*
 * 模块 : 页面页码相关配置
 * 作者 : 罗永梅（381612175@qq.com）
 * 日期 : 2017-8-31
 * 版本 : version 1.0
 */
import Common from 'common/common.js'

export default {
  data() {
    return {
      // 分页设置
      page: {
        // 总记录数
        totalSize: 0,
        // 是否有下一页
        hasNextPage: false,
        // 是否有上一页
        hasPreviousPage: false,
        // 总页数
        pageCount: 0,
        // 当前页码
        page: 1,
        // 每页显示记录数
        size: 10,
        // 每条条数切换的配置
        pageSizeOpts: [10, 20, 30, 40]
      },
    }
  },
  methods: {
    // 设置页码
    setPage(result){
      this.page.totalSize = result.count;
      this.page.pageCount = result.pages;
    },
    // 切换页码
    changePage(page) {
      // 修改当前页码
      this.page.page = page;
      // 更新列表
      this.updateList();
    },
    // 切换每页条数
    changePageSize(size){
      console.log(size)
      // 修改当前显示条数
      this.page.size = size;
      // 更新列表
      this.updateList();
    },
    // 更新列表信息
    updateList(){
      // 判断是否为查询状态
      this.isQuery ? this.getTableList(true) : this.getTableList();
    },
  }
}
