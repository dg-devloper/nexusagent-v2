import { lazy } from 'react'

// project imports
import MainLayout from '@/layout/MainLayout'
import Loadable from '@/ui-component/loading/Loadable'

// home routing
const Home = Loadable(lazy(() => import('@/views/home')))

// coming soon page
const ComingSoon = Loadable(lazy(() => import('@/views/comingsoon')))

// chats routing
// const Chat = Loadable(lazy(() => import('@/views/chats')))

// chat prediction routing
const ChatPrediction = Loadable(lazy(() => import('@/views/chat')))

// config routing
const Config = Loadable(lazy(() => import('@/views/configs')))

// chatflows routing
const Chatflows = Loadable(lazy(() => import('@/views/chatflows')))

// agents routing
const Agentflows = Loadable(lazy(() => import('@/views/agentflows')))

// marketplaces routing
const Marketplaces = Loadable(lazy(() => import('@/views/marketplaces')))

// apikey routing
const APIKey = Loadable(lazy(() => import('@/views/apikey')))

// tools routing
const Tools = Loadable(lazy(() => import('@/views/tools')))

// whatsapp routing
const WhatsApp = Loadable(lazy(() => import('@/views/whatsapp')))

// assistants routing
const Assistants = Loadable(lazy(() => import('@/views/assistants')))
const OpenAIAssistantLayout = Loadable(lazy(() => import('@/views/assistants/openai/OpenAIAssistantLayout')))
const CustomAssistantLayout = Loadable(lazy(() => import('@/views/assistants/custom/CustomAssistantLayout')))
const CustomAssistantConfigurePreview = Loadable(lazy(() => import('@/views/assistants/custom/CustomAssistantConfigurePreview')))

// credentials routing
const Credentials = Loadable(lazy(() => import('@/views/credentials')))

// variables routing
const Variables = Loadable(lazy(() => import('@/views/variables')))

// documents routing
const Documents = Loadable(lazy(() => import('@/views/docstore')))
const DocumentStoreDetail = Loadable(lazy(() => import('@/views/docstore/DocumentStoreDetail')))
const ShowStoredChunks = Loadable(lazy(() => import('@/views/docstore/ShowStoredChunks')))
const LoaderConfigPreviewChunks = Loadable(lazy(() => import('@/views/docstore/LoaderConfigPreviewChunks')))
const VectorStoreConfigure = Loadable(lazy(() => import('@/views/docstore/VectorStoreConfigure')))
const VectorStoreQuery = Loadable(lazy(() => import('@/views/docstore/VectorStoreQuery')))

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
    path: '/',
    element: <MainLayout />,
    children: [
        {
            path: '/',
            element: <Home />
        },
        {
            path: '/whatsapp',
            element: <WhatsApp />
        },
        {
            path: '/chat/:predictionId',
            element: <ChatPrediction />
        },
        // {
        //     path: '/chat-ai/:predictionId',
        //     element: <ChatPrediction />
        // },
        {
            path: '/configs',
            element: <Config />
        },
        {
            path: '/chatflows',
            element: <Chatflows />
        },
        {
            path: '/agentflows',
            element: <Agentflows />
        },
        {
            path: '/marketplaces',
            element: <Marketplaces />
        },
        {
            path: '/apikey',
            element: <APIKey />
        },
        {
            path: '/tools',
            element: <Tools />
        },
        {
            path: '/assistants',
            element: <Assistants />
        },
        {
            path: '/assistants/custom',
            element: <CustomAssistantLayout />
        },
        {
            path: '/assistants/custom/:id',
            element: <CustomAssistantConfigurePreview />
        },
        {
            path: '/assistants/openai',
            element: <OpenAIAssistantLayout />
        },
        {
            path: '/credentials',
            element: <Credentials />
        },
        {
            path: '/variables',
            element: <Variables />
        },
        {
            path: '/document-stores',
            element: <Documents />
        },
        {
            path: '/document-stores/:id',
            element: <DocumentStoreDetail />
        },
        {
            path: '/document-stores/chunks/:id/:id',
            element: <ShowStoredChunks />
        },
        {
            path: '/document-stores/:id/:name',
            element: <LoaderConfigPreviewChunks />
        },
        {
            path: '/document-stores/vector/:id',
            element: <VectorStoreConfigure />
        },
        {
            path: '/document-stores/vector/:id/:docId',
            element: <VectorStoreConfigure />
        },
        {
            path: '/document-stores/query/:id',
            element: <VectorStoreQuery />
        },

        // Route untuk halaman yang belum tersedia
        {
            path: '/members',
            element: <ComingSoon />
        },
        {
            path: '/roles',
            element: <ComingSoon />
        },
        {
            path: '/profile',
            element: <ComingSoon />
        },
        {
            path: '/docs',
            element: <ComingSoon />
        },
        {
            path: '/support',
            element: <ComingSoon />
        },

        // Wildcard route untuk menangkap semua route yang tidak terdaftar
        {
            path: '*',
            element: <ComingSoon />
        }
    ]
}

export default MainRoutes
