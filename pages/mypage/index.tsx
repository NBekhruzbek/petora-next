import { useTranslation } from "react-i18next";
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
import { ReactNode, useEffect, useMemo, useRef } from "react";
import PersonIcon from "@mui/icons-material/Person";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import BuildIcon from "@mui/icons-material/Build";
import ArticleIcon from "@mui/icons-material/Article";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import LogoutIcon from "@mui/icons-material/Logout";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { useReactiveVar } from "@apollo/client";
import MyProfile from "@/libs/components/mypage/MyProfile";
import ServiceManagement from "@/libs/components/mypage/ServiceManagement";
import BookingsOrders from "@/libs/components/mypage/BookingsOrders";
import MyFavorites from "@/libs/components/mypage/MyFavorites";
import MyArticles from "@/libs/components/mypage/MyArticles";
import Notifications from "@/libs/components/mypage/Notifications";
import { userVar } from "@/apollo/store";
import { getJwtToken, logOut } from "@/libs/auth";
import { usePendingBookingRequests } from "@/libs/hooks/usePendingBookingRequests";
import { MemberType } from "@/libs/enums/member.enum";

type CategoryKey =
  | "ORDERS_BOOKINGS"
  | "MY_FAVORITES"
  | "SERVICE_MANAGEMENT"
  | "MY_ARTICLES"
  | "NOTIFICATIONS"
  | "MY_PROFILE";

const userCategories: CategoryKey[] = [
  "MY_PROFILE",
  "ORDERS_BOOKINGS",
  "MY_FAVORITES",
  "MY_ARTICLES",
];

const agentCategories: CategoryKey[] = [
  "MY_PROFILE",
  "SERVICE_MANAGEMENT",
  "ORDERS_BOOKINGS",
  "MY_FAVORITES",
  "MY_ARTICLES",
];

const linkedOnlyCategories: CategoryKey[] = ["NOTIFICATIONS"];

const HEADER_OFFSET = 210;

const memberTypeLabelKeys: Record<string, string> = {
  [MemberType.AGENT]: "member.typeAgent",
  [MemberType.ADMIN]: "member.typeAdmin",
  [MemberType.USER]: "member.typeUser",
};

const categoryMeta: Record<CategoryKey, { labelKey: string; icon: ReactNode }> =
  {
    MY_PROFILE: {
      labelKey: "mypage.nav.profile",
      icon: <PersonIcon />,
    },
    ORDERS_BOOKINGS: {
      labelKey: "mypage.nav.orders",
      icon: <FactCheckIcon />,
    },
    MY_FAVORITES: {
      labelKey: "mypage.nav.favorites",
      icon: <FavoriteBorderIcon />,
    },
    SERVICE_MANAGEMENT: {
      labelKey: "mypage.nav.serviceMgmt",
      icon: <BuildIcon />,
    },
    MY_ARTICLES: {
      labelKey: "mypage.nav.articles",
      icon: <ArticleIcon />,
    },
    NOTIFICATIONS: {
      labelKey: "mypage.nav.notifications",
      icon: <NotificationsNoneIcon />,
    },
  };

