import { NextPage } from "next";
import withAdminLayout from "../../libs/components/adminpage/AdminLayout";
import CommunityModerator from "../../libs/components/adminpage/CommunityModerator";

const AdminCommunityPage: NextPage = () => <CommunityModerator />;

export default withAdminLayout(AdminCommunityPage);
