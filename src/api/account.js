/**
 * Created by Administrator on 2018/5/3.
 */
import tools from '@/tools'

export default {
  // Api方法
  //修改密码
  pwd:(userId) => {
    return new Promise((resolve,reject)=>{
      tools.HttpPost(`/api/AdminService/User/GetInfo?userId=${userId}`)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },
  //删除用户
  Delete:(type,userList)=>{
    return new Promise((resolve,reject)=>{
      tools.HttpPost(`/api/AdminService/${type}/Delete`,userList)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },
  //启用账户
  Enabled:(type,userList)=>{
    return new Promise((resolve,reject)=>{
      tools.HttpPost(`/api/AdminService/${type}/Enabled`,userList)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },
  //添加用户
  Add:(userInfo)=>{
    return new Promise((resolve,reject)=>{
      tools.HttpPost(`/api/AdminService/User/Add`,{
        email:userInfo.email,
        mobile:userInfo.mobile,
        password:userInfo.password,
        type:userInfo.type,
        userName:userInfo.userName,
      })
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },
  //禁用账户
  Disable:(type,userList)=>{
    return new Promise((resolve,reject)=>{
      tools.HttpPost(`/api/AdminService/${type}/Disable`,userList)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },
  //获取列表
  List:(query,page,size)=>{
   return new Promise((resolve,reject)=>{
     tools.HttpGet(`/api/AdminService/User/List`,{
       email:query.email,
       etime:query.eTime,
       stime:query.sTime,
       mobile:query.mobile,
       page:page,
       size:size,
       state:query.state,
       userId:query.id,
     })
       .then(res => resolve(res))
       .catch(err => reject(err))
   })
  },
  //获取用户详情
  GetInfo:(userId)=>{
    return new Promise((resolve,reject)=>{
      tools.HttpGet(`/api/AdminService/User/GetInfo?userId=${userId}`)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },
  //修改用户信息
  Edit:(userInfo,id)=>{
    return new Promise((resolve,reject)=>{
      tools.HttpPost(`/api/AdminService/User/Edit`,{
        email:userInfo.email,
        mobile:userInfo.mobile,
        password:userInfo.password,
        type:userInfo.type,
        userName:userInfo.userName,
        id:id,
      })
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  }
}
