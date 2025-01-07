import express from 'express'
import usersController from '../../controllers/users'

const router = express.Router()

// CREATE
router.post('/', usersController.createUser)

// READ
router.get('/', usersController.getAllUsers)
router.get(['/', '/:id'], usersController.getUserById)

// UPDATE
router.put(['/', '/:id'], usersController.updateUser)

// DELETE
router.delete(['/', '/:id'], usersController.deleteUser)

export default router
