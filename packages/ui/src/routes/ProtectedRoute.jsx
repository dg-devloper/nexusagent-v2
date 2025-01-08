import { useAuth } from '@/hooks/useAuth'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router'

const ProtectedRoute = ({ children }) => {
    const navigate = useNavigate()
    const { user, token } = useAuth()

    useEffect(() => {
        // user.login()
        if (!token) {
            navigate('/login')
        }
    }, [token, navigate])

    return children
}

ProtectedRoute.propTypes = {
    children: PropTypes.elementType
}

export default ProtectedRoute
