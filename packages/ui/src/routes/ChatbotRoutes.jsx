import { lazy } from 'react'
import Loadable from '@/ui-component/loading/Loadable'

// chatbot routing
const ChatbotFull = Loadable(lazy(() => import('@/views/chatbot')))

// ==============================|| CHATBOT ROUTING ||============================== //

const ChatbotRoutes = {
    path: '/chatbot',
    children: [
        {
            path: ':id',
            element: <ChatbotFull />
        }
    ]
}

export default ChatbotRoutes
