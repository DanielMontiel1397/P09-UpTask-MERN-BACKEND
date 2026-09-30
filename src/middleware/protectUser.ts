import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken';
import User, { UserType } from '../models/User';

declare global {
    namespace Express {
        interface Request {
            user?: UserType
        }
    }
}

export const protectRoutesUser = async (req: Request, res: Response, next: NextFunction) => {
    
    const { authorization: tokenHeader } = req.headers;

    if (tokenHeader && tokenHeader.startsWith('Bearer')) {

        const token = tokenHeader.split(' ')[1];

        
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            if (typeof decoded === 'object' && decoded.id) {

                const user = await User.findById(decoded.id).select('_id name email');
                
                if (!user) {
                    const error = new Error('Token no válido o inexistente');
                    return res.status(403).json({
                        error: error.message
                    })

                } else {

                    req.user = user;

                }

                return next();

            } else {
                const error = new Error('Token no válido o inexistente');
                return res.status(403).json({
                    error: error.message
                })
            }



        } catch (e) {

            console.log('Error al verificar el token: ');
            const error = new Error('Token no válido o inexistente');
            return res.status(500).json({
                msg: error.message
            });

        }

    } else {
        const error = new Error('Token no válido o inexistente');
        return res.status(403).json({
            error: error.message
        })
    }


}