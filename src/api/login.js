import tools from '@/tools'

export default {
	// Api方法
  Login:(obj) => {
    return new Promise((resolve,reject)=>{
      tools.HttpPost('/api/ProjectDeclare/Passport/AdminLogin', obj)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },
}
