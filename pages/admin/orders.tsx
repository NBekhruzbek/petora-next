import { NextPage } from "next";
import withAdminLayout from "../../libs/components/adminpage/AdminLayout";
import OrdersManager from "../../libs/components/adminpage/OrdersManager";

const AdminOrdersPage: NextPage = () => <OrdersManager />;

export default withAdminLayout(AdminOrdersPage);
