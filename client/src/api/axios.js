import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('flordesil_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const msg = error.response.data?.error || ''
      if (msg.includes('expirado')) {
        localStorage.removeItem('flordesil_token')
        window.location.href = '/admin/login?expirado=1'
      }
    }
    return Promise.reject(error)
  }
)

export default api
