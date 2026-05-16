import { NextPage } from "next";
import withAdminLayout from "../../libs/components/adminpage/AdminLayout";
import UsersManager from "../../libs/components/adminpage/UsersManager";

const AdminUsersPage: NextPage = () => <UsersManager />;

export default withAdminLayout(AdminUsersPage);
