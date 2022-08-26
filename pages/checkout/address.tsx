import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Box, Button, FormControl, Grid, MenuItem, TextField, Typography } from "@mui/material"
import { useForm } from "react-hook-form";
import Cookies from "js-cookie";

import { ShopLayout } from "../../components/layouts"
import { CartContext } from "../../context";
import { countries } from './../../utils'

type FormData = {
    firstName: string;
    lastName: string;
    address: string;
    address2?: string;
    zip: string;
    city: string;
    country: string;
    phone: string;
}

const getAddressFromCookies = (): FormData => {
    const data = JSON.parse(Cookies.get('address') || '{}');
    return {
        firstName: data?.firstName,
        lastName: data?.lastName,
        address: data?.address,
        address2: data?.address2,
        zip: data?.zip,
        city: data?.city,
        country: data?.country || countries[1].code,
        phone: data?.phone,
    }
}

const AddressPage = () => {
    const router = useRouter();
    const { updateAddress, shippingAddress } = useContext(CartContext);
    const [defaultCountry, setDefaultCountry] = useState('');
    const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
        defaultValues: {
            firstName: '',
            lastName: '',
            address: '',
            address2: '',
            zip: '',
            city: '',
            country: '',
            phone: '',
        }
    });

    useEffect(() => {
        const addressFromCookies = getAddressFromCookies();
        reset(addressFromCookies);
        setDefaultCountry(addressFromCookies.country);
    }, [reset, setDefaultCountry]);

    const onAddressCheckout = ( data: FormData ) => {
        updateAddress(data);
        router.push('/checkout/summary');
    }

  return (
    <ShopLayout title="Dirección" pageDescription="Confirmar dirección del destino">

        <form onSubmit={ handleSubmit(onAddressCheckout) } noValidate>
            <Typography variant="h1" component='h1'>Dirección</Typography>

            <Grid container spacing={ 2 } sx={{ mt: 2 }}>
                
                <Grid item xs={12} sm={ 6 }>
                    <TextField
                        label='Nombre'
                        variant="filled"
                        fullWidth
                        {
                            ...register('firstName', {
                                required: 'Este campo es requerido'
                            })
                        }

                        error={ !!errors.firstName }
                        helperText={ errors.firstName?.message }
                    />
                </Grid>
                <Grid item xs={12} sm={ 6 }>
                    <TextField
                        label='Apellido'
                        variant="filled"
                        fullWidth
                        {
                            ...register('lastName', {
                                required: 'Este campo es requerido'
                            })
                        }
                        error={ !!errors.lastName }
                        helperText={ errors.lastName?.message }
                    />
                </Grid>

                <Grid item xs={12} sm={ 6 }>
                    <TextField
                        label='Dirección'
                        variant="filled"
                        fullWidth
                        {
                            ...register('address', {
                                required: 'Este campo es requerido'
                            })
                        }
                        error={ !!errors.address }
                        helperText={ errors.address?.message }
                    />
                </Grid>
                <Grid item xs={12} sm={ 6 }>
                    <TextField
                        label='Dirección 2 (opcional)'
                        variant="filled"
                        fullWidth
                        {
                            ...register('address2')
                        }
                    />
                </Grid>

                <Grid item xs={12} sm={ 6 }>
                    <TextField
                        label='Código Postal'
                        variant="filled"
                        fullWidth
                        {
                            ...register('zip', {
                                required: 'Este campo es requerido'
                            })
                        }
                        error={ !!errors.zip }
                        helperText={ errors.zip?.message }
                    />
                </Grid>
                <Grid item xs={12} sm={ 6 }>
                    <TextField
                        label='Ciudad'
                        variant="filled"
                        fullWidth
                        {
                            ...register('city', {
                                required: 'Este campo es requerido'
                            })
                        }
                        error={ !!errors.city }
                        helperText={ errors.city?.message }
                    />
                </Grid>
                
                <Grid item xs={12} sm={ 6 }>
                    <FormControl fullWidth>
                        {
                            !!defaultCountry && (
                                <TextField
                                    select
                                    variant="filled"
                                    fullWidth
                                    label="País"
                                    defaultValue={defaultCountry}
                                    {...register("country", {
                                        required: "El país es requerido",
                                    })}
                                    error={!!errors.country}
                                    helperText={errors.country?.message}
                                >
                                    {
                                        countries.map((country) => (
                                            <MenuItem key={country.code} value={country.code}>
                                                {country.name}
                                            </MenuItem>
                                        ))
                                    }
                                </TextField>
                        )}
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={ 6 }>
                    <TextField
                        label='Teléfono'
                        variant="filled"
                        fullWidth
                        {
                            ...register('phone', {
                                required: 'Este campo es requerido'
                            })
                        }
                        error={ !!errors.phone }
                        helperText={ errors.phone?.message }
                    />
                </Grid>
            </Grid>

            <Box sx={{ mt: 5 }} display='flex' justifyContent='center'>
                <Button
                    type="submit"
                    color="secondary"
                    className="circular-btn"
                    size="large"
                >
                    Revisar pedido
                </Button>
            </Box>
        </form>

    </ShopLayout>
  )
}

// export const getServerSideProps: GetServerSideProps = async ({ req }) => {

//     const { token = '' } = req.cookies;
//     let isValidToken = false;

//     try {
//         await jwtUtils.isValidToken( token );
//         isValidToken = true;
//     } catch (error) {
//         isValidToken = false;
//         console.log(error);
//     }

//     if (!isValidToken) {
//         return {
//             redirect: {
//                 destination: '/auth/login?p=/checkout/address',
//                 permanent: false
//             }
//         }
//     }

//     return {
//         props: {

//         }
//     }
// }

export default AddressPage
