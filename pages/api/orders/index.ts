import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { db } from '../../../database';
import { IOrder } from '../../../interfaces';
import { Order, Product } from '../../../models';

type Data = 
    | { message: string }
    | { newOrder: IOrder }

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch( req.method ) {
        case 'POST':
            return createOrder( req, res );
        default:
            return res.status(400).json({ message: 'Bad Request'});
    }

}

const createOrder = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    // verificar session de usuario
    const session: any = await getSession({ req });

    if (!session) {
        return res.status(401).json({ message: 'Debe de estar autenticado para usar esta función'})
    }

    // obtener productos desde la base de datos
    const { orderItems, total } = req.body as IOrder;

    const productsIds = orderItems.map( p => p._id );
    await db.connect();
    const dbProducts = await Product.find({ _id: { $in: productsIds }});

    try {
        // comparar precios desde la base con los del request
        const subtotal = orderItems.reduce( ( prev, current) => {
            const currentPrice = dbProducts.find(product => (product.id === current._id) );

            if (!currentPrice) {
                throw new Error('Verifique el carrito de nuevo, producto no existe');
            }

            return prev + (currentPrice.price * current.quantity)
        }, 0);

        const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);
        const backendTotal = subtotal * ( taxRate + 1);

        if ( total !== backendTotal ) {
            throw new Error('El total no cuadra con el monto solicitado');
        }

        // Generar order de compra
        const userId = session.user._id;
        const newOrder = new Order({ ...req.body, isPaid: false, user: userId });
        newOrder.total = Math.round( newOrder.total * 100 ) /100;

        await newOrder.save();
        await db.disconnect();

        return res.status(201).json({ newOrder });

    } catch (error: any) {
        await db.disconnect();
        console.log(error);
        return res.status(400).json({ message: error.message || 'Revise logs del servidor'})
    }

}
