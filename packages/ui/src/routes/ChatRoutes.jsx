import { lazy } from 'react'
import Loadable from '@/ui-component/loading/Loadable'

// chat routing
const ChatView = Loadable(lazy(() => import('@/views/chat')))

// ==============================|| CHAT ROUTING ||============================== //

const ChatRoutes = {
    path: '/chat-ai',
    children: [
        {
            path: ':chatflowid',
            element: <ChatView />
        }
    ]
}

export default ChatRoutes
