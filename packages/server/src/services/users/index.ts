import { StatusCodes } from 'http-status-codes'
import { User } from '../../database/entities/User'
import { InternalFlowiseError } from '../../errors/internalFlowiseError'
import { getErrorMessage } from '../../errors/utils'
import { getAppVersion } from '../../utils'
import { getRunningExpressApp } from '../../utils/getRunningExpressApp'
import { FLOWISE_METRIC_COUNTERS, FLOWISE_COUNTER_STATUS } from '../../Interface.Metrics'

const createUser = async (requestBody: any): Promise<any> => {
    try {
        const appServer = getRunningExpressApp()
        const newUser = new User()
        Object.assign(newUser, requestBody)
        const user = await appServer.AppDataSource.getRepository(User).create(newUser)
        const dbResponse = await appServer.AppDataSource.getRepository(User).save(user)
        await appServer.telemetry.sendTelemetry('user_created', {
            version: await getAppVersion(),
            userId: dbResponse.id,
            userName: dbResponse.name
        })
        appServer.metricsProvider?.incrementCounter(FLOWISE_METRIC_COUNTERS.TOOL_CREATED, { status: FLOWISE_COUNTER_STATUS.SUCCESS })
        return dbResponse
    } catch (error) {
        throw new InternalFlowiseError(StatusCodes.INTERNAL_SERVER_ERROR, `Error: toolsService.createTool - ${getErrorMessage(error)}`)
    }
}

const deleteUser = async (userId: string): Promise<any> => {
    try {
        const appServer = getRunningExpressApp()
        const dbResponse = await appServer.AppDataSource.getRepository(User).delete({
            id: userId
        })
        return dbResponse
    } catch (error) {
        throw new InternalFlowiseError(StatusCodes.INTERNAL_SERVER_ERROR, `Error: toolsService.deleteTool - ${getErrorMessage(error)}`)
    }
}

const getAllUsers = async (): Promise<User[]> => {
    try {
        const appServer = getRunningExpressApp()
        const dbResponse = await appServer.AppDataSource.getRepository(User).find()
        return dbResponse
    } catch (error) {
        throw new InternalFlowiseError(StatusCodes.INTERNAL_SERVER_ERROR, `Error: usersService.getUserTools - ${getErrorMessage(error)}`)
    }
}

const getUserById = async (userId: string): Promise<any> => {
    try {
        const appServer = getRunningExpressApp()
        const dbResponse = await appServer.AppDataSource.getRepository(User).findOneBy({
            id: userId
        })
        if (!dbResponse) {
            throw new InternalFlowiseError(StatusCodes.NOT_FOUND, `User ${userId} not found`)
        }
        return dbResponse
    } catch (error) {
        throw new InternalFlowiseError(StatusCodes.INTERNAL_SERVER_ERROR, `Error: usersService.getUserById - ${getErrorMessage(error)}`)
    }
}

const updateUser = async (userId: string, userBody: any): Promise<any> => {
    try {
        const appServer = getRunningExpressApp()
        const user = await appServer.AppDataSource.getRepository(User).findOneBy({
            id: userId
        })
        if (!user) {
            throw new InternalFlowiseError(StatusCodes.NOT_FOUND, `User ${userId} not found`)
        }
        const updateUser = new User()
        Object.assign(updateUser, userBody)
        await appServer.AppDataSource.getRepository(User).merge(user, updateUser)
        const dbResponse = await appServer.AppDataSource.getRepository(User).save(user)
        return dbResponse
    } catch (error) {
        throw new InternalFlowiseError(StatusCodes.INTERNAL_SERVER_ERROR, `Error: usersService.updateUser - ${getErrorMessage(error)}`)
    }
}

export default {
    createUser,
    deleteUser,
    getAllUsers,
    getUserById,
    updateUser
}
