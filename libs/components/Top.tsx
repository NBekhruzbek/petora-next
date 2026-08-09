import { Logout } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Divider,
  Drawer,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import { useReactiveVar } from "@apollo/client";
import { userVar } from "@/apollo/store";
import { logOut } from "@/libs/auth";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import React from "react";
import Basket from "./Basket";
import NotificationBell from "./notifications/NotificationBell";
import LoginRegister from "./account/LoginRegister";
import ThemeToggle from "./common/ThemeToggle";
import useDeviceDetect from "../hooks/useDeviceDetect";
import { useTranslation } from "react-i18next";
import {
  type AppLocale,
  defaultLocale,
  isAppLocale,
  locales,
} from "@/libs/i18n";

const Top = () => {
  const router = useRouter();
  const { t } = useTranslation();

  const user = useReactiveVar(userVar);
  const authMember = Boolean(user._id);
  const memberDisplayName =
    user.memberFullName || user.memberUserName || t("member.fallbackName");
  const memberTypeLabel =
    user.memberType === "AGENT"
      ? t("member.typeAgent")
      : user.memberType === "ADMIN"
        ? t("member.typeAdmin")
        : t("member.typeUser");
  const memberAvatar = user.memberImage || "/img/profile/defaultUser.png";

  const isAdmin = user.memberType === "ADMIN";

  const [colorChange, setColorChange] = useState<boolean>(false);
  const [bgColor, setBgColor] = useState<boolean>(false);
  const [logoutAnchor, setLogoutAnchor] = React.useState<null | HTMLElement>(
    null,
  );
  const logoutOpen = Boolean(logoutAnchor);

  const [loginOpen, setLoginOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [langAnchor, setLangAnchor] = useState<null | HTMLElement>(null);
  const langOpen = Boolean(langAnchor);

  // The active language is the URL's locale, not component state — it used to
  // be `useState`, which reset to "en" on every navigation.
  const lang: AppLocale = isAppLocale(router.locale)
    ? router.locale
    : defaultLocale;

  const changeLanguage = (next: AppLocale) => {
    setLangAnchor(null);
    if (next === lang) return;
    // Next reads this back on later visits once localeDetection is enabled.
    document.cookie = `NEXT_LOCALE=${next};path=/;max-age=31536000;samesite=lax`;
    void router.push(router.asPath, router.asPath, { locale: next });
  };

  const handleLoginOpen = () => setLoginOpen(true);
  const handleLoginClose = () => setLoginOpen(false);

  /** LIFECYCLES **/
  useEffect(() => {
    switch (router.pathname) {
      case "/property/detail":
        setBgColor(true);
        break;
      default:
        break;
    }
  }, [router]);

  /** HANDLERS **/
  const changeNavbarColor = () => {
    if (window.scrollY >= 30) {
      setColorChange(true);
    } else {
      setColorChange(false);
    }
  };

  const handleLogoutMenuOpen = (event: React.MouseEvent<HTMLDivElement>) => {
    setLogoutAnchor(event.currentTarget);
  };

  const handleLogoutMenuClose = () => {
    setLogoutAnchor(null);
  };

  if (typeof window !== "undefined") {
    window.addEventListener("scroll", changeNavbarColor);
  }

  const device = useDeviceDetect();

  if (device === "mobile") {
    const closeMobileNav = () => setMobileNavOpen(false);

    const mobileNavItems = [
      {
        key: "home",
        label: t("nav.home"),
        href: "/",
        active: router.pathname === "/",
      },
      {
        key: "service",
        label: t("nav.service"),
        href: "/service",
        active: router.pathname === "/service",
      },
      {
        key: "agents",
        label: t("nav.agents"),
        href: "/agents",
        active: router.pathname.startsWith("/agents"),
      },
      {
        key: "shop",
        label: t("nav.shop"),
        href: "/shop",
        active: router.pathname === "/shop",
      },
      {
        key: "community",
        label: t("nav.community"),
        href: "/community?articleCategory=FREE",
        active: router.pathname === "/community",
      },
      ...(authMember
        ? [
            {
              key: "mypage",
              label: t("nav.myPage"),
              href: "/mypage",
              active: router.pathname === "/mypage",
            },
          ]
        : []),
      {
        key: "cs",
        label: t("nav.cs"),
        href: "/cs",
        active: router.pathname === "/cs",
      },
    ];

    return (
      <>
        <Stack className="mobile-topbar">
          <Link href={"/"}>
            <Stack
              direction="row"
              alignItems="center"
              className="mobile-topbar-brand"
            >
              <img src="/img/logo/Petora-logo.png" alt="Petora" />
              <Box className="logo-name">Petora</Box>
            </Stack>
          </Link>

          <Stack
            direction="row"
            alignItems="center"
            className="mobile-topbar-actions"
          >
            <Basket />
            <NotificationBell />
            <IconButton
              className="mobile-nav-toggle"
              aria-label={t("nav.openMenu")}
              onClick={() => setMobileNavOpen(true)}
            >
              <MenuRoundedIcon />
            </IconButton>
          </Stack>
        </Stack>

        <Drawer
          anchor="right"
          open={mobileNavOpen}
          onClose={closeMobileNav}
          PaperProps={{ className: "mobile-nav-drawer-paper" }}
        >
          <Stack className="mobile-nav-drawer">
            <Stack
              className="mobile-nav-drawer__header"
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Box className="mobile-nav-drawer__brand">Petora</Box>
              <IconButton
                className="mobile-nav-drawer__close"
                aria-label={t("nav.closeMenu")}
                onClick={closeMobileNav}
              >
                <CloseRoundedIcon />
              </IconButton>
            </Stack>

            <Stack className="mobile-nav-drawer__list" component="nav">
              {mobileNavItems.map((item) => (
                <Link key={item.key} href={item.href}>
                  <Box
                    className={`mobile-nav-drawer__item ${item.active ? "active" : ""}`}
                    onClick={closeMobileNav}
                  >
                    {item.label}
                  </Box>
                </Link>
              ))}
            </Stack>

            <Divider className="mobile-nav-drawer__divider" />

            <Stack className="mobile-nav-drawer__lang" direction="row">
              <button
                type="button"
                className={lang === "en" ? "active" : ""}
                onClick={() => {
                  closeMobileNav();
                  changeLanguage("en");
                }}
              >
                {t("language.enShort")}
              </button>
              <button
                type="button"
                className={lang === "ko" ? "active" : ""}
                onClick={() => {
                  closeMobileNav();
                  changeLanguage("ko");
                }}
              >
                {t("language.koShort")}
              </button>
            </Stack>

            <ThemeToggle variant="two-up" />

            <Box className="mobile-nav-drawer__footer">
              {authMember ? (
                <>
                  <Stack className="mobile-nav-drawer__member" direction="row">
                    <Avatar
                      src={memberAvatar}
                      className="mobile-nav-drawer__avatar"
                    />
                    <Typography className="mobile-nav-drawer__member-name">
                      {memberDisplayName}
                    </Typography>
                    <button
                      type="button"
                      className="mobile-nav-drawer__logout"
                      onClick={() => {
                        closeMobileNav();
                        logOut();
                      }}
                    >
                      <Logout />
                      {t("auth.logout")}
                    </button>
                  </Stack>

                  {isAdmin && (
                    <button
                      type="button"
                      className="mobile-nav-drawer__admin"
                      onClick={() => {
                        closeMobileNav();
                        void router.push("/admin");
                      }}
                    >
                      <AdminPanelSettingsIcon />
                      {t("mypage.adminPanel")}
                    </button>
                  )}
                </>
              ) : (
                <button
                  type="button"
                  className="mobile-nav-drawer__login"
                  onClick={() => {
                    closeMobileNav();
                    handleLoginOpen();
                  }}
                >
                  <AccountCircleOutlinedIcon />
                  {t("auth.login")}
                </button>
              )}
            </Box>
          </Stack>
        </Drawer>

        <LoginRegister open={loginOpen} onClose={handleLoginClose} />
      </>
    );
  } else {
    return (
      <Stack className="navbar">
        <Stack
          className={`navbar-main ${colorChange ? "transparent" : ""} ${bgColor ? "transparent" : ""}`}
        >
          <Stack className="container">
            <Box component={"div"} className="logo-box">
              <Link href={"/"}>
                <Stack direction="row" alignItems="center">
                  <img src="/img/logo/Petora-logo.png" alt="" />
                  <Box className={"logo-name"}>Petora</Box>
                </Stack>
              </Link>
            </Box>
            <Box component={"div"} className="router-box">
              <Link href={"/"}>
                <div
                  className={`nav-item ${router.pathname === "/" ? "active" : ""}`}
                >
                  {t("nav.home")}
                </div>
              </Link>
              <Link href={"/service"}>
                <div
                  className={`nav-item ${router.pathname === "/service" ? "active" : ""}`}
                >
                  {t("nav.service")}
                </div>
              </Link>
              <Link href={"/agents"}>
                <div
                  className={`nav-item ${router.pathname.startsWith("/agents") ? "active" : ""}`}
                >
                  {t("nav.agents")}
                </div>
              </Link>
              <Link href={"/shop"}>
                <div
                  className={`nav-item ${router.pathname === "/shop" ? "active" : ""}`}
                >
                  {t("nav.shop")}
                </div>
              </Link>
              <Link href={"/community?articleCategory=FREE"}>
                <div
                  className={`nav-item ${router.pathname === "/community" ? "active" : ""}`}
                >
                  {t("nav.community")}
                </div>
              </Link>
              {authMember && (
                <Link href={"/mypage"}>
                  <div
                    className={`nav-item ${router.pathname === "/mypage" ? "active" : ""}`}
                  >
                    {t("nav.myPage")}
                  </div>
                </Link>
              )}
              <Link href={"/cs"}>
                <div
                  className={`nav-item ${router.pathname === "/cs" ? "active" : ""}`}
                >
                  {t("nav.cs")}
                </div>
              </Link>
              <Box>
                <Basket />
              </Box>
              <NotificationBell />
            </Box>

            <Box component={"div"} className="user-box">
              <ThemeToggle />

              {/* Language Switcher */}
              <Box
                className="lang-switcher"
                onClick={(e) => setLangAnchor(e.currentTarget)}
              >
                <img
                  src={`https://flagcdn.com/w20/${lang === "en" ? "us" : "kr"}.png`}
                  width={18}
                  height={13}
                  alt={lang}
                />
                <Typography className="lang-switcher-label">
                  {lang === "en"
                    ? t("language.enShort")
                    : t("language.koShort")}
                </Typography>
              </Box>

              <Menu
                anchorEl={langAnchor}
                open={langOpen}
                onClose={() => setLangAnchor(null)}
                disableScrollLock
                sx={{ mt: "8px", zIndex: 10000 }}
                slotProps={{
                  paper: { elevation: 0, className: "lang-menu-paper" },
                }}
                transformOrigin={{ horizontal: "center", vertical: "top" }}
                anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
                MenuListProps={{ sx: { p: 0 } }}
              >
                {locales.map((l) => (
                  <MenuItem
                    key={l}
                    selected={lang === l}
                    onClick={() => changeLanguage(l)}
                    className="lang-menu-item"
                  >
                    <img
                      src={`https://flagcdn.com/w20/${l === "en" ? "us" : "kr"}.png`}
                      width={18}
                      height={13}
                      alt={l}
                    />
                    {t(`language.${l}`)}
                  </MenuItem>
                ))}
              </Menu>

              {authMember ? (
                <>
                  <div
                    className="login-user"
                    onClick={handleLogoutMenuOpen}
                    aria-controls={logoutOpen ? "basic-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={logoutOpen ? "true" : undefined}
                  >
                    <img src={memberAvatar} alt="profile" />
                  </div>

                  <Menu
                    id="basic-menu"
                    anchorEl={logoutAnchor}
                    open={logoutOpen}
                    onClose={handleLogoutMenuClose}
                    disableScrollLock
                    sx={{ mt: "10px", zIndex: 12000 }}
                    PaperProps={{
                      elevation: 0,
                      sx: {
                        width: 256,
                        border: "1px solid rgba(65, 0, 117, 0.12)",
                        borderRadius: "20px",
                        boxShadow: "0 24px 56px rgba(41, 12, 72, 0.18)",
                        overflow: "visible",
                        background: "#ffffff",
                        transformOrigin: "top right !important",
                        animation:
                          "dropdownOpen 0.22s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
                        "@keyframes dropdownOpen": {
                          from: {
                            opacity: 0,
                            transform: "scale(0.88) translateY(-6px)",
                          },
                          to: {
                            opacity: 1,
                            transform: "scale(1)    translateY(0)",
                          },
                        },
                        "&::before": {
                          content: '""',
                          display: "block",
                          position: "absolute",
                          top: -7,
                          right: 20,
                          width: 14,
                          height: 14,
                          background: "#ffffff",
                          borderTop: "1px solid rgba(65, 0, 117, 0.12)",
                          borderLeft: "1px solid rgba(65, 0, 117, 0.12)",
                          transform: "rotate(45deg)",
                          borderTopLeftRadius: "3px",
                          zIndex: 0,
                        },
                      },
                    }}
                    transformOrigin={{ horizontal: "right", vertical: "top" }}
                    anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                    MenuListProps={{ sx: { p: 0 } }}
                  >
                    {/* Header */}
                    <Box
                      sx={{
                        px: "18px",
                        py: "16px",
                        background: "#ffffff",
                        borderBottom: "1px solid rgba(65, 0, 117, 0.08)",
                        borderRadius: "20px 20px 0 0",
                      }}
                    >
                      <Stack direction="row" alignItems="center" gap="12px">
                        <Avatar
                          src={memberAvatar}
                          sx={{ width: 52, height: 52 }}
                        />
                        <Stack gap="4px">
                          <Typography
                            sx={{
                              fontFamily: "Assistant",
                              fontSize: "15px",
                              fontWeight: 800,
                              color: "#1a1333",
                              lineHeight: 1,
                            }}
                          >
                            {memberDisplayName}
                          </Typography>
                          <Stack
                            direction="row"
                            alignItems="center"
                            gap="4px"
                            sx={{
                              alignSelf: "flex-start",
                              px: "8px",
                              py: "2px",
                              borderRadius: "999px",
                              background: "rgba(65, 0, 117, 0.1)",
                            }}
                          >
                            <VerifiedUserOutlinedIcon
                              sx={{ fontSize: "11px", color: "#6d28d9" }}
                            />
                            <Typography
                              sx={{
                                fontFamily: "Assistant",
                                fontSize: "11px",
                                fontWeight: 700,
                                color: "#6d28d9",
                              }}
                            >
                              {memberTypeLabel}
                            </Typography>
                          </Stack>
                        </Stack>
                      </Stack>
                    </Box>

                    {/* Menu items */}
                    <Box sx={{ p: "8px" }}>
                      <MenuItem
                        onClick={() => {
                          handleLogoutMenuClose();
                          void router.push("/mypage");
                        }}
                        sx={{
                          minHeight: "42px",
                          px: "12px",
                          borderRadius: "12px",
                          fontFamily: "Assistant",
                          fontSize: "14px",
                          fontWeight: 700,
                          color: "#374151",
                          gap: "10px",
                          transition: "background 0.2s, color 0.2s",
                          "&:hover": {
                            background: "rgba(65, 0, 117, 0.07)",
                            color: "#410075",
                          },
                          "& .menu-icon": {
                            color: "#7c3aed",
                            fontSize: "20px",
                          },
                          "&:hover .menu-icon": { color: "#410075" },
                        }}
                      >
                        <PersonOutlineIcon className="menu-icon" />
                        {t("nav.myPage")}
                      </MenuItem>

                      <Divider
                        sx={{
                          borderColor: "rgba(65, 0, 117, 0.07)",
                          my: "6px",
                        }}
                      />

                      <MenuItem
                        onClick={() => {
                          handleLogoutMenuClose();
                          logOut();
                        }}
                        sx={{
                          minHeight: "42px",
                          px: "12px",
                          borderRadius: "12px",
                          fontFamily: "Assistant",
                          fontSize: "14px",
                          fontWeight: 700,
                          color: "#dc2626",
                          gap: "10px",
                          transition: "background 0.2s",
                          "&:hover": { background: "rgba(220, 38, 38, 0.06)" },
                        }}
                      >
                        <Logout sx={{ fontSize: "20px", color: "#dc2626" }} />
                        {t("auth.logout")}
                      </MenuItem>
                    </Box>
                  </Menu>
                </>
              ) : (
                <div className={"join-box"} onClick={handleLoginOpen}>
                  <AccountCircleOutlinedIcon />
                  <span>{t("auth.login")}</span>
                </div>
              )}
            </Box>
          </Stack>
        </Stack>

        <LoginRegister open={loginOpen} onClose={handleLoginClose} />
      </Stack>
    );
  }
};

export default Top;
