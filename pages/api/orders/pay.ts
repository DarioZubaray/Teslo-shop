import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { IOrder, PaypalOrderStatusResponse } from '../../../interfaces';
import { db } from '../../../database';
import { Order } from '../../../models';
import { isValidObjectId } from 'mongoose';

type Data = 
    | { message: string }
    | { newOrder: IOrder }

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch( req.method ) {
        case 'POST':
            return payOrder( req, res );
        default:
            return res.status(400).json({ message: 'Bad Request'});
    }

}

const getPaypalBearerToken = async (): Promise<string | null> => {
    const body = new URLSearchParams('grant_type=client_credentials');

    const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    const PAYPAL_SECRET_ID = process.env.PAYPAL_SECRET_ID;
    const base64Token = Buffer.from(`${ PAYPAL_CLIENT_ID }:${ PAYPAL_SECRET_ID }`, 'utf-8').toString('base64');
    const headers = { 
        'Authorization': `Basic ${ base64Token }`, 
        'Content-Type': 'application/x-www-form-urlencoded'
    }

    try {
        const { data } = await axios.post( process.env.PAYPAL_OAUTH_URL || '', body, { headers });

        return data.access_token;
    } catch (error) {
        if ( axios.isAxiosError(error) ) {
            console.log(error.response?.data);
        } else {
            console.log(error);
        }
        return null;
    }
}

const payOrder = async ( req: NextApiRequest, res: NextApiResponse<Data> ) => {
    //TODO: validar session de usuario
    const paypalBearerToken = await getPaypalBearerToken();

    if ( !paypalBearerToken) {
        return res.status(500).json({ message: 'No se pudo generar el token' });
    }

    const { transactionId = '', orderId = '' } = req.body;
    if ( !isValidObjectId(orderId) ) {
        console.log({orderId})
        return res.status(400).json({ message: 'El identificador de la order no es correcta' });
    }

    const headers =  { 'Authorization': `Bearer ${ paypalBearerToken }`}
    const { data } = await axios.get<PaypalOrderStatusResponse>(`${ process.env.PAYPAL_ORDERS_URL}/${ transactionId }`, { headers });

    if ( data.status !== 'COMPLETED' ) {
        return res.status(402).json({ message: 'Order no reconocida' });
    }

    await db.connect();

    const dbOrder = await Order.findById( orderId );

    if ( !dbOrder ) {
        await db.disconnect();
        return res.status(404).json({ message: 'Order no existe en nuestra base de datos' });
    }

    if ( dbOrder.total !== Number(data.purchase_units[0].amount.value)) {
        await db.disconnect();
        return res.status(400).json({ message: 'Los montos de paypal y nuestra orden no son iguales' });
    }

    dbOrder.transactionId = transactionId;
    dbOrder.isPaid = true;
    await dbOrder.save();
    await db.disconnect();

    return res.status(200).json({ message: 'Orden pagada' });
}
