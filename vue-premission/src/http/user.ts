import { request } from '../axios/index.ts'
const loginApi = (data: any) => {
    return request.get('/login', data)
}

const getUserPression = (data: any) => {
    console.log("获取用户信息的传参",data)
    return request.post('/userInfo',data)
}
export {loginApi,getUserPression}