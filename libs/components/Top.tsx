import { Logout } from "@mui/icons-material";
import { Box, Menu, MenuItem, Stack } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import React from "react";
import Basket from "./Basket";
import LoginRegister from "./account/LoginRegister";

const Top = () => {
  const authMember = false;
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
                  className={"login-user"}
                  onClick={handleLogoutMenuOpen}
                  aria-controls={logoutOpen ? "basic-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={logoutOpen ? "true" : undefined}
                >
                  <img
                    src={
                      authMember
                        ? `/img/profile/defaultUser.png`
                        : "/img/profile/defaultUser.png"
                    }
                    alt=""
                  />
                </div>

                <Menu
                  id="basic-menu"
                  anchorEl={logoutAnchor}
                  open={logoutOpen}
                  onClose={handleLogoutMenuClose}
                  disableScrollLock
                  sx={{ mt: "5px", zIndex: 12000 }}
                  PaperProps={{
                    sx: {
                      border: "1px solid rgba(65, 0, 117, 0.14)",
                      borderRadius: "18px",
                      boxShadow: "0 18px 40px rgba(65, 0, 117, 0.14)",
                      overflow: "hidden",
                    },
                  }}
                  MenuListProps={{
                    sx: {
                      p: 1,
                      background:
                        "linear-gradient(180deg, #fffdfd 0%, #f7efff 100%)",
                    },
                  }}
                >
                  <MenuItem
                    onClick={handleLogoutMenuClose}
                    sx={{
                      minHeight: "44px",
                      px: "14px",
                      borderRadius: "12px",
                      fontSize: "14px",
                      fontWeight: 700,
                      lineHeight: 1.2,
                      color: "#4a2a64",
                      transition:
                        "background-color 0.2s ease, color 0.2s ease, transform 0.2s ease",
                      "&:hover": {
                        backgroundColor: "rgba(65, 0, 117, 0.08)",
                        color: "#410075",
                        transform: "translateX(2px)",
                      },
                      "&:hover .MuiSvgIcon-root": {
                        color: "#410075",
                      },
                    }}
                  >
                    <Logout
                      fontSize="small"
                      sx={{
                        mr: "10px",
                        color: "#8a4dc1",
                        transition: "color 0.2s ease",
                      }}
                    />
                    Logout
                  </MenuItem>
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
