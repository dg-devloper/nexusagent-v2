import { Request, Response, NextFunction } from 'express'
import usersService from '../../services/users'
import { InternalFlowiseError } from '../../errors/internalFlowiseError'
import { StatusCodes } from 'http-status-codes'
import bcrypt from 'bcryptjs'

const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.body) {
            throw new InternalFlowiseError(StatusCodes.PRECONDITION_FAILED, `Error: usersController.createUser - body not provided!`)
        }

        const data: {
            id: string
            email: string
            name: string
            username: string
            role: string
            isActive: boolean
            password: string | null
        } = {
            id: req.body.id,
            name: req.body.name,
            username: req.body.username,
            role: req.body.role,
            isActive: req.body.isActive,
            password: null,
            email: req.body.email
        }

        const hashPassword = await bcrypt.hash(req.body.password, 10)
        data.password = hashPassword

        const apiResponse = await usersService.createUser(data)
        return res.json(apiResponse)
    } catch (error) {
        next(error)
    }
}

const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (typeof req.params === 'undefined' || !req.params.id) {
            throw new InternalFlowiseError(StatusCodes.PRECONDITION_FAILED, `Error: usersController.deleteUser - id not provided!`)
        }
        const apiResponse = await usersService.deleteUser(req.params.id)
        return res.json(apiResponse)
    } catch (error) {
        next(error)
    }
}

const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const apiResponse = await usersService.getAllUsers()
        return res.json(apiResponse)
    } catch (error) {
        next(error)
    }
}

const getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (typeof req.params === 'undefined' || !req.params.id) {
            throw new InternalFlowiseError(StatusCodes.PRECONDITION_FAILED, `Error: usersController.getUserById - id not provided!`)
        }
        const apiResponse = await usersService.getUserById(req.params.id)
        return res.json(apiResponse)
    } catch (error) {
        next(error)
    }
}

const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (typeof req.params === 'undefined' || !req.params.id) {
            throw new InternalFlowiseError(StatusCodes.PRECONDITION_FAILED, `Error: usersController.updateUser - id not provided!`)
        }
        if (!req.body) {
            throw new InternalFlowiseError(StatusCodes.PRECONDITION_FAILED, `Error: usersController.deleteUser - body not provided!`)
        }
        const apiResponse = await usersService.updateUser(req.params.id, req.body)
        return res.json(apiResponse)
    } catch (error) {
        next(error)
    }
}

export default {
    createUser,
    deleteUser,
    getAllUsers,
    getUserById,
    updateUser
}
