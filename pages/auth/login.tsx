import { useContext, useState } from 'react';
import NextLink from 'next/link';
import { useForm } from "react-hook-form";
import { Box, Button, Chip, Grid, Link, TextField, Typography } from '@mui/material';
import { ErrorOutline } from '@mui/icons-material';

import { AuthContext } from '../../context';
import { AuthLayout } from '../../components/layouts'
import { validations } from '../../utils';
import { useRouter } from 'next/router';

type FormData = {
    email: string,
    password: string,
};

const LoginPage = () => {

    const { loginUser } = useContext(AuthContext);
    const router = useRouter();
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
    const [ showError, setShowError ] = useState(false);

    const onLoginUser = async ({ email, password }: FormData) => {
        setShowError(false);
        const isValidLogin = await loginUser( email, password );

        if (!isValidLogin) {
            setShowError(true);
            setTimeout(() => setShowError(false), 3000);
            return;
        }

        const destination = router.query.p?.toString() || '/';
        router.replace(destination);
    }

  return (
    <AuthLayout title={'Ingresar'}>
        <form onSubmit={ handleSubmit(onLoginUser) } noValidate>
            <Box sx={{ width: 350, padding:'10px 20px' }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant='h1' component="h1">Iniciar Sesión</Typography>
                        {
                            showError && (
                            <Chip 
                                label="No reconocemos ese usuario o contraseña"
                                color="error"
                                icon={ <ErrorOutline/> }
                                className="fadeIn"
                            />
                        )}
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            type="email"
                            label="Correo"
                            variant="filled"
                            fullWidth
                            {
                                ...register('email', {
                                    required: 'Este campo es requerido',
                                    validate: validations.isEmail
                                })
                            }
                            error={ !!errors.email }
                            helperText={ errors.email?.message }
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Contraseña"
                            type='password'
                            variant="filled"
                            fullWidth
                            {
                                ...register('password', {
                                    required: 'El email es obligatorio',
                                    minLength: { value: 6, message: 'Mínimo 6 caracteres' }
                                })
                            }
                            error={ !!errors.password }
                            helperText={ errors.password?.message }
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Button
                            color="secondary"
                            className='circular-btn'
                            size='large'
                            fullWidth
                            type="submit"
                        >
                            Ingresar
                        </Button>
                    </Grid>

                    <Grid item xs={12} display='flex' justifyContent='end'>
                        <NextLink
                            href={ router.query.p ? `/auth/register?p=${router.query.p.toString()}` : '/auth/register'}
                            passHref
                        >
                            <Link underline='always'>
                                ¿No tienes cuenta?
                            </Link>
                        </NextLink>
                    </Grid>
                </Grid>
            </Box>
        </form>
    </AuthLayout>
  )
}

export default LoginPage