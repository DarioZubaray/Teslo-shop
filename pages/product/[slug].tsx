import { useState } from 'react';
import { GetServerSideProps, GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { Box, Button, Chip, Grid, Typography } from '@mui/material';

import { ShopLayout } from '../../components/layouts';
import { ProductSlideshow, SizeSelector } from '../../components/products';
import { ItemCounter } from '../../components/ui/ItemCounter';
import { dbProducts } from '../../database';
import { ICartProduct, IProduct, ISize } from '../../interfaces';

interface Props {
  product: IProduct
}

const ProductPage: NextPage<Props> = ({ product }) => {

  const [ tempCartProduct, setTempCartProduct ] = useState<ICartProduct>({
    _id: product._id,
    image: product.images[0],
    price: product.price,
    size: undefined,
    slug: product.slug,
    title: product.title,
    gender: product.gender,
    quantity: 1,
  })

  const onAddProduct = () => {
    console.log({tempCartProduct})
  }

  const handleSelectedSize = (size: ISize) => {
    setTempCartProduct((temp) => ({
      ...temp,
      size
    }))
  }

  const onUpdatedQuantity = (amount: number) => {
    setTempCartProduct((temp) => ({
      ...temp,
      quantity: temp.quantity + amount
    }))
  }

  return (
    <ShopLayout title={ product.title } pageDescription={ product.description }>
    
      <Grid container spacing={3}>

        <Grid item xs={12} sm={ 7 }>
          <ProductSlideshow 
            images={ product.images }
          />
        </Grid>

        <Grid item xs={ 12 } sm={ 5 }>
          <Box display='flex' flexDirection='column'>

            {/* titulos */}
            <Typography variant='h1' component='h1'>{ product.title }</Typography>
            <Typography variant='subtitle1' component='h2'>{ `$${product.price}` }</Typography>

            {/* Cantidad */}
            <Box sx={{ my: 2 }}>
              <Typography variant='subtitle2'>Cantidad</Typography>
              
              <ItemCounter
                currentValue={ tempCartProduct.quantity }
                updatedQuantity={ onUpdatedQuantity }
                maxValue={ product.inStock }
              />
              
              <SizeSelector
                sizes={ product.sizes }
                selectedSize={ tempCartProduct.size }
                onSelectedSize={ handleSelectedSize }
              />
            </Box>


            {/* Agregar al carrito */}
            {
              (product.inStock > 0) 
              ? (
                <Button
                  color="secondary"
                  className='circular-btn'
                  onClick={ onAddProduct }
                >
                  {
                    tempCartProduct.size
                    ? 'Agregar al carrito'
                    : 'Seleccione una talla'
                  }
                </Button>
              )
              : (
                <Chip label="No hay disponibles" color="error" variant="outlined" />
              )
            }

            {/* Descripción */}
            <Box sx={{ mt:3 }}>
              <Typography variant='subtitle2'>Descripción</Typography>
              <Typography variant='body2'>{ product.description }</Typography>
            </Box>

          </Box>
        </Grid>


      </Grid>

    </ShopLayout>
  )
}

// export const getServerSideProps: GetServerSideProps = async ({ params }) => {

//   const { slug = '' } = params as { slug: string }
//   const product = await dbProducts.getProductBySLug( slug )

//   if (!product) {
//     return {
//       redirect: {
//         destination: '/',
//         permanent: false
//       }
//     }
//   }

//   return {
//     props: {
//       product
//     }, // will be passed to the page component as props
//   }
// }

export const getStaticPaths: GetStaticPaths = async() => {

  const slugs = await dbProducts.getAllProductSlugs();
  const paths = slugs.map(({slug}) => ({
    params: { slug },
  }));

  return {
    paths,
    fallback: 'blocking',
   }
}

// `getStaticPaths` requires using `getStaticProps`
export const getStaticProps: GetStaticProps = async({ params }) => {

  const { slug = '' } = params as { slug: string }
  const product = await dbProducts.getProductBySLug( slug );

  if( !product ) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  return {
    props: {
      product
    },
    revalidate: 60 * 60 * 24 // se valida cada 24hs 
  }
}

export default ProductPage