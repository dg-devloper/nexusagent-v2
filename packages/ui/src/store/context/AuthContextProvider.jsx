import { useState } from 'react'
import PropTypes from 'prop-types'
import AuthContext from './AuthContext'
import authAPi from '@/api/auth'

const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState({ user: null, isAuthenticated: false })
    let [token, setToken] = useState(localStorage.getItem('site') || '')

    const getData = async (cb) => {
        try {
            const response = await authAPi.getUser()

            if (response.data) {
                setUser({
                    user: {
                        id: response.data.id,
                        name: response.data.name
                    },
                    isAuthenticated: true
                })
            }
        } catch (error) {
            localStorage.removeItem('site')
            setToken('')
            setUser({
                user: null,
                isAuthenticated: false
            })

            cb()
        }
    }

    return <AuthContext.Provider value={{ user, setUser, getData, token, setToken }}>{children}</AuthContext.Provider>
}

AuthContextProvider.propTypes = {
    children: PropTypes.any
}

export default AuthContextProvider
