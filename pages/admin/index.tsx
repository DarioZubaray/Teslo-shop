import { DashboardOutlined } from "@mui/icons-material"
import { AdminLayout } from "../../components/layouts"

const DashboardPage = () => {
    return (
        <AdminLayout
            title="Dashboard"
            subTitle="Estadisticas generales"
            icon={ <DashboardOutlined /> }
        >

        </AdminLayout>
    )
}

export default DashboardPage;
