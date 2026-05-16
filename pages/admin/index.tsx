import { NextPage } from "next";
import withAdminLayout from "../../libs/components/adminpage/AdminLayout";
import AdminDashboard from "../../libs/components/adminpage/AdminDashboard";

const AdminPage: NextPage = () => <AdminDashboard />;

export default withAdminLayout(AdminPage);
