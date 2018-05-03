import tools from '@/tools'

export default {
	// Api方法
  Login:(obj) => {
    return new Promise((resolve,reject)=>{
      tools.HttpPost(`/api/ProjectDeclare/Passport/AdminLogin`, obj)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },
  TokenCheck:(token)=>{
    return new Promise((resolve,reject)=>{
      tools.HttpGet(`/api/ProjectDeclare/Passport/CheckToken?token=${token}`)
        .then(res=>resolve(res))
        .then(err=>reject(err))
    })
  }
}
