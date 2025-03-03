import { 
    IconMessage2,
    IconBrain,
    IconDatabase,
    IconLink,
    IconRobot,
    IconTools,
    IconFileText,
    IconVectorTriangle,
    IconMathFunction,
    IconWaveSine,
    IconSettings2,
    IconCode,
    IconRefresh,
    IconMicrophone,
    IconFolderSymlink,
    IconPrompt
} from '@tabler/icons-react'

const categoryIcons = {
    // Most used categories
    'Chat Models': IconMessage2,
    'Prompts': IconPrompt,
    'Memory': IconDatabase,
    'Chains': IconLink,
    'Agents': IconRobot,
    'Tools': IconTools,

    // Document handling
    'Document Loaders': IconFileText,
    'Text Splitters': IconCode,

    // Vector operations
    'Vector Stores': IconVectorTriangle,
    'Embeddings': IconMathFunction,

    // Special categories
    'Output Parsers': IconFolderSymlink,
    'Speech To Text': IconMicrophone,
    'Response Synthesizer': IconRefresh,
    'Analytics': IconWaveSine,
    'Utilities': IconSettings2,
    
    // Default for any other category
    'default': IconBrain
}

const CategoryIcon = ({ category, size = 20 }) => {
    const Icon = categoryIcons[category] || categoryIcons.default
    return <Icon size={size} />
}

export default CategoryIcon