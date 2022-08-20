import type { GetServerSideProps, NextPage } from 'next';
import { Typography } from '@mui/material';

import { ShopLayout } from '../../components/layouts';
import { ProductList } from '../../components/products';
import { dbProducts } from '../../database';
import { IProduct } from '../../interfaces';

interface Props {
    products: IProduct[]
}

const SearchPage: NextPage<Props> = ({ products }) => {

  return (
    <ShopLayout title={'Teslo-Shop - Home'} pageDescription={'Encuentra los mejores productos de Teslo aquí'}>
        <Typography variant='h1' component='h1'>Buscar productos</Typography>
        <Typography variant='h2' sx={{ mb: 1 }}>ABC --- 123</Typography>

         <ProductList products={ products } />

    </ShopLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async({ params }) => {

    const { query = ' ' } = params as { query : string}

    if (query.length === 0) {
        return {
            redirect: {
                destination: '/',
                permanent: true
            }
        }
    }

    let products = await dbProducts.getProductsByTerm(query)

    // TODO: buscar otros productos

    return {
      props: {
        products
      }
    }
  }

export default SearchPage
