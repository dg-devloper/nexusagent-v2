import { lazy } from 'react'

// project imports
import Loadable from '@/ui-component/loading/Loadable'

const Login = Loadable(lazy(() => import('@/views/login/index')))

// ==============================|| MAIN ROUTING ||============================== //

const AuthRoute = {
    path: '/',
    children: [
        {
            path: '/login',
            element: <Login />
        }
    ]
}

export default AuthRoute
