import { lazy } from 'react'

// project imports
import Loadable from '@/ui-component/loading/Loadable'

const Login = Loadable(lazy(() => import('@/views/login/index')))
const Register = Loadable(lazy(() => import('@/views/register/index')))
const Token = Loadable(lazy(() => import('@/views/register/token')))
const GooglePage = Loadable(lazy(() => import('@/views/login/GooglePage')))

// ==============================|| MAIN ROUTING ||============================== //

const AuthRoute = {
    path: '/',
    children: [
        {
            path: '/login',
            element: <Login />
        },
        {
            path: '/register',
            element: <Register />
        },
        {
            path: '/veriftoken',
            element: <Token />
        },
        {
            path: '/verifoauth',
            element: <GooglePage />
        }
    ]
}

export default AuthRoute
