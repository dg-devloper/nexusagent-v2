// assets

import AppIcon from './icon'

// constant

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const dashboard = {
    id: 'dashboard',
    title: '',
    type: 'group',
    children: [
        {
            id: 'chats',
            title: 'Chatbot',
            type: 'collapse',
            url: '/dashboard',
            icon: AppIcon.chatbot.icon,
            breadcrumbs: true,
            children: [
                {
                    id: 'chatflows',
                    title: 'Agent Flow',
                    type: 'item',
                    url: '/chatflows',
                    icon: AppIcon.chatflow.icon
                },
                {
                    id: 'agentflows',
                    title: 'Multi-Agent Flow',
                    type: 'item',
                    url: '/agentflows',
                    icon: AppIcon.agentflows.icon,
                    breadcrumbs: true
                },
                {
                    id: 'assistants',
                    title: 'Flow Assistant',
                    type: 'item',
                    url: '/assistants',
                    icon: AppIcon.assistants.icon,
                    breadcrumbs: true
                }
            ]
        },
        {
            id: 'marketplaces',
            title: 'Marketplace',
            type: 'item',
            url: '/marketplaces',
            icon: AppIcon.marketplaces.icon,
            breadcrumbs: true
        },
        {
            id: 'tools',
            title: 'Integration',
            type: 'item',
            url: '/tools',
            icon: AppIcon.tools.icon,
            breadcrumbs: true
        },
        {
            id: 'configs',
            title: 'Setting',
            type: 'item',
            url: '/configs',
            icon: AppIcon.config.icon,
            breadcrumbs: true
        }

        // {
        //     id: 'chatflows',
        //     title: 'Chatflows',
        //     type: 'item',
        //     url: '/chatflows',
        //     icon: icons.IconHierarchy,
        //     breadcrumbs: true
        // },
        // {
        //     id: 'agentflows',
        //     title: 'Agentflows',
        //     type: 'item',
        //     url: '/agentflows',
        //     icon: icons.IconUsersGroup,
        //     breadcrumbs: true,
        //     isBeta: true
        // },
        // {
        //     id: 'assistants',
        //     title: 'Assistants',
        //     type: 'item',
        //     url: '/assistants',
        //     icon: icons.IconRobot,
        //     breadcrumbs: true
        // },
        // {
        //     id: 'tools',
        //     title: 'Tools',
        //     type: 'item',
        //     url: '/tools',
        //     icon: icons.IconTool,
        //     breadcrumbs: true
        // },
        // {
        //     id: 'credentials',
        //     title: 'Credentials',
        //     type: 'item',
        //     url: '/credentials',
        //     icon: icons.IconLock,
        //     breadcrumbs: true
        // },
        // {
        //     id: 'variables',
        //     title: 'Variables',
        //     type: 'item',
        //     url: '/variables',
        //     icon: icons.IconVariable,
        //     breadcrumbs: true
        // },
        // {
        //     id: 'apikey',
        //     title: 'API Keys',
        //     type: 'item',
        //     url: '/apikey',
        //     icon: icons.IconKey,
        //     breadcrumbs: true
        // },
        // {
        //     id: 'document-stores',
        //     title: 'Document Stores',
        //     type: 'item',
        //     url: '/document-stores',
        //     icon: icons.IconFiles,
        //     breadcrumbs: true
        // }
    ]
}

export default dashboard
