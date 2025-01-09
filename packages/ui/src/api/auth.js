import client from './client'

const getUser = () => client.get(`/users`)
const login = (body) => client.post(`/auth/login`, body)

export default {
    login,
    getUser
}
