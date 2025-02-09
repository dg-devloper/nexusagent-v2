import client from './client'

const getUser = () => client.get(`/`)
const login = (body) => client.post(`/auth/login`, body)
const register = (body) => client.post('/auth/register', body)
const verification = (body) => client.post('/auth/verification', body)
const oauth = () => client.get('/auth/oauth')

export default {
    login,
    getUser,
    register,
    verification,
    oauth
}
