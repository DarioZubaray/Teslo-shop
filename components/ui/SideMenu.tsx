import { useContext, useState } from "react"
import { useRouter } from "next/router"
import { Box, Divider, Drawer, IconButton, Input, InputAdornment, List, ListItem, ListItemIcon, ListItemText, ListSubheader, Typography } from "@mui/material"
import { AccountCircleOutlined, AdminPanelSettings, CategoryOutlined, ConfirmationNumberOutlined, EscalatorWarningOutlined, FemaleOutlined, LoginOutlined, MaleOutlined, SearchOutlined, VpnKeyOutlined } from "@mui/icons-material"
import { AuthContext, UiContext } from "../../context"


export const SideMenu = () => {

    const { isLoggedIn, user, logoutUser } = useContext(AuthContext)
    const { isMenuOpen, toggleSideMenu } = useContext(UiContext)
    const router = useRouter()

    const [ searchTerm, setSearchTerm ] = useState('')

    const onSearchTerm = () => {
        console.log("buscando:")
        if( searchTerm.trim().length === 0 ) return;

        navigateTo(`/search/${ searchTerm }`)
    }

    const navigateTo = (url: string) => {
        toggleSideMenu()
        router.push(url)
    }

    const onLoggout = () => {
        logoutUser();
    }

  return (
    <Drawer
        open={ isMenuOpen }
        onClose={ toggleSideMenu }
        anchor='right'
        sx={{ backdropFilter: 'blur(4px)', transition: 'all 0.5s ease-out' }}
    >
        <Box sx={{ width: 250, paddingTop: 5 }}>
            
            <List>

                <ListItem>
                    <Input
                        autoFocus
                        value={ searchTerm }
                        onChange={ (e) => setSearchTerm( e.target.value ) }
                        onKeyPress={ (e) => e.key === 'Enter' ? onSearchTerm() : null }
                        type='text'
                        placeholder="Buscar..."
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={ onSearchTerm }
                                    aria-label="toggle password visibility"
                                >
                                 <SearchOutlined />
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                </ListItem>

                {
                    isLoggedIn && (
                        <Typography sx={{ display: 'flex', justifyContent: 'center', mb: 3, mt: 3 }} variant="body1">
                            ¡Hola { user?.name }!</Typography>
                    )
                }

                {
                    isLoggedIn && (
                        <ListItem button>
                            <ListItemIcon>
                                <AccountCircleOutlined/>
                            </ListItemIcon>
                            <ListItemText primary={'Perfil'} />
                        </ListItem>
                    )
                }

                {
                    isLoggedIn && (
                        <ListItem button onClick={() => navigateTo('/orders/history') }>
                            <ListItemIcon>
                                <ConfirmationNumberOutlined/>
                            </ListItemIcon>
                            <ListItemText primary={'Mis Ordenes'} />
                        </ListItem>
                    )
                }


                <ListItem button sx={{ display: { xs: '', sm: 'none' } }} onClick={() => navigateTo('/category/men') }>
                    <ListItemIcon>
                        <MaleOutlined/>
                    </ListItemIcon>
                    <ListItemText primary={'Hombres'} />
                </ListItem>

                <ListItem button sx={{ display: { xs: '', sm: 'none' } }} onClick={() => navigateTo('/category/women')}>
                    <ListItemIcon>
                        <FemaleOutlined/>
                    </ListItemIcon>
                    <ListItemText primary={'Mujeres'} />
                </ListItem>

                <ListItem button sx={{ display: { xs: '', sm: 'none' } }} onClick={() => navigateTo('/category/kids')}>
                    <ListItemIcon>
                        <EscalatorWarningOutlined/>
                    </ListItemIcon>
                    <ListItemText primary={'Niños'} />
                </ListItem>


                {
                    !isLoggedIn 
                    ? (
                        <ListItem button onClick={ () => navigateTo(`/auth/login?p=${ router.asPath }`)}>
                            <ListItemIcon>
                                <VpnKeyOutlined/>
                            </ListItemIcon>
                            <ListItemText primary={'Ingresar'} />
                        </ListItem>
                    ) : (
                        <ListItem button onClick={ onLoggout }>
                            <ListItemIcon>
                                <LoginOutlined/>
                            </ListItemIcon>
                            <ListItemText primary={'Salir'} />
                        </ListItem>
                    )
                }

                {
                    user?.role === 'admin' && (
                        <>
                            <Divider />
                            <ListSubheader>Admin Panel</ListSubheader>

                            <ListItem button>
                                <ListItemIcon>
                                    <CategoryOutlined/>
                                </ListItemIcon>
                                <ListItemText primary={'Productos'} />
                            </ListItem>
                            <ListItem button>
                                <ListItemIcon>
                                    <ConfirmationNumberOutlined/>
                                </ListItemIcon>
                                <ListItemText primary={'Ordenes'} />
                            </ListItem>

                            <ListItem button>
                                <ListItemIcon>
                                    <AdminPanelSettings/>
                                </ListItemIcon>
                                <ListItemText primary={'Usuarios'} />
                            </ListItem>
                        </>
                    )
                }

           </List>
        </Box>
    </Drawer>
  )
}