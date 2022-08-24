import { FC, useEffect, useReducer } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Cookies from 'js-cookie';
import tesloApi from '../../api/tesloApi';
import { IUser } from '../../interfaces';
import { AuthContext, authReducer } from './';

export interface AuthState {
    isLoggedIn: boolean;
    user?: IUser;
}

export const AUTH_INITIAL_STATE: AuthState = {
    isLoggedIn:  false,
    user: undefined
}

export const AuthProvider: FC = ({ children }) => {

    const [ state, dispatch ] = useReducer( authReducer, AUTH_INITIAL_STATE );
    const router = useRouter()

    useEffect(() => {
        checkToken();
    }, [])

    const checkToken = async() => {

        if (!Cookies.get('token')) return;

        try {
            const { data } = await tesloApi.get('/user/validate-token');
            const { token, user } = data;
            Cookies.set('token', token)
            dispatch({ type: '[Auth] - Login', payload: user});
        } catch (error) {
            console.log('Error al revalidar token. ', error);
            Cookies.remove('token');
        }
    }

    const loginUser = async( email: string, password: string): Promise<boolean> => {
        try {
            const { data } = await tesloApi.post('/user/login', { email, password });
            const { token, user } = data;
            Cookies.set('token', token)
            dispatch({ type: '[Auth] - Login', payload: user});
            return true;
        } catch (error) {
            console.log('Error en las credenciales. ', error);
            return false;
        }
    }

    const registerUser = async( name: string, email: string, password: string): Promise<{hasError: boolean; message?: string}> => {
        try {
            const { data } = await tesloApi.post('/user/register', { name, email, password });
            const { token, user } = data;
            Cookies.set('token', token)
            dispatch({ type: '[Auth] - Login', payload: user});
            return {
                hasError: false
            };
        } catch (error) {
            if ( axios.isAxiosError(error) ) {
                const message = (error as any).response?.data.message
                return {
                    hasError: true,
                    message
                }
            }
            return {
                hasError: true,
                message: 'No se pudo crear el usuario, intente nuevamente.'
            };
        }
    }

    const logoutUser = () => {
        Cookies.remove('token');
        Cookies.remove('cart');

        dispatch({ type: '[Auth] - Logout'});
        router.reload();
    }

    return (
        <AuthContext.Provider value={{
            ...state,

            // methods
            loginUser,
            registerUser,
            logoutUser,
        }}>
            { children }
        </AuthContext.Provider>
    )
}