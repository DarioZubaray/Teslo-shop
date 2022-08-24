
import { createContext } from 'react'
import { ICartProduct } from '../../interfaces';
import { ShippingAddress } from './CartProvider';

interface ContextProps {
    isLoaded: boolean;
    cart: ICartProduct[];
    numberOfItem: number;
    subtotal: number;
    tax: number;
    total: number;

    shippingAddress: ShippingAddress;

    //methods
    addProductToCart: (product: ICartProduct) => void;
    updateCartQuantity: (product: ICartProduct) => void;
    removeProductCart: (product: ICartProduct) => void;
    updateAddress: (address: ShippingAddress) => void;
}

export const CartContext = createContext({} as ContextProps)
