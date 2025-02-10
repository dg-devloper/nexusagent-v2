import { Request, Response, NextFunction } from 'express'
import authService from '../../services/auth'
import { InternalFlowiseError } from '../../errors/internalFlowiseError'
import { StatusCodes } from 'http-status-codes'

const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.body) {
            throw new InternalFlowiseError(StatusCodes.PRECONDITION_FAILED, `Error: authController.register - body not provided!`)
        }
        const apiResponse = await authService.registerUser(req.body)
        return res.json(apiResponse)
    } catch (error) {
        next(error)
    }
}

const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.body) {
            throw new InternalFlowiseError(StatusCodes.PRECONDITION_FAILED, `Error: authController.login - body not provided!`)
        }
        const apiResponse = await authService.loginUser(req.body)

        return res.json(apiResponse)
    } catch (error) {
        next(error)
    }
}

const verif = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.body) {
            throw new InternalFlowiseError(StatusCodes.PRECONDITION_FAILED, `Error: authController.login - body not provided!`)
        }
        const apiResponse = await authService.verifToken(req.body)

        return res.json(apiResponse)
    } catch (error) {
        next(error)
    }
}

const oauthGoogle = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.body) {
            throw new InternalFlowiseError(StatusCodes.PRECONDITION_FAILED, `Error: authController.login - body not provided!`)
        }
        const apiResponse = await authService.generateToken()

        return res.json({ url: apiResponse })
    } catch (error) {
        next(error)
    }
}

const verifCode = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.body) {
            throw new InternalFlowiseError(StatusCodes.PRECONDITION_FAILED, `Error: authController.login - body not provided!`)
        }
        const apiResponse = await authService.verifCode(req.body)

        return res.json(apiResponse)
    } catch (error) {
        next(error)
    }
}

export default {
    register,
    login,
    verif,
    oauthGoogle,
    verifCode
}
