import { ICartProduct } from "../../interfaces"
import { CartState } from "./CartProvider"

type CartActionType =
 | { type: '[Cart] - Load cart from storage', payload: ICartProduct[] }
 | { type: '[Cart] - Add product', payload: ICartProduct }

 export const cartReducer = ( state: CartState, action: CartActionType): CartState => {

    switch(action.type) {
        case '[Cart] - Load cart from storage':
            return {
                ...state,
                cart: action.payload
            }
        case '[Cart] - Add product':
            return {
                ...state,
            }
        default:
            return state
    }
 }