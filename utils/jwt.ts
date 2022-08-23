import jwt from 'jsonwebtoken'

export const signToken = ( _id: string, email: string ) => {
    if ( !process.env.JWT_SECRET_SEED ) {
        throw new Error('Hay semilla de JWT - Revisar variables de entornos')
    }

    return jwt.sign(
        // payload
        { _id, email },
        // seed
        process.env.JWT_SECRET_SEED,
        // conf
        { expiresIn: '30d' }
    )
}

export const isValidToken = (token: string): Promise<string> => {
    if ( !process.env.JWT_SECRET_SEED ) {
        throw new Error('Hay semilla de JWT - Revisar variables de entornos')
    }

    return new Promise( (resolve, reject) => {
        try {
            jwt.verify(token, process.env.JWT_SECRET_SEED || '', (err, payload) => {
                if (err) reject('El jwt no es válido')

                const { _id } = payload as { _id: string }

                resolve(_id)
            })
        } catch(error) {
            reject('El jwt no es válido')
        }
    })
}