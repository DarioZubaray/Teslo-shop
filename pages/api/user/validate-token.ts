import type { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcryptjs'
import { db } from '../../../database';
import { User } from '../../../models';
import { jwtUtils } from '../../../utils';

type Data = 
    | { message: string }
    | { token: string, user: { name: string, email: string, role: string } }

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch( req.method ) {
        case 'GET':
            return validateToken(req, res)
        default:
            res.status(400).json({ message: 'Bad Request' })
    }

    res.status(200).json({ message: 'Proceso realizado correctamente' });
}

const validateToken = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    const { token = ''} = req.cookies

    let userId = ''

    try {
        userId = await jwtUtils.isValidToken(token)
    } catch (error) {
        return res.status(401).json({ message: 'Token de autorizacón no es válido'})
    }

    await db.connect()
    const user = await User.findOne({ userId }).lean()
    await db.disconnect()

    if ( !user ) {
        return res.status(400).json({ message: 'No existe usuario con ese id'})
    }

    const { _id, email, name, role } = user

    const newToken = jwtUtils.signToken( _id, email )

    res.status(200).json({ token: newToken, user: { name, email, role }});
}
