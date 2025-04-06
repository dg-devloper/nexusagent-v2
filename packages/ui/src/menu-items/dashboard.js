import AppIcon from './icon'

const dashboard = {
    items: [
        {
            id: 'workspace-group',
            title: 'WORKSPACE',
            type: 'group',
            children: [
                {
                    id: 'flows-collapse',
                    title: 'AI Flows',
                    type: 'collapse',
                    icon: AppIcon.aiWorkspace.icon,
                    children: [
                        {
                            id: 'chatflows-item',
                            title: 'Flow Studio',
                            type: 'item',
                            url: '/chatflows',
                            icon: AppIcon.flowStudio.icon,
                            breadcrumbs: true
                        },
                        {
                            id: 'agentflows-item',
                            title: 'Team Agents',
                            type: 'item',
                            url: '/agentflows',
                            icon: AppIcon.teamAgents.icon,
                            breadcrumbs: true,
                            chip: '10'
                        },
                        {
                            id: 'assistants-item',
                            title: 'AI Assistant',
                            type: 'item',
                            url: '/assistants',
                            icon: AppIcon.aiAssistant.icon,
                            breadcrumbs: true
                        }
                    ]
                },
                {
                    id: 'document-stores-item',
                    title: 'Documents',
                    type: 'item',
                    url: '/document-stores',
                    icon: AppIcon.documentStores.icon,
                    breadcrumbs: true
                }
            ]
        },
        {
            id: 'extensions-group',
            title: 'EXTENSIONS',
            type: 'group',
            children: [
                {
                    id: 'plugins-item',
                    title: 'Plugins',
                    type: 'item',
                    url: '/marketplaces',
                    icon: AppIcon.marketplaces.icon,
                    breadcrumbs: true
                },
                {
                    id: 'integrations-item',
                    title: 'Integrations',
                    type: 'item',
                    url: '/tools',
                    icon: AppIcon.integrations.icon,
                    breadcrumbs: true
                },
                {
                    id: 'whatsapp',
                    title: 'Whatsapp',
                    type: 'item',
                    url: '/whatsapp',
                    icon: AppIcon.whatsapp.icon,
                    breadcrumbs: true
                }
            ]
        },
        {
            id: 'management-group',
            title: 'MANAGEMENT',
            type: 'group',
            children: [
                {
                    id: 'team-collapse',
                    title: 'Team',
                    type: 'collapse',
                    icon: AppIcon.teamAgents.icon,
                    children: [
                        {
                            id: 'members-item',
                            title: 'Members',
                            type: 'item',
                            url: '/members',
                            icon: AppIcon.members.icon,
                            chip: '12'
                        },
                        {
                            id: 'roles-item',
                            title: 'Roles',
                            type: 'item',
                            url: '/roles',
                            icon: AppIcon.roles.icon
                        }
                    ]
                },
                {
                    id: 'settings-collapse',
                    title: 'Settings',
                    type: 'collapse',
                    icon: AppIcon.controls.icon,
                    children: [
                        {
                            id: 'profile-item',
                            title: 'Profile',
                            type: 'item',
                            url: '/profile',
                            icon: AppIcon.profile.icon
                        },
                        {
                            id: 'security-item',
                            title: 'Security',
                            type: 'item',
                            url: '/credentials',
                            icon: AppIcon.security.icon
                        },
                        {
                            id: 'api-config-item',
                            title: 'API Config',
                            type: 'item',
                            url: '/variables',
                            icon: AppIcon.apiConfig.icon
                        }
                    ]
                }
            ]
        },
        {
            id: 'support-group',
            title: 'SUPPORT',
            type: 'group',
            children: [
                {
                    id: 'documentation-item',
                    title: 'Documentation',
                    type: 'item',
                    url: '/docs',
                    icon: AppIcon.documentation.icon,
                    breadcrumbs: true
                },
                {
                    id: 'help-item',
                    title: 'Help Center',
                    type: 'item',
                    url: '/support',
                    icon: AppIcon.support.icon,
                    breadcrumbs: true
                }
            ]
        }
    ]
}

export default dashboard
