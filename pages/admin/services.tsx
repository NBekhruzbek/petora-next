import { NextPage } from "next";
import withAdminLayout from "../../libs/components/adminpage/AdminLayout";
import ServicesManager from "../../libs/components/adminpage/ServicesManager";

const AdminServicesPage: NextPage = () => <ServicesManager />;

export default withAdminLayout(AdminServicesPage);
