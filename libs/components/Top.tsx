import { Logout } from "@mui/icons-material";
import { Box, Menu, MenuItem, Stack, Typography } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import React from "react";
import Basket from "./Basket";

const Top = () => {
  const authMember = false;
  const router = useRouter();
  const [colorChange, setColorChange] = useState<boolean>(false);
  const [bgColor, setBgColor] = useState<boolean>(false);
  const [logoutAnchor, setLogoutAnchor] = React.useState<null | HTMLElement>(
    null,
  );
  const logoutOpen = Boolean(logoutAnchor);

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
              <div>Home</div>
            </Link>
            <Link href={"/service"}>
              <div>Service</div>
            </Link>
            <Link href={"/discovery"}>
              <div>Discovery</div>
            </Link>
            <Link href={"/shop"}>
              <div>Shop</div>
            </Link>
            <Link href={"/agents"}>
              <div>Agents List</div>
            </Link>
            <Link href={"/community?articleCategory=FREE"}>
              <div>Community</div>
            </Link>
            {authMember && (
              <Link href={"/mypage"}>
                <div>My Page</div>
              </Link>
            )}
            <Link href={"/cs"}>
              <div>CS</div>
            </Link>
            <Box>
              <Basket />
            </Box>
          </Box>

          <Box component={"div"} className="user-box">
            {authMember ? (
              <>
                <div className={"login-user"}>
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
                  onClose={() => {
                    setLogoutAnchor(null);
                  }}
                  sx={{ mt: "5px" }}
                >
                  <MenuItem>
                    <Logout
                      fontSize="small"
                      style={{ color: "blue", marginRight: "10px" }}
                    />
                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Link href={"/account/join"}>
                <div className={"join-box"}>
                  <AccountCircleOutlinedIcon />
                  <span>Login / Sign Up</span>
                </div>
              </Link>
            )}
          </Box>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Top;
