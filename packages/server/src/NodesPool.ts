import { IComponentNodes, IComponentCredentials } from './Interface'
import path from 'path'
import { Dirent } from 'fs'
import { getNodeModulesPackagePath } from './utils'
import { promises } from 'fs'
import { ICommonObject } from 'flowise-components'
import logger from './utils/logger'
import { appConfig } from './AppConfig'

let NODE_FILTER = [
    'InMemory Cache',
    'Conversation Chain',
    'Conversational Retrieval QA Chain',
    'Multi Prompt Chain',
    'Sql Database Chain',
    'VectorDB QA Chain',
    'ChatAnthropic',
    'ChatGoogleGenerativeAI',
    'ChatGooglePaLM',
    'ChatMistralAI',
    'ChatOllama',
    'ChatOpenAI',
    'ChatOpenAI Custom',
    'ChatDeepseek',
    'API Loader',
    'Csv File',
    'Custom Document Loader',
    'Document Store',
    'Docx File',
    'Figma',
    'Folder with Files',
    'Github',
    'Json File',
    'Json Lines File',
    'Notion Database',
    'PDF Files',
    'Plain Text',
    'S3 File Loader',
    'Text File',
    'Unstructured File Loader',
    'VectorStore To Document',
    'Google GenerativeAI Embeddings',
    'MistralAI Embeddings',
    'OpenAI Embeddings',
    'OpenAI Embeddings Custom',
    'GooglePaLM',
    'OpenAI',
    'Buffer Memory',
    'Buffer Window Memory',
    'MongoDB Atlas Chat Memory',
    'OpenAI Moderation',
    'Simple Prompt Moderation',
    'CSV Output Parser',
    'Structured Output Parser',
    'Advanced Structured Output Parser',
    'Chat Prompt Template',
    'Few Shot Prompt Template',
    'Prompt Template',
    'Multi Query Retriever',
    'Prompt Retriever',
    'Vector Store Retriever',
    'Character Text Splitter',
    'Code Text Splitter',
    'Html-To-Markdown Text Splitter',
    'Markdown Text Splitter',
    'Recursive Character Text Splitter',
    'BraveSearch API',
    'Calculator',
    'Chain Tool',
    'Chatflow Tool',
    'Custom Tool',
    'Google Custom Search',
    'OpenAPI Toolkit',
    'Read File',
    'Request Get',
    'Request Post',
    'SearchApi',
    'Write File',
    'In-Memory Vector Store',
    'MongoDB Atlas',
    'Pinecone',
    'Postgres',
    'Qdrant',
    'Redis',
    'Supabase',
    'Upstash Vector'
]
export class NodesPool {
    componentNodes: IComponentNodes = {}
    componentCredentials: IComponentCredentials = {}
    private credentialIconPath: ICommonObject = {}

    /**
     * Initialize to get all nodes & credentials
     */
    async initialize() {
        await this.initializeNodes()
        await this.initializeCredentials()
    }

    /**
     * Initialize nodes
     */
    private async initializeNodes() {
        const packagePath = getNodeModulesPackagePath('flowise-components')
        const nodesPath = path.join(packagePath, 'dist', 'nodes')
        const nodeFiles = await this.getFiles(nodesPath)
        return Promise.all(
            nodeFiles.map(async (file) => {
                if (file.endsWith('.js')) {
                    try {
                        const nodeModule = await require(file)

                        if (nodeModule.nodeClass) {
                            const newNodeInstance = new nodeModule.nodeClass()
                            newNodeInstance.filePath = file

                            // Replace file icon with absolute path
                            if (
                                newNodeInstance.icon &&
                                (newNodeInstance.icon.endsWith('.svg') ||
                                    newNodeInstance.icon.endsWith('.png') ||
                                    newNodeInstance.icon.endsWith('.jpg'))
                            ) {
                                const filePath = file.replace(/\\/g, '/').split('/')
                                filePath.pop()
                                const nodeIconAbsolutePath = `${filePath.join('/')}/${newNodeInstance.icon}`
                                newNodeInstance.icon = nodeIconAbsolutePath

                                // Store icon path for componentCredentials
                                if (newNodeInstance.credential) {
                                    for (const credName of newNodeInstance.credential.credentialNames) {
                                        this.credentialIconPath[credName] = nodeIconAbsolutePath
                                    }
                                }
                            }

                            const skipCategories = ['Analytic', 'SpeechToText']
                            const conditionOne = !skipCategories.includes(newNodeInstance.category)

                            const isCommunityNodesAllowed = appConfig.showCommunityNodes
                            const isAuthorPresent = newNodeInstance.author
                            let conditionTwo = true
                            if (!isCommunityNodesAllowed && isAuthorPresent) conditionTwo = false

                            if (conditionOne && conditionTwo && NODE_FILTER.includes(newNodeInstance.label)) {
                                this.componentNodes[newNodeInstance.name] = newNodeInstance
                            }
                        }
                    } catch (err) {
                        logger.error(`❌ [server]: Error during initDatabase with file ${file}:`, err)
                    }
                }
            })
        )
    }

    /**
     * Initialize credentials
     */
    private async initializeCredentials() {
        const packagePath = getNodeModulesPackagePath('flowise-components')
        const nodesPath = path.join(packagePath, 'dist', 'credentials')
        const nodeFiles = await this.getFiles(nodesPath)
        return Promise.all(
            nodeFiles.map(async (file) => {
                if (file.endsWith('.credential.js')) {
                    const credentialModule = await require(file)
                    if (credentialModule.credClass) {
                        const newCredInstance = new credentialModule.credClass()
                        newCredInstance.icon = this.credentialIconPath[newCredInstance.name] ?? ''
                        this.componentCredentials[newCredInstance.name] = newCredInstance
                    }
                }
            })
        )
    }

    /**
     * Recursive function to get node files
     * @param {string} dir
     * @returns {string[]}
     */
    private async getFiles(dir: string): Promise<string[]> {
        const dirents = await promises.readdir(dir, { withFileTypes: true })
        const files = await Promise.all(
            dirents.map((dirent: Dirent) => {
                const res = path.resolve(dir, dirent.name)
                return dirent.isDirectory() ? this.getFiles(res) : res
            })
        )
        return Array.prototype.concat(...files)
    }
}
