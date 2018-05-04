/**
 * Created by Administrator on 2018/5/4.
 */
import tools from '@/tools'
export default {
  //api方法
  //修改文章内容
  //删除文章
  Delete:(infoList)=>{
    return new Promise((resolve,reject)=>{
      tools.HttpGet(`/api/AdminService/Information/Delete`,infoList)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },
  //启用
  Enabled:(infoList)=>{
    return new Promise((resolve,reject)=>{
      tools.HttpPost(`/api/AdminService/Information/Enabled`,infoList)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },
  Disable:(infoList)=>{
    return new Promise((resolve,reject)=>{
      tools.HttpPost(`/api/AdminService/Information/Disable`,infoList)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },
  // List:(info)=>{
  //   return new Promise((resolve,reject)=>{
  //     tools.HttpGet(`/api/AdminService/Information/Disable`,{
  //
  //     })
  //       .then(res => resolve(res))
  //       .catch(err => reject(err))
  //   })
  // }
}
