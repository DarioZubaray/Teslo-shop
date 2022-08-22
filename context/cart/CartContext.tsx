
import { createContext } from 'react'
import { ICartProduct } from '../../interfaces';

interface ContextProps {
    cart: ICartProduct[];

    //methods
}

export const CartContext = createContext({} as ContextProps)
