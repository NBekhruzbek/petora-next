import { NextPage } from "next";
import withAdminLayout from "../../libs/components/adminpage/AdminLayout";
import BookingsManager from "../../libs/components/adminpage/BookingsManager";

const AdminBookingsPage: NextPage = () => <BookingsManager />;

export default withAdminLayout(AdminBookingsPage);
