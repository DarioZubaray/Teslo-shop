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
        case 'POST':
            return loginUser(req, res)
        default:
            res.status(400).json({ message: 'Bad Request' })
    }

    res.status(200).json({ message: 'Proceso realizado correctamente' });
}

const loginUser = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    const { email = '', password = ''} = req.body

    await db.connect()
    const user = await User.findOne({ email })
    await db.disconnect()

    if ( !user ) {
        return res.status(400).json({ message: 'Correo o contraseña incorrectos'})
    }

    if (!bcrypt.compareSync(password, user.password!) ) {
        return res.status(400).json({ message: 'Correo o contraseña invalidos'})
    }

    const { _id, name, role } = user

    const token = jwtUtils.signToken( _id, email )

    res.status(200).json({ token, user: { name, email, role }});
}
