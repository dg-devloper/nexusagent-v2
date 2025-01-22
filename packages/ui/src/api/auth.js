import client from './client'

const getUser = () => client.get(`/`)
const login = (body) => client.post(`/auth/login`, body)

export default {
    login,
    getUser
}
