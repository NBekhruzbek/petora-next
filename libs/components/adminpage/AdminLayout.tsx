import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { Stack } from "@mui/material";
import Head from "next/head";
import { useRouter } from "next/router";
import { useReactiveVar } from "@apollo/client";
import { userVar } from "@/apollo/store";
import { getJwtToken } from "@/libs/auth";
import { MemberType } from "@/libs/enums/member.enum";
import { hydrateAdminColorScheme } from "@/libs/adminTheme";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import AdminMobileNav from "./AdminMobileNav";
import { useAdminTableLabels } from "./adminHelpers";

/**
 * Every query behind this layout is `@Roles(ADMIN)`-guarded, so letting a
 * non-admin through would only produce a wall of error popups. `_app` decodes
 * the token into `userVar` on mount, so the check waits for that to land: a
 * token with no member yet means "still deciding", not "not an admin".
 */
const withAdminLayout = (Component: any) => {
  return (props: any) => {
    const router = useRouter();
    const user = useReactiveVar(userVar);
    const hasToken = Boolean(getJwtToken());
    const isAdmin = user?.memberType === MemberType.ADMIN;
    const isDeciding = hasToken && !user?._id;

    useEffect(() => {
      if (isDeciding || isAdmin) return;
      router.replace("/");
    }, [isDeciding, isAdmin, router]);

    useEffect(() => hydrateAdminColorScheme(), []);

    useAdminTableLabels(isAdmin);

    if (!isAdmin) return null;

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
          <AdminMobileNav />
        </Stack>
      </>
    );
  };
};

export default withAdminLayout;
