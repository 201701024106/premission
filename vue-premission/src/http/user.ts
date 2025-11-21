import { request } from '../axios/index.ts'
const loginApi = (data: any) => {
    return request.get('/login', data)
}

const getUserPression = (data: any) => {
    return request.post('/userInfo',data)
}
export {loginApi,getUserPression}