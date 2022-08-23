import { FC, useEffect, useReducer } from 'react';
import Cookie from 'js-cookie';
import { CartContext, cartReducer } from '.';
import { ICartProduct } from '../../interfaces';

export interface CartState {
    cart: ICartProduct[];
}

export const CART_INITIAL_STATE: CartState = {
    cart: []
}

export const CartProvider: FC = ({ children }) => {

    const [ state, dispatch ] = useReducer( cartReducer, CART_INITIAL_STATE );

    useEffect(() => {
        try {
            const cart = JSON.parse( Cookie.get('cart') || '[]' )
            dispatch({
                type: '[Cart] - Load cart from storage',
                payload: cart
            })
        } catch {
            dispatch({
                type: '[Cart] - Load cart from storage',
                payload: []
            })
        }
    }, [])

    useEffect(() => {
        Cookie.set('cart', JSON.stringify(state.cart))
    }, [ state.cart ])

    const addProductToCart = (product: ICartProduct) => {
        const currentProduct = state.cart.find(p => p._id === product._id);

        if(!!currentProduct && currentProduct.size === product.size) {
            currentProduct.quantity += product.quantity;
            
            const remainingCart = state.cart.filter(p => p._id !== product._id || p.size !== product.size)
            dispatch ({
                type: '[Cart] - Add product',
                payload: [...remainingCart, currentProduct]
            })
            return;
        }

        dispatch({
            type: '[Cart] - Add product',
            payload: [ ...state.cart, product ]
        })
    }

    return (
        <CartContext.Provider value={{
            ...state,

            // methods
            addProductToCart
        }}>
            { children }
        </CartContext.Provider>
    )
}