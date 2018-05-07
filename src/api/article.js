/**
 * Created by Administrator on 2018/5/4.
 */
import tools from '@/tools'
export default {
  //api方法
  //修改文章内容
  Edit:(info,id)=>{
    return new Promise((resolve,reject)=>{
      tools.HttpPost(`/api/AdminService/Information/Edit`,{
        htmlContext:info.htmlContext,
        id:id,
        keyWord:info.keyWord,
        publishDate:info.publishDate,
        title:info.title,
      })
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },
  //删除文章
  Delete:(type,infoList)=>{
    return new Promise((resolve,reject)=>{
      tools.HttpPost(`/api/AdminService/${type}/Delete`,infoList)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },
  //启用
  Enabled:(type,infoList)=>{
    return new Promise((resolve,reject)=>{
      tools.HttpPost(`/api/AdminService/${type}/Enabled`,infoList)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },
  //禁用
  Disable:(type,infoList)=>{
    return new Promise((resolve,reject)=>{
      tools.HttpPost(`/api/AdminService/${type}/Disable`,infoList)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },
  //获取文章列表
  List:(query,page,size)=>{
    return new Promise((resolve,reject)=>{
      tools.HttpGet(`/api/AdminService/Information/List`,{
        etime:query.eTime,
        id:query.id,
        page:page,
        size:size,
        state:query.state,
        stime:query.sTime,
        title:query.title,
        webSite:query.webSite,
      })
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },
  //获取文章详细
  GetInfo:(id)=>{
    return new Promise((resolve,reject)=>{
      tools.HttpGet(`/api/AdminService/Information/GetInfo?id=${id}`)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  }
}
