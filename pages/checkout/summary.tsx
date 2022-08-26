import { useContext, useEffect, useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { Box, Button, Card, CardContent, Chip, Divider, Grid, Link, Typography } from '@mui/material';

import { CartContext } from '../../context';
import { CartList, OrderSummary } from '../../components/cart';
import { countries } from '../../utils';
import { ShopLayout } from '../../components/layouts/ShopLayout';

const SummaryPage = () => {

    const router = useRouter();
    const { numberOfItem, onCreateOrder, shippingAddress } = useContext(CartContext);
    const [ isPosting, setIsPosting ] = useState(false);
    const [ errorMessage, setErrorMessage ] = useState('');

    useEffect(() => {
        if ( !Cookies.get('address') ) {
            router.push('/checkout/address');
        }
    }, [router]);

    const handleCreateOrder = async () => {
        setIsPosting(true);

        const { hasError, messageOrId } = await onCreateOrder();

        if ( hasError ) {
            setIsPosting(false);
            setErrorMessage(errorMessage);
            return;
        }

        router.replace(`/orders/${ messageOrId }`);
    }

    if (!shippingAddress) return <></>

    return (
        <ShopLayout title='Resumen de orden' pageDescription={'Resumen de la orden'}>
            <Typography variant='h1' component='h1'>Resumen de la orden</Typography>

            <Grid container>
                <Grid item xs={ 12 } sm={ 7 }>
                    <CartList />
                </Grid>
                <Grid item xs={ 12 } sm={ 5 }>
                    <Card className='summary-card'>
                        <CardContent>
                            <Typography variant='h2'>Resumen ({numberOfItem} producto{numberOfItem > 1 && 's'})</Typography>
                            <Divider sx={{ my:1 }} />

                            <Box display='flex' justifyContent='space-between'>
                                <Typography variant='subtitle1'>Dirección de entrega</Typography>
                                <NextLink href='/checkout/address' passHref>
                                    <Link underline='always'>
                                        Editar
                                    </Link>
                                </NextLink>
                            </Box>

                            
                            <Typography>{ shippingAddress.firstName} { shippingAddress.lastName }</Typography>
                            <Typography>{ shippingAddress.address } { shippingAddress.address2 ? `,${shippingAddress.address2}` : '' }</Typography>
                            <Typography>{ shippingAddress.city }</Typography>
                            <Typography>{ countries.find(country => country.code === shippingAddress.country)?.name }</Typography>
                            <Typography>{ shippingAddress.phone }</Typography>

                            <Divider sx={{ my:1 }} />

                            <Box display='flex' justifyContent='end'>
                                <NextLink href='/cart' passHref>
                                    <Link underline='always'>
                                        Editar
                                    </Link>
                                </NextLink>
                            </Box>

                            <OrderSummary />

                            <Box sx={{ mt: 3 }} display="flex" flexDirection="column">
                                <Button
                                    color="secondary"
                                    className='circular-btn'
                                    fullWidth
                                    onClick={ handleCreateOrder }
                                    disabled={ isPosting }
                                >
                                   Confirmar Orden
                                </Button>

                                {
                                    errorMessage && (
                                        <Chip
                                            color="error"
                                            label={ errorMessage }
                                            sx={{ mt: 2 }}
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

export default SummaryPage;