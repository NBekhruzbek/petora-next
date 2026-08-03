import { NextPage } from "next";
import withAdminLayout from "../../libs/components/adminpage/AdminLayout";
import DiscoveryPetsManager from "../../libs/components/adminpage/DiscoveryPetsManager";

const AdminDiscoveryPage: NextPage = () => <DiscoveryPetsManager />;

export default withAdminLayout(AdminDiscoveryPage);
