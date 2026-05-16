import { NextPage } from "next";
import withAdminLayout from "../../libs/components/adminpage/AdminLayout";
import ProductsManager from "../../libs/components/adminpage/ProductsManager";

const AdminProductsPage: NextPage = () => <ProductsManager />;

export default withAdminLayout(AdminProductsPage);
