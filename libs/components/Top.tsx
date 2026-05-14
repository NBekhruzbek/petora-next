import { Logout } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Divider,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import React from "react";
import Basket from "./Basket";
import LoginRegister from "./account/LoginRegister";

const Top = () => {
  const authMember = true;
  const router = useRouter();
  const [colorChange, setColorChange] = useState<boolean>(false);
  const [bgColor, setBgColor] = useState<boolean>(false);
  const [logoutAnchor, setLogoutAnchor] = React.useState<null | HTMLElement>(
    null,
  );
  const logoutOpen = Boolean(logoutAnchor);

  const [loginOpen, setLoginOpen] = useState(false);

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
                Home
              </div>
            </Link>
            <Link href={"/service"}>
              <div
                className={`nav-item ${router.pathname === "/service" ? "active" : ""}`}
              >
                Service
              </div>
            </Link>
            <Link href={"/discovery"}>
              <div
                className={`nav-item ${router.pathname === "/discovery" ? "active" : ""}`}
              >
                Discovery
              </div>
            </Link>
            <Link href={"/shop"}>
              <div
                className={`nav-item ${router.pathname === "/shop" ? "active" : ""}`}
              >
                Shop
              </div>
            </Link>
            <Link href={"/community?articleCategory=FREE"}>
              <div
                className={`nav-item ${router.pathname === "/community" ? "active" : ""}`}
              >
                Community
              </div>
            </Link>
            {authMember && (
              <Link href={"/mypage"}>
                <div
                  className={`nav-item ${router.pathname === "/mypage" ? "active" : ""}`}
                >
                  My Page
                </div>
              </Link>
            )}
            <Link href={"/cs"}>
              <div
                className={`nav-item ${router.pathname === "/cs" ? "active" : ""}`}
              >
                CS
              </div>
            </Link>
            <Box>
              <Basket />
            </Box>
          </Box>

          <Box component={"div"} className="user-box">
            {authMember ? (
              <>
                <div
                  className="login-user"
                  onClick={handleLogoutMenuOpen}
                  aria-controls={logoutOpen ? "basic-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={logoutOpen ? "true" : undefined}
                >
                  <img src="/img/profile/defaultUser.png" alt="profile" />
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
                        src="/img/profile/defaultUser.png"
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
                          John Doe
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
                            Service Agent
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
                        "& .menu-icon": { color: "#7c3aed", fontSize: "20px" },
                        "&:hover .menu-icon": { color: "#410075" },
                      }}
                    >
                      <PersonOutlineIcon className="menu-icon" />
                      My Page
                    </MenuItem>

                    <MenuItem
                      onClick={() => {
                        handleLogoutMenuClose();
                        void router.push(
                          "/mypage?articleCategory=NOTIFICATIONS",
                        );
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
                        "& .menu-icon": { color: "#7c3aed", fontSize: "20px" },
                        "&:hover .menu-icon": { color: "#410075" },
                      }}
                    >
                      <NotificationsOutlinedIcon className="menu-icon" />
                      Notifications
                    </MenuItem>

                    <Divider
                      sx={{ borderColor: "rgba(65, 0, 117, 0.07)", my: "6px" }}
                    />

                    <MenuItem
                      onClick={() => {
                        handleLogoutMenuClose();
                        void router.push("/");
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
                      Logout
                    </MenuItem>
                  </Box>
                </Menu>
              </>
            ) : (
              <div className={"join-box"} onClick={handleLoginOpen}>
                <AccountCircleOutlinedIcon />
                <span>Login / Sign Up</span>
              </div>
            )}
          </Box>
        </Stack>
      </Stack>

      <LoginRegister open={loginOpen} onClose={handleLoginClose} />
    </Stack>
  );
};

export default Top;
