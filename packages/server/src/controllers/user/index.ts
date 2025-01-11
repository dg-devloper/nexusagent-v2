import { Request, Response, NextFunction } from 'express'
import userService from '../../services/user'

const getUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let userId = req.userId!
        const apiResponse = await userService.getUserById(userId)
        return res.json(apiResponse)
    } catch (error) {
        next(error)
    }
}

export default {
    getUser
}
