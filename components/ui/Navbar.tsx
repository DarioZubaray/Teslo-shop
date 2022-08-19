import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import NextLink from 'next/link';

import { AppBar, Badge, Box, Button, IconButton, Link, Toolbar, Typography } from '@mui/material';
import { SearchOutlined, ShoppingCartOutlined } from '@mui/icons-material';
import { UiContext } from '../../context';


export const Navbar = () => {
    
    const [ section, setSection ] = useState('')
    const { route } = useRouter()
    const { toggleSideMenu } = useContext(UiContext)
    
    useEffect(() => {
        const parts = route.split('/')[2]
        setSection(parts)
    }, [route])
    
    const getColorButton = (button: string) => {
        return section == button ? 'primary' : 'info'
    }

  return (
    <AppBar>
        <Toolbar>
            <NextLink href='/' passHref>
                <Link display='flex' alignItems='center'>
                    <Typography variant='h6'>Teslo |</Typography>
                    <Typography sx={{ ml: 0.5 }}>Shop</Typography>
                </Link>  
            </NextLink>

            <Box flex={ 1 } />

            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                <NextLink href='/category/men' passHref>
                    <Link>
                        <Button color={ getColorButton('men') }>Hombres</Button>
                    </Link>
                </NextLink>
                <NextLink href='/category/women' passHref>
                    <Link>
                        <Button color={ getColorButton('women') }>Mujeres</Button>
                    </Link>
                </NextLink>
                <NextLink href='/category/kids' passHref>
                    <Link>
                        <Button color={ getColorButton('kids') }>Niños</Button>
                    </Link>
                </NextLink>
            </Box>


            <Box flex={ 1 } />

            <IconButton>
                <SearchOutlined />
            </IconButton>

            <NextLink href="/cart" passHref>
                <Link>
                    <IconButton>
                        <Badge badgeContent={ 2 } color="secondary">
                            <ShoppingCartOutlined />
                        </Badge>
                    </IconButton>
                </Link>
            </NextLink>


            <Button onClick={ toggleSideMenu }>
                Menú
            </Button>

        </Toolbar>
    </AppBar>
  )
}
