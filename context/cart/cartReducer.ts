import { ICartProduct, IShippingAddress } from "../../interfaces"
import { CartState } from "./CartProvider"

type CartActionType =
 | { type: '[Cart] - Load cart from storage', payload: ICartProduct[] }
 | { type: '[Cart] - Add product', payload: ICartProduct[] }
 | { type: '[Cart] - Update cart product', payload: ICartProduct }
 | { type: '[Cart] - Remove cart product', payload: ICartProduct }
 | { type: '[Cart] - Load address from cookies', payload: IShippingAddress }
 | { type: '[Cart] - Update shipping address', payload: IShippingAddress }
 | {
     type: '[Cart] - Update order summary',
     payload: {
        numberOfItem: number;
        subtotal: number;
        tax: number;
        total: number;
        }
    }
| { type: '[Cart] - Order completed' }
 
 export const cartReducer = ( state: CartState, action: CartActionType): CartState => {

    switch(action.type) {
        case '[Cart] - Load cart from storage':
            return {
                ...state,
                isLoaded: true,
                cart: [...action.payload]
            }
        case '[Cart] - Add product':
            return {
                ...state,
                cart: [...action.payload]
            }
        case '[Cart] - Update cart product':
            return {
                ...state,
                cart: state.cart.map(product => {
                    if (product._id !== action.payload._id) return product;
                    if (product.size !== action.payload.size) return product;

                    return action.payload;
                })
            }
        case '[Cart] - Remove cart product':
            return {
                ...state,
                cart: state.cart.filter(product => {
                    if (product._id !== action.payload._id) return true;
                    if (product.size !== action.payload.size) return true;
                })
            }
        case '[Cart] - Update order summary':
            return {
                ...state,
                numberOfItem: action.payload.numberOfItem,
                tax: action.payload.tax,
                subtotal: action.payload.subtotal,
                total: action.payload.total
            }
        case '[Cart] - Load address from cookies':
        case '[Cart] - Update shipping address':
            return {
                ...state,
                shippingAddress: action.payload
            }
        case '[Cart] - Order completed':
            return {
                ...state,
                cart: [],
                numberOfItem: 0,
                subtotal: 0,
                tax: 0,
                total: 0,
            }
        default:
            return state
    }
 }