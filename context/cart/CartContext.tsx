
import { createContext } from 'react'
import { ICartProduct, IShippingAddress } from '../../interfaces';

interface ContextProps {
    isLoaded: boolean;
    cart: ICartProduct[];
    numberOfItem: number;
    subtotal: number;
    tax: number;
    total: number;

    shippingAddress: IShippingAddress;

    //methods
    addProductToCart: (product: ICartProduct) => void;
    updateCartQuantity: (product: ICartProduct) => void;
    removeProductCart: (product: ICartProduct) => void;
    updateAddress: (address: IShippingAddress) => void;
    onCreateOrder: () => Promise<{ hasError: boolean, messageOrId: string }>;
}

export const CartContext = createContext({} as ContextProps)
