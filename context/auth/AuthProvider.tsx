import { FC, useReducer } from 'react';
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

    const toggleSideMenu = () => {
        //dispatch({ type: '[UI] - ToggleMenu' })
    }

    return (
        <AuthContext.Provider value={{
            ...state,

            // methods
        }}>
            { children }
        </AuthContext.Provider>
    )
}