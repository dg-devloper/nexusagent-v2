import { Request, Response, NextFunction } from 'express'
import whatsappService from '../../services/whatsapp'

const getAllWhatsapp = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const apiResponse = await whatsappService.getAllWhatsappDataByUserId(req.userId!)
        return res.json(apiResponse)
    } catch (error) {
        next(error)
    }
}

const deleteWhatsapp = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const apiResponse = await whatsappService.deleteWhatsappSession(req.params.sessionId)
        return res.json(apiResponse)
    } catch (error) {
        next(error)
    }
}

export default {
    getAllWhatsapp,
    deleteWhatsapp
}
