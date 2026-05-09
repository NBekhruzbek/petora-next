import withLayoutBasic from "@/libs/components/layout/LayoutBasic";
import {
  Badge,
  Button,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { ReactNode, useMemo } from "react";
import PersonIcon from "@mui/icons-material/Person";
import EventIcon from "@mui/icons-material/Event";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import BuildIcon from "@mui/icons-material/Build";
import ArticleIcon from "@mui/icons-material/Article";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import MyProfile from "@/libs/components/mypage/MyProfile";

type MemberType = "USER" | "SERVICE_AGENT";

type CategoryKey =
  | "BOOKINGS"
  | "ORDERS"
  | "MY_FAVORITES"
  | "SERVICE_MANAGEMENT"
  | "MY_ARTICLES"
  | "NOTIFICATIONS"
  | "MY_PROFILE";

const userCategories: CategoryKey[] = [
  "MY_PROFILE",
  "BOOKINGS",
  "ORDERS",
  "MY_FAVORITES",
  "MY_ARTICLES",
  "NOTIFICATIONS",
];

const serviceAgentCategories: CategoryKey[] = [
  "MY_PROFILE",
  "SERVICE_MANAGEMENT",
  "BOOKINGS",
  "ORDERS",
  "MY_FAVORITES",
  "MY_ARTICLES",
  "NOTIFICATIONS",
];

const categoryMeta: Record<
  CategoryKey,
  { label: string; description: string; icon: ReactNode }
> = {
  MY_PROFILE: {
    label: "My Profile",
    description: "",
    icon: <PersonIcon />,
  },
  BOOKINGS: {
    label: "Bookings",
    description: "",
    icon: <EventIcon />,
  },
  ORDERS: {
    label: "Orders",
    description: "",
    icon: <ShoppingCartIcon />,
  },
  MY_FAVORITES: {
    label: "My Favorites",
    description: "",
    icon: <FavoriteBorderIcon />,
  },
  SERVICE_MANAGEMENT: {
    label: "Service Management",
    description: "",
    icon: <BuildIcon />,
  },
  MY_ARTICLES: {
    label: "My Articles",
    description: "",
    icon: <ArticleIcon />,
  },
  NOTIFICATIONS: {
    label: "Notifications",
    description: "",
    icon: <NotificationsNoneIcon />,
  },
};

const MyPage: NextPage = () => {
  const router = useRouter();

  // TODO: Replace with actual member type from auth context/state
  const memberType: MemberType = "SERVICE_AGENT"; // "USER" | "SERVICE_AGENT"

  const categoryOrder = useMemo(() => {
    if ((memberType as MemberType) === "SERVICE_AGENT") {
      return serviceAgentCategories;
    }
    return userCategories;
  }, [memberType]);

  const rawCategory = router.query.articleCategory;
  const activeCategory: CategoryKey =
    typeof rawCategory === "string" &&
    categoryOrder.includes(rawCategory as CategoryKey)
      ? (rawCategory as CategoryKey)
      : categoryOrder[0];

  const activeMeta = categoryMeta[activeCategory];

  const handleCategoryChange = (category: CategoryKey) => {
    void router.push(
      {
        pathname: "/mypage",
        query: { articleCategory: category },
      },
      undefined,
      { shallow: true },
    );
  };

  return (
    <Stack className="my-page">
      <Stack className="container">
        <Stack className="my-page-sidebar">
          <Stack className="my-page-sidebar-brand">
            <img
              className="member-img"
              src="/img/profile/defaultUser.png"
              alt="member image"
            />

            <Stack className="my-page-brand-copy">
              <Typography className="my-page-brand-title">My Page</Typography>
              <Typography className="my-page-brand-subtitle">
                {memberType.replace("_", " ")}
              </Typography>
            </Stack>
          </Stack>

          <Stack className="my-page-category-list">
            {categoryOrder.map((category) => {
              const meta = categoryMeta[category];
              const isActive = activeCategory === category;
              const hasBadge =
                category === "NOTIFICATIONS" ||
                category === "SERVICE_MANAGEMENT";
              const badgeContent = 1;

              return (
                <Button
                  key={category}
                  className={`my-page-category-btn ${isActive ? "active" : ""}`}
                  onClick={() => handleCategoryChange(category)}
                  startIcon={meta.icon}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <Stack direction="row" alignItems="center" flex={1}>
                    <span>{meta.label}</span>
                  </Stack>
                  {hasBadge && (
                    <Badge
                      badgeContent={badgeContent}
                      color="error"
                      sx={{ marginRight: "2px" }}
                    />
                  )}
                </Button>
              );
            })}
          </Stack>

          <Stack className="my-page-sidebar-footer">
            <Typography className="my-page-footer-title">
              My Page Hub
            </Typography>
            <Typography className="my-page-footer-copy">
              © 2026 All rights reserved
            </Typography>
          </Stack>
        </Stack>

        <Stack className="my-page-content">
          <Stack className="my-page-content-top">
            <Stack className="my-page-content-heading">
              <Typography className="my-page-board-title">
                {activeMeta.label.toUpperCase()}
              </Typography>
              <Typography className="my-page-board-subtitle">
                {activeMeta.description}
              </Typography>
            </Stack>
          </Stack>

          <Stack>
            {activeCategory === "MY_PROFILE" && <MyProfile />}
            {/* Content for other categories will be added here */}
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default withLayoutBasic(MyPage);
