import client from './client'

const getUser = (id) => client.get(`/users/${id}`)
const login = (body) => client.post(`/auth/login`, body)

export default {
    login,
    getUser
}
