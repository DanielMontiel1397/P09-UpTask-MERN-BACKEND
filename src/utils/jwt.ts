import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';

type UserPayloadType = {
    name: string,
    id: Types.ObjectId
}

export const generateJWT = ({name, id} : UserPayloadType) => {

    const data = {
        name,
        id
    }

    const token = jwt.sign(data, process.env.JWT_SECRET, {
        expiresIn: '1d'
    })

    return token;
}