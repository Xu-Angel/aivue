const BASE_URL = 'http://192.168.50.93:8080'

/**
 * 封装基于fetch的网络请求方法
 * @param {Object} options - 请求配置项
 * @param {string} options.url - 请求URL
 * @param {string} [options.method='POST'] - 请求方法
 * @param {Object} [options.data] - 请求数据
 * @param {Object} [options.headers] - 请求头
 * @param {number} [options.timeout=30000] - 超时时间(ms)
 * @param {number} [options.retries=2] - 重试次数
 * @returns {Promise} 返回Promise对象
 */
const request = async (options) => {
  const {
    url,
    method = 'POST',
    data = null,
    headers = {},
    timeout = 30000,
    retries = 2
  } = options

  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeout)

  const defaultHeaders = {
    'Content-Type': 'application/json'
  }

  const config = {
    method,
    headers: { ...defaultHeaders, ...headers },
    signal: controller.signal,
    mode: 'cors',
    credentials: 'include'
  }

  if (data) {
    config.body = JSON.stringify(data)
  }

  // 请求拦截器：添加baseURL
  const fullUrl = url.startsWith('http') ? url : `${BASE_URL}${url}`

  const fetchWithRetry = async (retryCount) => {
    try {
      const response = await fetch(fullUrl, config)
      clearTimeout(id)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      // 响应拦截器：统一处理返回数据格式
      return result.data !== undefined ? result : { data: result }
    } catch (error) {
      if (retryCount > 0 && error.name !== 'AbortError') {
        return fetchWithRetry(retryCount - 1)
      }
      throw error
    }
  }

  return fetchWithRetry(retries)
}

export default request