import type { GetServerSideProps, NextPage } from 'next';
import { Typography } from '@mui/material';

import { ShopLayout } from '../../components/layouts';
import { ProductList } from '../../components/products';
import { dbProducts } from '../../database';
import { IProduct } from '../../interfaces';

interface Props {
    products: IProduct[],
    foundProducts: boolean,
    query: string
}

const SearchPage: NextPage<Props> = ({ products, foundProducts, query }) => {

  return (
    <ShopLayout title={'Teslo-Shop - Home'} pageDescription={'Encuentra los mejores productos de Teslo aquí'}>
        <Typography variant='h1' component='h1'>Buscar productos</Typography>
        <Typography variant='h2' sx={{ mb: 1 }}>
            {
                foundProducts
                ? `Termino de buscado: ${ query }`
                : 'Tal vez te interese'
            }
        </Typography>

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
    const foundProducts = products.length > 0

    // TODO: buscar otros productos
    if (!foundProducts) {
        products = await dbProducts.getAllProducts()
    }

    return {
      props: {
        products,
        foundProducts, query
      }
    }
  }

export default SearchPage
