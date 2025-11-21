import axios from 'axios'
import { ElMessage, ElLoading } from 'element-plus' // 假设使用 Element Plus，可替换为其他 UI 库
import { getToken } from './auth.ts' // 假设存在获取 token 的工具函数

// 创建 axios 实例
const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // 从环境变量获取基础地址
  timeout: 10000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  }
})

// 加载动画实例
let loadingInstance: any = null
var __axiosCancelSources: Array<any> = []
// 请求拦截器
service.interceptors.request.use(
  (config: any) => {
    // 显示加载动画（可根据需求调整）
    if (config.showLoading !== false) {
      loadingInstance = ElLoading.service({
        lock: true,
        text: '加载中...',
        background: 'rgba(0, 0, 0, 0.1)'
      })
    }

    // 添加 token（根据实际认证方式调整）
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // 处理取消请求（给每个请求添加唯一标识）
    if (config.cancelToken === undefined) {
      const source = axios.CancelToken.source()
      config.cancelToken = source.token
      // 可将 source 存储到全局，用于主动取消请求
      __axiosCancelSources = __axiosCancelSources || []
      __axiosCancelSources.push(source)
    }

    return config
  },
  (error) => {
    // 关闭加载动画
    if (loadingInstance) loadingInstance.close()
    ElMessage.error('请求参数错误')
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    // 关闭加载动画
    if (loadingInstance) loadingInstance.close()

    const { data } = response
    const { code, message } = data

    // 根据后端约定的状态码处理
    if (code === 200) {
      // 成功状态
      return data.data // 直接返回业务数据
    } else if (code === 401) {
      // 未授权（token 过期或无效）
      ElMessage.error(message || '登录已过期，请重新登录')
      // 可在这里添加跳转到登录页的逻辑
      // router.push('/login')
      return Promise.reject(new Error(message || 'Unauthorized'))
    } else {
      // 其他错误状态
      ElMessage.error(message || '操作失败')
      return Promise.reject(new Error(message || 'Error'))
    }
  },
  (error) => {
    // 关闭加载动画
    if (loadingInstance) loadingInstance.close()

    // 处理取消请求的错误
    if (axios.isCancel(error)) {
      console.log('请求已取消:', error.message)
      return Promise.reject(new Error('请求已取消'))
    }

    // 处理网络错误
    let errorMsg = '网络异常，请稍后重试'
    if (error.response) {
      const { status } = error.response
      switch (status) {
        case 404:
          errorMsg = '请求地址不存在'
          break
        case 500:
          errorMsg = '服务器内部错误'
          break
        // 可添加其他状态码处理
        default:
          errorMsg = `请求错误 (${status})`
      }
    }
    ElMessage.error(errorMsg)
    return Promise.reject(error)
  }
)

// 主动取消所有未完成的请求（如路由切换时）
export const cancelAllRequests = () => {
  if (__axiosCancelSources && __axiosCancelSources.length) {
    __axiosCancelSources.forEach(source => {
      source.cancel('请求已取消')
    })
    __axiosCancelSources = []
  }
}

// 封装常用请求方法
export const request = {
  get(url: string, params = {}, config = {}) {
    return service.get(url, { params, ...config })
  },
  post(url: string, data = {}, config = {}) {
    return service.post(url, data, config)
  },
  put(url: string, data = {}, config = {}) {
    return service.put(url, data, config)
  },
  delete(url: string, params = {}, config = {}) {
    return service.delete(url, { params, ...config })
  }
}

export default service