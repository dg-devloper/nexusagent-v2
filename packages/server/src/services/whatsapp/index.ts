import { StatusCodes } from 'http-status-codes'
import { Whatsapp } from '../../database/entities/Whatsapp'
import { InternalFlowiseError } from '../../errors/internalFlowiseError'
import { getErrorMessage } from '../../errors/utils'
import { getRunningExpressApp } from '../../utils/getRunningExpressApp'
import logger from '../../utils/logger'
import { getMySQLAuthState } from '../../utils/mysqlAuth'

// Fungsi untuk menghapus sesi WhatsApp
const deleteWhatsappSession = async (sessionId: string): Promise<boolean> => {
    try {
        const appServer = getRunningExpressApp()

        const { removeCreds } = await getMySQLAuthState(sessionId)

        const whatsappRepo = appServer.AppDataSource.getRepository(Whatsapp)

        const whatsapp = await whatsappRepo.findOneBy({
            sessionId
        })

        if (!whatsapp) {
            throw new InternalFlowiseError(StatusCodes.NOT_FOUND, `Whatsapp session ${sessionId} not found`)
        }

        whatsapp.isActive = false
        await whatsappRepo.save(whatsapp)

        await removeCreds()

        return true
    } catch (error) {
        logger.error(`Error deleting WhatsApp session: ${getErrorMessage(error)}`)
        throw new InternalFlowiseError(StatusCodes.INTERNAL_SERVER_ERROR, `Error deleting WhatsApp session: ${getErrorMessage(error)}`)
    }
}

// Fungsi untuk mendapatkan semua data WhatsApp berdasarkan user ID
const getAllWhatsappDataByUserId = async (userId: string) => {
    try {
        const appServer = getRunningExpressApp()
        const repo = await appServer.AppDataSource.getRepository(Whatsapp)
        const data = await repo.query(
            'SELECT whatsapp.*, chat_flow.name FROM whatsapp INNER JOIN chat_flow ON whatsapp.chatflowId COLLATE utf8mb4_unicode_ci = chat_flow.id COLLATE utf8mb4_unicode_ci WHERE whatsapp.userId = ? AND whatsapp.isActive = 1',
            [userId]
        )

        return data
    } catch (error) {
        logger.error(`Error getting all WhatsApp data by userId: ${getErrorMessage(error)}`)
        throw new InternalFlowiseError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            `Error getting all WhatsApp data by userId: ${getErrorMessage(error)}`
        )
    }
}

export default {
    deleteWhatsappSession,
    getAllWhatsappDataByUserId
}
