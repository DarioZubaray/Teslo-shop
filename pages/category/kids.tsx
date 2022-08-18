import type { NextPage } from 'next';
import { Typography } from '@mui/material';

import { ShopLayout } from '../../components/layouts';
import { ProductList } from '../../components/products';
import { useProducts } from '../../hooks';
import FullScreenLoading from '../../components/ui/FullScreenLoading';

const KidsPage: NextPage = () => {

  const { products, isLoading } = useProducts('/products?gender=kids')

  return (
    <ShopLayout title={'Teslo-Shop - Productos para Niños'} pageDescription={'Encuentra los mejores productos para niños de Teslo aquí'}>
        <Typography variant='h1' component='h1'>Tienda</Typography>
        <Typography variant='h2' sx={{ mb: 1 }}>Todos los productos para niños</Typography>

        {
          isLoading
          ? <FullScreenLoading />
          : <ProductList products={ products } />
        }
    

    </ShopLayout>
  )
}

export default KidsPage
