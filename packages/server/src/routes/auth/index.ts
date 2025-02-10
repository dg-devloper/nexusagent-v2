import express from 'express'
import authController from '../../controllers/auth'

const router = express.Router()

// Login
router.post('/login', authController.login)
router.post('/register', authController.register)
router.post('/verification', authController.verif)
router.get('/oauth', authController.oauthGoogle)
router.post('/verifcode', authController.verifCode)

export default router
