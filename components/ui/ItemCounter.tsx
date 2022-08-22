import { FC } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material';


interface Props {
  currentValue: number;
  updatedQuantity: (amount: number) => void;
  maxValue: number;
}

export const ItemCounter:FC<Props> = ({currentValue, updatedQuantity, maxValue}) => {
  return (
    <Box display='flex' alignItems='center'>
        <IconButton
          onClick={ () => updatedQuantity(-1) }
          sx={{ display: (currentValue > 1) ? 'flex ' : 'none'}}
        >
            <RemoveCircleOutline />
        </IconButton>
        <Typography sx={{ width: 40, textAlign:'center' }}> { currentValue } </Typography>
        <IconButton
          onClick={ () => updatedQuantity(1) }
          sx={{ display: (maxValue >= currentValue) ? 'flex ' : 'none'}}
        >
            <AddCircleOutline />
        </IconButton>
    </Box>
  )
}
