import { NextPage } from "next";
import withAdminLayout from "../../libs/components/adminpage/AdminLayout";
import AgentsManager from "../../libs/components/adminpage/AgentsManager";

const AdminAgentsPage: NextPage = () => <AgentsManager />;

export default withAdminLayout(AdminAgentsPage);
