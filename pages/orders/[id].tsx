import { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/react';
import { PayPalButtons } from "@paypal/react-paypal-js";

import { Box, Card, CardContent, Divider, Grid, Typography, Chip } from '@mui/material';
import { CreditCardOffOutlined, CreditScoreOutlined } from '@mui/icons-material';

import { ShopLayout } from '../../components/layouts/ShopLayout';
import { CartList, OrderSummary } from '../../components/cart';
import { dbOrders } from '../../database';
import { IOrder } from '../../interfaces';
import { Order } from '../../models';
import { countries } from '../../utils';

interface Props {
    order: IOrder
}

const OrderPage: NextPage<Props> = ({ order }) => {
    const { _id, isPaid, numberOfItem, subtotal, tax, total, shippingAddress } = order;
    const { firstName, lastName, address, address2, city, zip, country, phone } = shippingAddress;

    return (
        <ShopLayout title='Resumen de la orden' pageDescription={'Resumen de la orden'}>
            <Typography variant='h1' component='h1'>Orden: { _id }</Typography>

            {
                isPaid
                ? (
                    <Chip 
                        sx={{ my: 2 }}
                        label="Orden ya fue pagada"
                        variant='outlined'
                        color="success"
                        icon={ <CreditScoreOutlined /> }
                    />
                ) : (
                    <Chip 
                        sx={{ my: 2 }}
                        label="Pendiente de pago"
                        variant='outlined'
                        color="error"
                        icon={ <CreditCardOffOutlined /> }
                    />
                )
            }

            <Grid container>
                <Grid item xs={ 12 } sm={ 7 }>
                    <CartList products={ order.orderItems } />
                </Grid>
                <Grid item xs={ 12 } sm={ 5 }>
                    <Card className='summary-card'>
                        <CardContent>
                            <Typography variant='h2'>Resumen ({ numberOfItem } producto{ numberOfItem > 1 && 's'})</Typography>
                            <Divider sx={{ my:1 }} />

                            <Box display='flex' justifyContent='space-between'>
                                <Typography variant='subtitle1'>Dirección de entrega</Typography>
                            </Box>

                            <Typography>{ firstName } { lastName }</Typography>
                            <Typography>{ address } { address2 && `, ${address2}` }</Typography>
                            <Typography>{ city }, { zip }</Typography>
                            <Typography>{ countries.find(c => c.code === country)?.name }</Typography>
                            <Typography>{ phone }</Typography>

                            <Divider sx={{ my:1 }} />

                            <OrderSummary
                                numberOfItem={ numberOfItem }
                                subtotal={ subtotal }
                                tax={ tax }
                                total={ total }
                            />

                            <Box sx={{ mt: 3 }} display="flex" flexDirection="column">

                                {
                                    isPaid ? (
                                        <Chip 
                                            sx={{ my: 2 }}
                                            label="Orden ya fue pagada"
                                            variant='outlined'
                                            color="success"
                                            icon={ <CreditScoreOutlined /> }
                                        />
                                    ) : (
                                        <PayPalButtons
                                            createOrder={(data, actions) => {
                                                return actions.order.create({
                                                    purchase_units: [
                                                        {
                                                            amount: {
                                                                value: `${ order.total }`,
                                                            },
                                                        },
                                                    ],
                                                });
                                            }}
                                            onApprove={(data, actions) => {
                                                return actions.order!.capture().then((details) => {
                                                    console.log({details})
                                                });
                                            }}
                                        />
                                    )
                                }
                            </Box>

                        </CardContent>
                    </Card>
                </Grid>
            </Grid>


        </ShopLayout>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {

    const { id = '' } = query;
    const session: any = await getSession({ req });

    if (!session) {
        return {
            redirect: {
                destination: `/auth/login?p=/orders/${ id }`,
                permanent: false
            }
        }
    }

    const order = await dbOrders.getOrderById(id.toString());

    if ( !order ) {
        return {
            redirect: {
                destination: '/orders/history',
                permanent: false
            }
        }
    }

    if ( order.user !== session.user._id ) {
        return {
            redirect: {
                destination: '/orders/history',
                permanent: false
            }
        }
    }

    return {
        props: {
            order
        }
    }
}
export default OrderPage;
