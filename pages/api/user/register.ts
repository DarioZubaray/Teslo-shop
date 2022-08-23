import type { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcryptjs'
import { db } from '../../../database';
import { User } from '../../../models';
import { jwtUtils, validations } from '../../../utils';

type Data = 
    | { message: string }
    | { token: string, user: { name: string, email: string, role: string } }

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch( req.method ) {
        case 'POST':
            return registerUser(req, res)
        default:
            res.status(400).json({ message: 'Bad Request' })
    }

    res.status(200).json({ message: 'Proceso realizado correctamente' });
}

const registerUser = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    const { name = '', email = '', password = ''} = req.body as { name: string, email: string, password: string }

    if (name.length < 2) {
        return res.status(400).json({ message: 'La nombre debe ser de al menos 2 caracteres'})
    }

    if (password.length < 6) {
        return res.status(400).json({ message: 'La contraseña debe ser de al menos 6 caracteres'})
    }

    if ( !validations.isValidEmail( email ) ) {
        return res.status(400).json({ message: 'El correo no tiene un formato correcto'})
    }

    await db.connect()
    const user = await User.findOne({ email })
    
    if ( user ) {
        await db.disconnect()
        return res.status(400).json({ message: 'Ese correo ya se encuentra utilizado'})
    }

    const newUser = new User({
        name,
        email: email.toLocaleLowerCase(),
        password: bcrypt.hashSync(password),
        role: 'client'
    })

    try {
        await newUser.save({ validateBeforeSave: true })
        await db.disconnect()
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Revise logs del servidor'})
    }

    const { _id, role } = newUser

    const token = jwtUtils.signToken( _id, email )

    res.status(200).json({ token, user: { name, email, role }});
}
