import { Request, Response, NextFunction } from 'express'
import userService from '../../services/user'
import { InternalFlowiseError } from '../../errors/internalFlowiseError'
import { StatusCodes } from 'http-status-codes'
import JsonWebToken from 'jsonwebtoken'

const getUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let token = req.headers.authorization
        if (!token) {
            throw new InternalFlowiseError(StatusCodes.PRECONDITION_FAILED, `Error: usersController.getUserByToken - token not provided!`)
        }
        let decryptToken = JsonWebToken.verify(token, process.env.JWT_SECRET!) as JsonWebToken.JwtPayload
        let userId = decryptToken.userId
        const apiResponse = await userService.getUserById(userId)
        return res.json(apiResponse)
    } catch (error) {
        next(error)
    }
}

export default {
    getUser
}
