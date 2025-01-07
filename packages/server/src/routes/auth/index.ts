import express from 'express'
import authController from '../../controllers/auth'

const router = express.Router()

// Login
router.post('/login', authController.login)
router.post('/register', authController.register)

export default router