const MyPage: NextPage = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const user = useReactiveVar(userVar);
  const contentRef = useRef<HTMLDivElement | null>(null);

  const isAgent = user?.memberType === MemberType.AGENT;
  const isAdmin = user?.memberType === MemberType.ADMIN;

  /** APOLLO REQUESTS **/

  const { pendingCount: pendingRequests, refetchPendingCount } =
    usePendingBookingRequests({ live: true });

  /** DERIVED **/

  const categoryOrder = useMemo(
    () => (isAgent ? agentCategories : userCategories),
    [isAgent],
  );

  // The panel is selected by ?category=. ?articleCategory= is the older name
  // this page inherited from /community — where it genuinely is the article
  // category — and is still honoured so existing links keep working.
  const rawCategory = router.query.category ?? router.query.articleCategory;

  const normalizedCategory =
    rawCategory === "ORDERS" ||
    rawCategory === "BOOKINGS" ||
    rawCategory === "BOOKINGS_ORDERS"
      ? "ORDERS_BOOKINGS"
      : rawCategory;
  const routableCategories = [...categoryOrder, ...linkedOnlyCategories];
  const activeCategory: CategoryKey =
    typeof normalizedCategory === "string" &&
    routableCategories.includes(normalizedCategory as CategoryKey)
      ? (normalizedCategory as CategoryKey)
      : categoryOrder[0];

  const activeMeta = categoryMeta[activeCategory];
  const memberName =
    user?.memberFullName || user?.memberUserName || t("mypage.fallbackName");
  const memberImage = user?.memberImage || "/img/profile/defaultUser.png";
  const memberTypeLabel = t(
    memberTypeLabelKeys[user?.memberType] ?? "member.typeUser",
  );

  /** LIFECYCLES **/

  useEffect(() => {
    if (!getJwtToken()) void router.push("/");
  }, [router]);

  useEffect(() => {
    if (!user?._id) return;
    if (activeCategory === "SERVICE_MANAGEMENT" && isAgent) {
      void refetchPendingCount();
    }
  }, [activeCategory, user?._id, isAgent]);

  useEffect(() => {
    if (!rawCategory) return;

    const content = contentRef.current;
    if (!content) return;

    const top = content.getBoundingClientRect().top;
    if (top <= HEADER_OFFSET) return;

    window.scrollTo({
      top: Math.max(0, window.scrollY + top - HEADER_OFFSET),
      behavior: "smooth",
    });
  }, [activeCategory, rawCategory]);

  /** HANDLERS **/

  const handleCategoryChange = (category: CategoryKey) => {
    void router.push(
      {
        pathname: "/mypage",
        query: { category },
      },
      undefined,
      { shallow: true, scroll: false },
    );
  };

  return (
    <Stack className="my-page">
      <Stack className="container">
        <Stack className="my-page-sidebar">
          <Stack className="my-page-sidebar-brand">
            <img className="member-img" src={memberImage} alt="member image" />

            <Stack className="my-page-brand-copy">
              <Typography className="my-page-brand-title">
                {memberName}
              </Typography>
              <Typography className="my-page-brand-subtitle">
                {memberTypeLabel}
              </Typography>
            </Stack>
          </Stack>

          <Stack className="my-page-category-list">
            {categoryOrder.map((category) => {
              const meta = categoryMeta[category];
              const isActive = activeCategory === category;
              const badgeContent =
                category === "SERVICE_MANAGEMENT" ? pendingRequests : 0;

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
                    <span>{t(meta.labelKey)}</span>
                  </Stack>
                  {badgeContent > 0 && (
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
            {isAdmin && (
              <Button
                startIcon={<AdminPanelSettingsIcon />}
                onClick={() => void router.push("/admin")}
                sx={{
                  width: "100%",
                  justifyContent: "flex-start",
                  textTransform: "none",
                  fontWeight: 700,
                  fontSize: "14px",
                  color: "var(--pt-ink)",
                  background: "var(--pt-selected)",
                  borderRadius: "10px",
                  px: 2,
                  py: 1,
                  mb: 1,
                  "&:hover": { background: "var(--pt-hover)" },
                }}
              >
                {t("mypage.adminPanel")}
              </Button>
            )}
            <Button
              className="btn-logout"
              startIcon={<LogoutIcon />}
              onClick={() => logOut()}
            >
              {t("auth.logout")}
            </Button>
            <Typography className="my-page-footer-copy">
              {t("mypage.copyright")}
            </Typography>
          </Stack>
        </Stack>

        <Stack className="my-page-content" ref={contentRef}>
          <Stack className="my-page-content-top">
            <Stack className="my-page-content-heading">
              <Typography className="my-page-board-title">
                {t(activeMeta.labelKey).toUpperCase()}
              </Typography>
              <Typography className="my-page-board-subtitle">{""}</Typography>
            </Stack>
          </Stack>

          <Stack className="my-page-mobile-filter">
            <TextField
              select
              size="small"
              value={activeCategory}
              onChange={(event) =>
                handleCategoryChange(event.target.value as CategoryKey)
              }
              SelectProps={{
                MenuProps: { PaperProps: { className: "mypage-filter-menu" } },
              }}
            >
              {categoryOrder.map((category) => (
                <MenuItem key={category} value={category}>
                  {t(categoryMeta[category].labelKey)}
                </MenuItem>
              ))}
            </TextField>
          </Stack>

          <Stack>
            {activeCategory === "MY_PROFILE" && <MyProfile />}
            {activeCategory === "SERVICE_MANAGEMENT" && <ServiceManagement />}
            {activeCategory === "ORDERS_BOOKINGS" && <BookingsOrders />}
            {activeCategory === "MY_FAVORITES" && <MyFavorites />}
            {activeCategory === "MY_ARTICLES" && <MyArticles />}
            {activeCategory === "NOTIFICATIONS" && <Notifications />}
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default withLayoutBasic(MyPage);
