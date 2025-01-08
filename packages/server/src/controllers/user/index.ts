import { Request, Response, NextFunction } from 'express'
import userService from '../../services/user'
import JsonWebToken from 'jsonwebtoken'

const getUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let token = req.headers.authorization
        if (token && token.startsWith('Bearer ')) {
            token = token.slice(7, token.length)
        }
        if (!token) {
            return res.status(401).json({
                message: 'No token provided'
            })
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
