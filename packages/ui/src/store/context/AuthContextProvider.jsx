import { useState } from 'react'
import PropTypes from 'prop-types'
import AuthContext from './AuthContext'
import authAPi from '@/api/auth'
import useApi from '@/hooks/useApi'

const AuthContextProvider = ({ children }) => {
    const getUser = useApi(authAPi.getUser)
    const [user, setUser] = useState({ user: null, isAuthenticated: false })
    let [token, setToken] = useState(localStorage.getItem('site') || '')

    const getData = async () => {
        try {
            const response = await getUser.request()
        } catch (error) {
            console.log(error)
        }

        // console.log(response)

        setUser({
            user: {
                id: 1,
                name: 'John Doe'
            },
            isAuthenticated: true
        })
    }

    return <AuthContext.Provider value={{ user, setUser, getData, token, setToken }}>{children}</AuthContext.Provider>
}

AuthContextProvider.propTypes = {
    children: PropTypes.any
}

export default AuthContextProvider
