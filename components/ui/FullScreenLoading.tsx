import { Box, CircularProgress, Typography } from '@mui/material';

const FullScreenLoading = () => {
  return (
    <Box 
            display='flex'
            flexDirection='column'
            justifyContent='center' 
            alignItems='center' 
            height='calc(100vh - 200px)'
            sx={{ flexDirection: { xs: 'column', sm: 'row' }}}
        >
            <Typography sx={{ mb: 3 }} variant="h2" fontWeight={ 200 } fontSize={ 20 }>Cargando..</Typography>
         <CircularProgress thickness={ 2 } />
    </Box>
  )
}

export default FullScreenLoading;