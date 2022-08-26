import { FC, useEffect, useReducer } from 'react';
import Cookie from 'js-cookie';
import axios from 'axios';

import { CartContext, cartReducer } from '.';
import { ICartProduct, IOrder, IShippingAddress } from '../../interfaces';
import tesloApi from '../../api/tesloApi';

export interface CartState {
    isLoaded: boolean;
    cart: ICartProduct[];
    numberOfItem: number;
    subtotal: number;
    tax: number;
    total: number;

    shippingAddress: IShippingAddress;
}

export const CART_INITIAL_STATE: CartState = {
    isLoaded: false,
    cart: [],
    numberOfItem: 0,
    subtotal: 0,
    tax: 0,
    total: 0,

    shippingAddress: {
        firstName: '',
        lastName: '',
        address: '',
        address2: '',
        zip: '',
        city: '',
        country: '',
        phone: '',
    }
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
        const numberItems = state.cart.length
        const subtotal = state.cart.reduce( ( prev, current) => prev + current.price * current.quantity, 0)
        const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0)

        const orderSummary = {
            numberOfItem: state.cart.reduce(( prev, current) => prev + current.quantity, 0),
            subtotal,
            tax: subtotal * taxRate,
            total: subtotal * ( taxRate + 1 )
        }

        dispatch({ type: '[Cart] - Update order summary', payload: orderSummary })
    }, [ state.cart ])

    useEffect(() => {
        Cookie.set('cart', JSON.stringify(state.cart))
    }, [ state.cart ]);

    useEffect(() => {
        const addresCookie = Cookie.get('address');
        if (addresCookie) {
            const data = JSON.parse(addresCookie);
            const address = {
                firstName: data?.firstName,
                lastName: data?.lastName,
                address: data?.address,
                address2: data?.address2,
                zip: data?.zip,
                city: data?.city,
                country: data?.country,
                phone: data?.phone,
            }

            dispatch({ type: '[Cart] - Load address from cookies', payload: address })
        }
    }, []);

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

    const updateCartQuantity = (product: ICartProduct) => {
        dispatch({
            type: '[Cart] - Update cart product',
            payload : product
        })
    }

    const removeProductCart = (product: ICartProduct) => {
        dispatch({
            type: '[Cart] - Remove cart product',
            payload: product
        })
    }

    const updateAddress = ( address: IShippingAddress) => {
        Cookie.set('address', JSON.stringify(address));

        dispatch({ type: '[Cart] - Load address from cookies', payload: address });
    }

    const onCreateOrder = async (): Promise<{ hasError: boolean, messageOrId: string }> => {

        if ( !state.shippingAddress ) {
            throw new Error('No hay dirección de entrega.')
        }

        const body: IOrder = {
            orderItems: state.cart.map(p => ({
                ...p,
                size: p.size!
            })),
            shippingAddress: state.shippingAddress,
            numberOfItem: state.numberOfItem,
            subtotal: state.subtotal,
            tax: state.tax,
            total: state.total,
            isPaid: false
        }

        try {
            const { data } = await tesloApi.post<IOrder>('/orders', body);
            console.log({data});

            dispatch({ type: '[Cart] - Order completed' })

            return  {
                hasError: false,
                messageOrId: data._id!
            }

        } catch (error) {
            console.log(error);

            if ( axios.isAxiosError(error) ) {
                return {
                    hasError: true,
                    messageOrId: (error as any).response?.data.message
                }
            }

            return {
                hasError: true,
                messageOrId: 'Error no controlado, contacte con el administrador.'
            }
        }
    }

    return (
        <CartContext.Provider value={{
            ...state,

            // methods
            addProductToCart,
            updateCartQuantity,
            removeProductCart,
            updateAddress,
            onCreateOrder,
        }}>
            { children }
        </CartContext.Provider>
    )
}