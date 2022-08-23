
import { createContext } from 'react'
import { ICartProduct } from '../../interfaces';

interface ContextProps {
    cart: ICartProduct[];
    numberOfItem: number;
    subtotal: number;
    tax: number;
    total: number;

    //methods
    addProductToCart: (product: ICartProduct) => void;
    updateCartQuantity: (product: ICartProduct) => void;

    removeProductCart: (product: ICartProduct) => void;
}

export const CartContext = createContext({} as ContextProps)
