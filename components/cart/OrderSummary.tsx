import { Grid, Typography } from "@mui/material"
import { STATES } from "mongoose";
import { FC, useContext } from "react"
import { CartContext } from "../../context"

import { currency } from '../../utils'

interface Props {
    numberOfItem?: number;
    tax?: number;
    subtotal?: number;
    total?: number;
}

export const OrderSummary: FC<Props> = (props) => {

    const state  = useContext(CartContext);

    const { numberOfItem = 0, subtotal = 0, tax= 0, total = 0} = props ? props : state;

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
