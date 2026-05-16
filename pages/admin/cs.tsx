import { NextPage } from "next";
import withAdminLayout from "../../libs/components/adminpage/AdminLayout";
import CSManager from "../../libs/components/adminpage/CSManager";

const AdminCSPage: NextPage = () => <CSManager />;

export default withAdminLayout(AdminCSPage);
