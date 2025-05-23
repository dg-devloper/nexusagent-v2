import { StatusCodes } from 'http-status-codes'
import { findAvailableConfigs } from '../../utils'
import { IReactFlowObject } from '../../Interface'
import { getRunningExpressApp } from '../../utils/getRunningExpressApp'
import chatflowsService from '../chatflows'
import { InternalFlowiseError } from '../../errors/internalFlowiseError'
import { getErrorMessage } from '../../errors/utils'

const getSingleFlowConfig = async (chatflowId: string, userId: string): Promise<any> => {
    try {
        const appServer = getRunningExpressApp()
        const chatflow = await chatflowsService.getChatflowById(chatflowId, userId)
        if (!chatflow) {
            throw new InternalFlowiseError(StatusCodes.NOT_FOUND, `Chatflow ${chatflowId} not found in the database!`)
        }
        const flowData = chatflow.flowData
        const parsedFlowData: IReactFlowObject = JSON.parse(flowData)
        const nodes = parsedFlowData.nodes
        const dbResponse = findAvailableConfigs(nodes, appServer.nodesPool.componentCredentials)
        return dbResponse
    } catch (error) {
        throw new InternalFlowiseError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            `Error: flowConfigService.getSingleFlowConfig - ${getErrorMessage(error)}`
        )
    }
}

export default {
    getSingleFlowConfig
}
