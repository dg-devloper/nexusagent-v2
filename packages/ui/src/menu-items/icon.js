import {
    IconBrain,
    IconUsers,
    IconRobot,
    IconPuzzle,
    IconPlugConnected,
    IconFiles,
    IconUserCircle,
    IconShield,
    IconCode,
    IconBook,
    IconHeadset,
    IconDashboard,
    IconAdjustments,
    IconLock,
    IconUserPlus,
    IconUsersGroup,
    IconBrandWhatsapp
} from '@tabler/icons-react'

const AppIcon = {
    // Main Section
    dashboard: {
        icon: IconDashboard,
        headerTitle: 'Dashboard',
        description: 'Overview and analytics of your workspace'
    },
    aiWorkspace: {
        icon: IconBrain,
        headerTitle: 'AI Workspace',
        description: 'Manage your AI workflows and automations'
    },
    flowStudio: {
        icon: IconUserPlus,
        headerTitle: 'Flow Studio',
        description: 'Design and create AI conversation flows'
    },
    teamAgents: {
        icon: IconUsers,
        headerTitle: 'Team Agents',
        description: 'Manage multi-agent collaborations'
    },
    aiAssistant: {
        icon: IconRobot,
        headerTitle: 'AI Assistant',
        description: 'Configure AI assistants for automation'
    },
    whatsapp: {
        icon: IconBrandWhatsapp,
        headerTitle: 'Whatsapp',
        description: 'Manage your whatsapp conversations'
    },
    // Tools Section
    marketplaces: {
        icon: IconPuzzle,
        headerTitle: 'Plugins',
        description: 'Browse and manage plugins'
    },
    integrations: {
        icon: IconPlugConnected,
        headerTitle: 'Integrations',
        description: 'Connect external services and tools'
    },
    documentStores: {
        icon: IconFiles,
        headerTitle: 'Document Stores',
        description: 'Manage your document libraries'
    },

    // Team Section
    members: {
        icon: IconUsersGroup,
        headerTitle: 'Team Members',
        description: 'Manage team members and permissions'
    },
    roles: {
        icon: IconShield,
        headerTitle: 'Roles',
        description: 'Configure team roles and access'
    },

    // Settings Section
    profile: {
        icon: IconUserCircle,
        headerTitle: 'Profile',
        description: 'Manage your account settings'
    },
    controls: {
        icon: IconAdjustments,
        headerTitle: 'Controls',
        description: 'Configure system settings'
    },
    security: {
        icon: IconLock,
        headerTitle: 'Security',
        description: 'Manage security settings'
    },
    apiConfig: {
        icon: IconCode,
        headerTitle: 'API Configuration',
        description: 'Configure API settings'
    },

    // Help Section
    documentation: {
        icon: IconBook,
        headerTitle: 'Documentation',
        description: 'Access guides and documentation'
    },
    support: {
        icon: IconHeadset,
        headerTitle: 'Support',
        description: 'Get help and support'
    }
}

export default AppIcon
