import { FC } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material';


interface Props {
  currentValue: number;
  updatedQuantity: (amount: number) => void;
  maxValue: number;
}

export const ItemCounter:FC<Props> = ({currentValue, updatedQuantity, maxValue}) => {

  const onUpdatedQuantity = (amount: number) => {
    if (maxValue <= currentValue && amount === 1) return;
    if (currentValue === 1 && amount === -1) return;

    updatedQuantity(amount);
  }

  return (
    <Box display='flex' alignItems='center'>
        <IconButton onClick={ () => onUpdatedQuantity(-1) } >
            <RemoveCircleOutline />
        </IconButton>
        <Typography sx={{ width: 40, textAlign:'center' }}> { currentValue } </Typography>
        <IconButton onClick={ () => onUpdatedQuantity(1) } >
            <AddCircleOutline />
        </IconButton>
    </Box>
  )
}
