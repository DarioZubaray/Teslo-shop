import { Grid, Typography } from "@mui/material"
import { useContext } from "react"
import { CartContext } from "../../context"

import { currency } from '../../utils'


export const OrderSummary = () => {

    const { numberOfItem, tax, subtotal, total }  = useContext(CartContext)

    return (
        <Grid container>
            <Grid item xs={6}>
                <Typography>No. Productos</Typography>
            </Grid>
            <Grid item xs={6} display='flex' justifyContent='end'>
                <Typography>{ numberOfItem } item{ numberOfItem > 0 && 's'}</Typography>
            </Grid>

            <Grid item xs={6}>
                <Typography>SubTotal</Typography>
            </Grid>
            <Grid item xs={6} display='flex' justifyContent='end'>
                <Typography>{ currency.format(subtotal) }</Typography>
            </Grid>

            <Grid item xs={6}>
                <Typography>Impuestos ({ Number(process.env.NEXT_PUBLIC_TAX_RATE) * 100 }%)</Typography>
            </Grid>
            <Grid item xs={6} display='flex' justifyContent='end'>
                <Typography>{ currency.format(tax) }</Typography>
            </Grid>

            <Grid item xs={6} sx={{ mt:2 }}>
                <Typography variant="subtitle1">Total:</Typography>
            </Grid>
            <Grid item xs={6} sx={{ mt:2 }} display='flex' justifyContent='end'>
                <Typography variant="subtitle1">{ currency.format(total) }</Typography>
            </Grid>

        </Grid>
    )
}
