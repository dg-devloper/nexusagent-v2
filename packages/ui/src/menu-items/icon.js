// assets
import {
    IconUsersGroup,
    IconHierarchy,
    IconBuildingStore,
    IconKey,
    IconTool,
    IconLock,
    IconRobot,
    IconVariable,
    IconFiles,
    IconFlower,
    IconBasketStar,
    IconBriefcaseFilled,
    IconSettingsAutomation,
    IconCloudLock,
    IconWorldCog
} from '@tabler/icons-react'

const icons = {
    IconUsersGroup,
    IconHierarchy,
    IconBuildingStore,
    IconKey,
    IconTool,
    IconLock,
    IconRobot,
    IconVariable,
    IconFiles,
    IconFlower,
    IconWorldCog,
    IconBriefcaseFilled,
    IconSettingsAutomation,
    IconCloudLock,
    IconBasketStar
}

const AppIcon = {
    chatbot: {
        icon: icons.IconFlower
    },
    chatflow: {
        icon: icons.IconHierarchy,
        headerTitle: 'Agent Flow',
        description: `Create and manage a single, customized workflow for your agent. This menu allows you to design interactive conversation paths, integrate functionalities, and tailor the agent's behavior to meet specific needs. Perfect for building focused and efficient solutions.`
    },
    agentflows: {
        icon: icons.IconUsersGroup,
        headerTitle: 'Multi-Agent Flow',
        description: `Design and manage workflows that incorporate multiple agents within a single flow. This menu enables you to create interconnected agents, define their roles, and build complex, collaborative interactions to handle diverse scenarios effectively.`
    },
    assistants: {
        icon: icons.IconRobot,
        headerTitle: 'Flow Assistant',
        description: 'lorem'
    },
    marketplaces: {
        icon: icons.IconBriefcaseFilled,
        headerTitle: 'Marketplace',
        description: `Discover and access a wide range of plugins, templates, and integrations to extend the functionality of Nexus Agent. The Marketplace provides tools and resources to enhance workflows, streamline processes, and integrate seamlessly with third-party services.`
    },
    tools: {
        icon: icons.IconWorldCog,
        headerTitle: 'Integration Tool',
        description: `Discover and configure various tools to enhance your workflows. Integrate external functionalities, automate tasks, and expand the capabilities of your flows effortlessly`
    },
    config: {
        icon: icons.IconSettingsAutomation,
        headerTitle: 'Setting',
        description: 'lorem'
    },
    credential: {
        icon: icons.IconCloudLock,
        headerTitle: 'Credential',
        description: `Securely store and manage authentication details such as API keys and tokens. This menu ensures easy and safe integration with third-party services required for your workflows.`
    },
    variables: {
        icon: icons.IconVariable,
        headerTitle: 'Variable',
        description: `Define and manage dynamic variables to personalize workflows and automate processes. This menu allows you to configure reusable data points for seamless flow customization.`
    },
    apikey: {
        icon: icons.IconKey,
        headerTitle: 'API Key',
        description: `Generate and manage API keys for secure access to Nexus Agent services or integration with external applications. Control and monitor access to your workflows effectively.`
    },
    documentStores: {
        icon: icons.IconFiles,
        headerTitle: 'Library',
        description: `Organize, store, and access important documents for use in workflows. This menu provides a centralized repository to manage knowledge bases and support your flow processes.`
    }
}

export default AppIcon
