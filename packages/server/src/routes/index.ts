import express from 'express'
import apikeyRouter from './apikey'
import assistantsRouter from './assistants'
import attachmentsRouter from './attachments'
import chatMessageRouter from './chat-messages'
import chatflowsRouter from './chatflows'
import chatflowsStreamingRouter from './chatflows-streaming'
import chatflowsUploadsRouter from './chatflows-uploads'
import componentsCredentialsRouter from './components-credentials'
import componentsCredentialsIconRouter from './components-credentials-icon'
import credentialsRouter from './credentials'
import documentStoreRouter from './documentstore'
import exportImportRouter from './export-import'
import feedbackRouter from './feedback'
import fetchLinksRouter from './fetch-links'
import flowConfigRouter from './flow-config'
import getUploadFileRouter from './get-upload-file'
import getUploadPathRouter from './get-upload-path'
import internalChatmessagesRouter from './internal-chat-messages'
import internalPredictionRouter from './internal-predictions'
import leadsRouter from './leads'
import loadPromptRouter from './load-prompts'
import marketplacesRouter from './marketplaces'
import nodeConfigRouter from './node-configs'
import nodeCustomFunctionRouter from './node-custom-functions'
import nodeIconRouter from './node-icons'
import nodeLoadMethodRouter from './node-load-methods'
import nodesRouter from './nodes'
import openaiAssistantsRouter from './openai-assistants'
import openaiAssistantsFileRouter from './openai-assistants-files'
import openaiAssistantsVectorStoreRouter from './openai-assistants-vector-store'
import openaiRealtimeRouter from './openai-realtime'
import pingRouter from './ping'
import predictionRouter from './predictions'
import promptListsRouter from './prompts-lists'
import publicChatbotRouter from './public-chatbots'
import publicChatflowsRouter from './public-chatflows'
import statsRouter from './stats'
import toolsRouter from './tools'
import usersRouter from './users'
import upsertHistoryRouter from './upsert-history'
import variablesRouter from './variables'
import vectorRouter from './vectors'
import verifyRouter from './verify'
import versionRouter from './versions'
import auth from './auth'
import userRouter from './user'
import JsonWebToken from 'jsonwebtoken'
import usersService from '../services/users'

const router = express.Router()
router.use('/auth', auth)
router.use('/node-icon', nodeIconRouter)
router.use('/node-load-method', nodeLoadMethodRouter)
router.use('/components-credentials-icon', componentsCredentialsIconRouter)
router.use('/ping', pingRouter)
router.use(async (req, res, next) => {
    let token = req.headers.authorization!

    if (token && token.startsWith('Bearer ')) {
        token = token.slice(7, token.length)
    }
    if (!token) {
        return res.status(401).json({
            message: 'No token provided'
        })
    }

    try {
        let decryptToken = JsonWebToken.verify(token, process.env.JWT_SECRET!) as JsonWebToken.JwtPayload
        let userId = decryptToken.userId
        let exp = decryptToken.exp!

        if (exp < Date.now().valueOf() / 1000) {
            return res.status(401).json({
                message: 'Token expired'
            })
        }

        const user = await usersService.getUserById(userId)
        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            })
        }

        if (user.expiredAt && new Date(user.expiredAt).valueOf() < Date.now().valueOf()) {
            return res.status(401).json({
                message: 'User account expired'
            })
        }
        req.userId = userId
        // console.log(user)
        next()
    } catch (error) {
        return res.status(401).json({
            message: 'Invalid token 1'
        })
    }
})
router.use('/', userRouter)
router.use('/apikey', apikeyRouter)
router.use('/assistants', assistantsRouter)
router.use('/attachments', attachmentsRouter)
router.use('/chatflows', chatflowsRouter)
router.use('/chatflows-streaming', chatflowsStreamingRouter)
router.use('/chatmessage', chatMessageRouter)
router.use('/components-credentials', componentsCredentialsRouter)

router.use('/chatflows-uploads', chatflowsUploadsRouter)
router.use('/credentials', credentialsRouter)
router.use('/document-store', documentStoreRouter)
router.use('/export-import', exportImportRouter)
router.use('/feedback', feedbackRouter)
router.use('/fetch-links', fetchLinksRouter)
router.use('/flow-config', flowConfigRouter)
router.use('/internal-chatmessage', internalChatmessagesRouter)
router.use('/internal-prediction', internalPredictionRouter)
router.use('/get-upload-file', getUploadFileRouter)
router.use('/get-upload-path', getUploadPathRouter)
router.use('/leads', leadsRouter)
router.use('/load-prompt', loadPromptRouter)
router.use('/marketplaces', marketplacesRouter)
router.use('/node-config', nodeConfigRouter)
router.use('/node-custom-function', nodeCustomFunctionRouter)
router.use('/nodes', nodesRouter)
router.use('/openai-assistants', openaiAssistantsRouter)
router.use('/openai-assistants-file', openaiAssistantsFileRouter)
router.use('/openai-assistants-vector-store', openaiAssistantsVectorStoreRouter)
router.use('/openai-realtime', openaiRealtimeRouter)
router.use('/prediction', predictionRouter)
router.use('/prompts-list', promptListsRouter)
router.use('/public-chatbotConfig', publicChatbotRouter)
router.use('/public-chatflows', publicChatflowsRouter)
router.use('/stats', statsRouter)
router.use('/tools', toolsRouter)
router.use('/users', usersRouter)
router.use('/variables', variablesRouter)
router.use('/vector', vectorRouter)
router.use('/verify', verifyRouter)
router.use('/version', versionRouter)
router.use('/upsert-history', upsertHistoryRouter)

export default router
