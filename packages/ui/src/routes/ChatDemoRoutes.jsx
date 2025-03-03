import { lazy } from 'react';
import Loadable from '@/ui-component/loading/Loadable';

// Chat demo component
// const ChatDemo = Loadable(lazy(() => import('@/views/chat/demo')));

// ==============================|| CHAT DEMO ROUTES ||============================== //

const ChatDemoRoutes = {
    path: '/',
    children: [
        {
            path: '/chat-demo',
            element: <ChatDemo />
        },
        {
            path: '/chat-demo/:chatflowid',
            element: <ChatDemo />
        }
    ]
};

export default ChatDemoRoutes;
