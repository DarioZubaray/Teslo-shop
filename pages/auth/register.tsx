import { useState } from 'react';
import NextLink from 'next/link';
import { Box, Button, Chip, Grid, Link, TextField, Typography } from '@mui/material';
import { useForm } from "react-hook-form";
import { AuthLayout } from '../../components/layouts'
import { validations } from '../../utils';
import tesloApi from '../../api/tesloApi';
import { ErrorOutline } from '@mui/icons-material';

type FormData = {
    name: string,
    email: string,
    password: string,
};

const RegisterPage = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
    const [ showError, setShowError ] = useState(false);

    const onRegisterUser = async ({ name, email, password }: FormData) => {
        setShowError(false);
    try {
        const { data } = await tesloApi.post('/user/register', { name, email, password });
        const { token, user } = data;
        console.log({ token, user });
    } catch (error) {
        console.log('Error en las credenciales. ', error)
        setShowError(true);
        setTimeout(() => {
            setShowError(false);
        }, 3000)
    }
      }

  return (
    <AuthLayout title={'Ingresar'}>
        <form onSubmit={ handleSubmit(onRegisterUser) } noValidate>
            <Box sx={{ width: 350, padding:'10px 20px' }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant='h1' component="h1">Crear cuenta</Typography>
                        {
                            showError && (
                                <Chip 
                                    label="Algo salió mal..."
                                    color="error"
                                    icon={ <ErrorOutline/> }
                                    className="fadeIn"
                                />
                            )
                        }
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            label="Nombre
                            completo"
                            variant="filled"
                            fullWidth
                            {
                                ...register('name', {
                                    required: 'Este campo es requerido',
                                    minLength: { value: 2, message: 'Tu nombre debe de ser de al menos 2 caracteres.'}
                                })
                            }
                            error={ !!errors.name }
                            helperText={ errors.name?.message }
                        />
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
                            Registrarse
                        </Button>
                    </Grid>

                    <Grid item xs={12} display='flex' justifyContent='end'>
                        <NextLink href="/auth/login" passHref>
                            <Link underline='always'>
                                ¿Ya tienes cuenta?
                            </Link>
                        </NextLink>
                    </Grid>
                </Grid>
            </Box>
        </form>
    </AuthLayout>
  )
}

export default RegisterPage