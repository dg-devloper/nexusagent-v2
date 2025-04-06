import express from 'express'
import whatsappController from '../../controllers/whatsapp'

const router = express.Router()

router.get('/', whatsappController.getAllWhatsapp)
router.delete('/:sessionId', whatsappController.deleteWhatsapp)

export default router
