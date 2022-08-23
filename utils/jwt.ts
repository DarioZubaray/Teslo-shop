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
