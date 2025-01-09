import { StatusCodes } from 'http-status-codes'
import { User } from '../../database/entities/User'
import { InternalFlowiseError } from '../../errors/internalFlowiseError'
import { getErrorMessage } from '../../errors/utils'
import { getAppVersion } from '../../utils'
import { getRunningExpressApp } from '../../utils/getRunningExpressApp'
import { FLOWISE_METRIC_COUNTERS, FLOWISE_COUNTER_STATUS } from '../../Interface.Metrics'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const registerUser = async (requestBody: any): Promise<any> => {
    try {
        const appServer = getRunningExpressApp()
        const newUser = new User()
        Object.assign(newUser, requestBody)
        // newUser.password = await bcrypt.hash(newUser.password, 10)
        const user = await appServer.AppDataSource.getRepository(User).create(newUser)
        const dbResponse = await appServer.AppDataSource.getRepository(User).save(user)
        await appServer.telemetry.sendTelemetry('user_registered', {
            version: await getAppVersion(),
            userId: dbResponse.id,
            userName: dbResponse.name
        })
        appServer.metricsProvider?.incrementCounter(FLOWISE_METRIC_COUNTERS.USER_REGISTERED, { status: FLOWISE_COUNTER_STATUS.SUCCESS })
        return dbResponse
    } catch (error) {
        throw new InternalFlowiseError(StatusCodes.INTERNAL_SERVER_ERROR, `Error: authService.registerUser - ${getErrorMessage(error)}`)
    }
}

const loginUser = async (requestBody: any): Promise<any> => {
    try {
        const appServer = getRunningExpressApp()

        const user = await appServer.AppDataSource.getRepository(User).findOneBy({
            username: requestBody.username
        })

        if (!user || !(await bcrypt.compare(requestBody.password, user.password))) {
            throw new InternalFlowiseError(StatusCodes.UNAUTHORIZED, 'Invalid username or password')
        }
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '1h' })
        await appServer.telemetry.sendTelemetry('user_logged_in', {
            version: await getAppVersion(),
            userId: user.id,
            userName: user.name
        })
        appServer.metricsProvider?.incrementCounter(FLOWISE_METRIC_COUNTERS.USER_LOGGED_IN, { status: FLOWISE_COUNTER_STATUS.SUCCESS })
        return {
            status: 'success',
            token: `Bearer ${token}`,
            user
        }
    } catch (error) {
        throw new InternalFlowiseError(StatusCodes.INTERNAL_SERVER_ERROR, `Error: authService.loginUser - ${getErrorMessage(error)}`)
    }
}

export default {
    registerUser,
    loginUser
}
