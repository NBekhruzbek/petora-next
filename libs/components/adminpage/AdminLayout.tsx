import { Stack } from "@mui/material";
import Head from "next/head";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

const withAdminLayout = (Component: any) => {
  return (props: any) => {
    return (
      <>
        <Head>
          <title>Petora Admin</title>
        </Head>
        <Stack id="admin-wrap" direction="row">
          <AdminSidebar />
          <Stack id="admin-main">
            <AdminHeader />
            <Stack id="admin-content">
              <Component {...props} />
            </Stack>
          </Stack>
        </Stack>
      </>
    );
  };
};

export default withAdminLayout;
