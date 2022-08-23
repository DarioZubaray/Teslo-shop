import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import NextLink from 'next/link';

import { AppBar, Badge, Box, Button, IconButton, Input, InputAdornment, Link, Toolbar, Typography } from '@mui/material';
import { ClearOutlined, SearchOutlined, ShoppingCartOutlined } from '@mui/icons-material';
import { CartContext, UiContext } from '../../context';


export const Navbar = () => {
    
    const [ section, setSection ] = useState('')
    const { route, push: routerPush } = useRouter()
    const { toggleSideMenu } = useContext(UiContext)
    const { numberOfItem } = useContext( CartContext )
    const [ searchTerm, setSearchTerm ] = useState('')
    const [ isSearchVisible, setIsSearchVisible ] = useState(false)
    
    useEffect(() => {
        const parts = route.split('/')[2]
        setSection(parts)
    }, [route])
    
    const getColorButton = (button: string) => {
        return section == button ? 'primary' : 'info'
    }

    const onSearchTerm = () => {
        console.log("buscando:")
        if( searchTerm.trim().length === 0 ) return;

        routerPush(`/search/${ searchTerm }`)
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

            <Box sx={{ display:  isSearchVisible ? 'none' : { xs: 'none', sm: 'block' } }}
                className='fadeIn'>
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

            {/* Pantallas Grandes */}

            {
                isSearchVisible
                ? (
                    <Input
                        autoFocus
                        sx={{ display: { xs: 'none', sm: 'flex' } }}
                        value={ searchTerm }
                        onChange={ (e) => setSearchTerm( e.target.value ) }
                        onKeyPress={ (e) => e.key === 'Enter' ? onSearchTerm() : null }
                        type='text'
                        placeholder="Buscar..."
                        className='fadeIn'
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={ () => setIsSearchVisible(false) }
                                >
                                    <ClearOutlined />
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                )
                : (
                    <IconButton
                        onClick={ () => setIsSearchVisible(true) }
                        sx={{ display: { xs: 'none', sm: 'flex'}}}
                        className='fadeIn'
                    >
                        <SearchOutlined />
                    </IconButton>
                )
            }
            
            {/* Pantallas pequeñas */}
            <IconButton
                sx={{ display: { xs: 'flex', sm: 'none'}}}
                onClick={ toggleSideMenu }
            >
                <SearchOutlined />
            </IconButton>

            <NextLink href="/cart" passHref>
                <Link>
                    <IconButton>
                        <Badge badgeContent={ numberOfItem } color="secondary">
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
