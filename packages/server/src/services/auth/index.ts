import { StatusCodes } from 'http-status-codes'
import { User } from '../../database/entities/User'
import { InternalFlowiseError } from '../../errors/internalFlowiseError'
import { getErrorMessage } from '../../errors/utils'
import { getAppVersion } from '../../utils'
import { getRunningExpressApp } from '../../utils/getRunningExpressApp'
import { FLOWISE_METRIC_COUNTERS, FLOWISE_COUNTER_STATUS } from '../../Interface.Metrics'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { sendVerificationEmail } from '../../email'
import { UserVerification } from '../../database/entities/UserVerification'
import { google } from 'googleapis'

function generateUniqueString(length = 16) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let uniqueString = ''

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length)
        uniqueString += characters[randomIndex]
    }

    // Add a timestamp to ensure uniqueness
    const timestamp = Date.now().toString(36) // Convert timestamp to base-36 string
    return uniqueString + timestamp
}

const registerUser = async (requestBody: any): Promise<any> => {
    try {
        const appServer = getRunningExpressApp()
        let newUser = new User()

        const hashPassword = bcrypt.hashSync(requestBody.password)

        Object.assign(newUser, { ...requestBody, isActive: 1, role: 'CUSTOMER', password: hashPassword })

        const user = await appServer.AppDataSource.getRepository(User).create(newUser)
        newUser = await appServer.AppDataSource.getRepository(User).save(user)

        // Send email
        const token = generateUniqueString()
        const newUserVerification = new UserVerification()
        Object.assign(newUserVerification, {
            userId: newUser.id,
            token
        })

        const userVerification = await appServer.AppDataSource.getRepository(UserVerification).create(newUserVerification)
        const dbResponse = await appServer.AppDataSource.getRepository(UserVerification).save(userVerification)
        sendVerificationEmail(newUser.email, token, newUser.name)

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

        // Set durasi token menjadi 3 hari
        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET!,
            { expiresIn: '3d' } // Durasi token: 3 hari
        )

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

const verifToken = async (requestBody: any): Promise<any> => {
    try {
        const appServer = getRunningExpressApp()

        const userVerification = await appServer.AppDataSource.getRepository(UserVerification).findOneBy({
            token: requestBody.token
        })

        if (!userVerification) {
            throw new InternalFlowiseError(StatusCodes.NOT_FOUND, `Invalid Token`)
        }

        const user = await appServer.AppDataSource.getRepository(User).findOneBy({
            id: userVerification.userId
        })

        if (!user) {
            throw new InternalFlowiseError(StatusCodes.NOT_FOUND, `User not found`)
        }

        user.emailVerifiedAt = new Date()
        const updateUser = await appServer.AppDataSource.getRepository(User).save(user)

        if (!updateUser) {
            throw new InternalFlowiseError(StatusCodes.NOT_FOUND, `Failed update user`)
        }

        const dbResponse = await appServer.AppDataSource.getRepository(UserVerification).delete({ token: requestBody.token })

        return dbResponse
    } catch (error) {
        throw new InternalFlowiseError(StatusCodes.INTERNAL_SERVER_ERROR, `Error: authService.loginUser - ${getErrorMessage(error)}`)
    }
}

const generateToken = async (): Promise<string> => {
    try {
        const oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            process.env.GOOGLE_REDIRECT_LINK
        )

        const scopes = ['https://www.googleapis.com/auth/drive.metadata.readonly', 'https://www.googleapis.com/auth/calendar.readonly']

        // Generate a url that asks permissions for the Drive activity and Google Calendar scope
        const authorizationUrl = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: scopes,
            include_granted_scopes: true
        })

        return authorizationUrl
    } catch (error) {
        throw new InternalFlowiseError(StatusCodes.INTERNAL_SERVER_ERROR, `Error: authService.registerUser - ${getErrorMessage(error)}`)
    }
}

export default {
    registerUser,
    loginUser,
    verifToken,
    generateToken
}
