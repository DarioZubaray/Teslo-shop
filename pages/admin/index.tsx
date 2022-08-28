import { CreditCardOutlined, DashboardOutlined } from "@mui/icons-material"
import { Grid } from "@mui/material";
import { SummaryTile } from "../../components/admin";
import { AdminLayout } from "../../components/layouts"

const DashboardPage = () => {
    return (
        <AdminLayout
            title="Dashboard"
            subTitle="Estadisticas generales"
            icon={ <DashboardOutlined /> }
        >
            <Grid container spacing={ 2 }>

            <SummaryTile 
                title={ '50' }
                subTitle="Ordenes totales"
                icon={ <CreditCardOutlined color="secondary" sx={{ fontSize: 40 }} /> }
            />

            </Grid>
        </AdminLayout>
    )
}

export default DashboardPage;
