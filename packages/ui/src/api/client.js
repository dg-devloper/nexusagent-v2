import axios from 'axios'
import { baseURL } from '@/store/constant'

const apiClient = axios.create({
    baseURL: `${baseURL}/api/v1`,
    headers: {
        'Content-type': 'application/json',
        'x-request-from': 'internal'
    }
})

apiClient.interceptors.request.use(function (config) {
    const username = localStorage.getItem('username')
    const password = localStorage.getItem('password')

    if (username && password) {
        config.auth = {
            username,
            password
        }
    }

    return config
})

apiClient.interceptors.request.use(
    function (config) {
        const token = localStorage.getItem('site')

        if (token) {
            config.headers['Authorization'] = token
        }
        return config
    },
    (error) => {
        Promise.reject(error)
    }
)

export default apiClient
