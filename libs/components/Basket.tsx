import React from "react";
import { Box, Button, Stack } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Menu from "@mui/material/Menu";
import CancelIcon from "@mui/icons-material/Cancel";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

const Basket = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  /** HANDLERS **/
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(e.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box
      className={"hover-line"}
      sx={{
        width: "40px",
        height: "40px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "999px",
        background: "transparent",
        border: "none",
        boxShadow: "none",
        backdropFilter: "none",
        transition:
          "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
        "&:hover": {
          transform: "translateY(-1px)",
          boxShadow: "none",
          borderColor: "transparent",
        },
      }}
    >
      <IconButton
        aria-label="cart"
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        sx={{
          width: "100%",
          height: "100%",
          color: "#410075",
        }}
      >
        <Badge
          badgeContent={3}
          sx={{
            "& .MuiBadge-badge": {
              minWidth: "20px",
              height: "20px",
              padding: "0 5px",
              borderRadius: "999px",
              top: 0,
              right: -1,
              background: "linear-gradient(135deg, #ff6bff, #fa3ff4)",
              color: "#fff",
              fontSize: "12px",
              fontWeight: 700,

              animation: "pulseGlow 1.8s infinite ease-in-out",
            },

            "@keyframes pulseGlow": {
              "0%": {
                boxShadow: "0 0 5px rgba(250, 63, 244, 0.6)",
              },
              "50%": {
                boxShadow: `
        0 0 10px rgba(250, 63, 244, 0.9),
        0 0 20px rgba(250, 63, 244, 0.7),
        0 0 30px rgba(250, 63, 244, 0.5)
      `,
              },
              "100%": {
                boxShadow: "0 0 5px rgba(250, 63, 244, 0.6)",
              },
            },
          }}
        >
          <img
            src={"/img/icons/shopping-cart.png"}
            className="shopping-cart"
            style={{ width: "24px", filter: "brightness(0) saturate(100%)" }}
          />
        </Badge>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        disableScrollLock
        sx={{ zIndex: 12000 }}
        PaperProps={{
          elevation: 0,
          sx: {
            width: 380,
            maxWidth: "calc(100vw - 24px)",
            overflow: "visible",
            mt: 1.75,
            borderRadius: "28px",
            border: "1px solid rgba(111, 0, 198, 0.12)",
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(247,239,255,0.98) 100%)",
            boxShadow: "0 28px 60px rgba(41, 12, 72, 0.22)",
            backdropFilter: "blur(18px)",
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: -8,
              right: 22,
              width: 18,
              height: 18,
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(247,239,255,0.98) 100%)",
              borderTop: "1px solid rgba(111, 0, 198, 0.12)",
              borderLeft: "1px solid rgba(111, 0, 198, 0.12)",
              transform: "rotate(45deg)",
              borderTopLeftRadius: "6px",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Stack
          className={"basket-frame"}
          sx={{
            p: "18px",
            gap: "16px",
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{
              pb: "4px",
            }}
          >
            <Box
              sx={{
                fontSize: "18px",
                fontWeight: 800,
                color: "#2c1243",
                letterSpacing: "-0.02em",
              }}
            >
              Your Basket
            </Box>
            <Box
              sx={{
                px: "10px",
                py: "6px",
                borderRadius: "999px",
                fontSize: "12px",
                fontWeight: 700,
                color: "#6f00c6",
                background: "rgba(111, 0, 198, 0.08)",
              }}
            >
              1 item
            </Box>
          </Stack>

          <Box
            className={"all-check-box"}
            sx={{
              px: "14px",
              py: "12px",
              borderRadius: "18px",
              border: "1px solid rgba(111, 0, 198, 0.1)",
              background:
                "linear-gradient(135deg, rgba(111, 0, 198, 0.05) 0%, rgba(255,255,255,0.88) 100%)",
              fontSize: "13px",
              fontWeight: 600,
              color: "#6a5878",
            }}
          >
            Ready to checkout? Review your items before placing the order.
          </Box>

          <Box
            className={"orders-main-wrapper"}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <Box
              className={"orders-wrapper"}
              sx={{
                p: "14px",
                borderRadius: "22px",
                background: "#fff",
                border: "1px solid rgba(111, 0, 198, 0.08)",
                boxShadow: "0 16px 32px rgba(65, 0, 117, 0.08)",
              }}
            >
              <Stack
                className={"basket-info-box"}
                direction="row"
                alignItems="center"
                spacing={1.5}
              >
                <Box
                  sx={{
                    width: "82px",
                    height: "82px",
                    borderRadius: "20px",
                    overflow: "hidden",
                    flexShrink: 0,
                    background:
                      "linear-gradient(135deg, rgba(111, 0, 198, 0.08) 0%, rgba(255, 191, 115, 0.14) 100%)",
                  }}
                >
                  <img
                    src={"/img/products/fillet.png"}
                    className={"product-img"}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Box>

                <Stack sx={{ minWidth: 0, flex: 1, gap: "6px" }}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="flex-start"
                  >
                    <Box
                      sx={{
                        fontSize: "16px",
                        fontWeight: 800,
                        color: "#291243",
                        lineHeight: 1.2,
                      }}
                    >
                      Cat Fillet
                    </Box>
                    <Box
                      className={"cancel-btn"}
                      sx={{
                        width: "32px",
                        height: "32px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "999px",
                        color: "#8c68af",
                        background: "rgba(111, 0, 198, 0.06)",
                        cursor: "pointer",
                        transition:
                          "background-color 0.2s ease, color 0.2s ease, transform 0.2s ease",
                        "&:hover": {
                          background: "rgba(200, 0, 6, 0.08)",
                          color: "#c80006",
                          transform: "scale(1.04)",
                        },
                      }}
                    >
                      <CancelIcon fontSize="small" />
                    </Box>
                  </Stack>

                  <Box
                    sx={{
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "#7d6a8d",
                    }}
                  >
                    Cold treat for pets
                  </Box>

                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Box
                      className={"product-price"}
                      sx={{
                        fontSize: "15px",
                        fontWeight: 800,
                        color: "#410075",
                      }}
                    >
                      $10 x 1
                    </Box>

                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={1}
                      sx={{
                        px: "8px",
                        py: "6px",
                        borderRadius: "999px",
                        background: "rgba(111, 0, 198, 0.06)",
                        border: "1px solid rgba(111, 0, 198, 0.08)",
                      }}
                    >
                      <Box
                        component="button"
                        type="button"
                        sx={{
                          width: "28px",
                          height: "28px",
                          border: "none",
                          borderRadius: "999px",
                          background: "#fff",
                          color: "#6f00c6",
                          fontSize: "18px",
                          fontWeight: 700,
                          cursor: "pointer",
                          boxShadow: "0 6px 14px rgba(65, 0, 117, 0.08)",
                        }}
                      >
                        -
                      </Box>
                      <Box
                        sx={{
                          minWidth: "18px",
                          textAlign: "center",
                          fontSize: "14px",
                          fontWeight: 700,
                          color: "#32164d",
                        }}
                      >
                        1
                      </Box>
                      <Box
                        component="button"
                        type="button"
                        sx={{
                          width: "28px",
                          height: "28px",
                          border: "none",
                          borderRadius: "999px",
                          background: "#6f00c6",
                          color: "#fff",
                          fontSize: "18px",
                          fontWeight: 700,
                          cursor: "pointer",
                          boxShadow: "0 10px 18px rgba(111, 0, 198, 0.28)",
                        }}
                      >
                        +
                      </Box>
                    </Stack>
                  </Stack>
                </Stack>
              </Stack>
            </Box>
          </Box>

          <Stack
            className={"basket-order"}
            sx={{
              p: "16px",
              borderRadius: "22px",
              background: "rgba(255, 255, 255, 0.84)",
              border: "1px solid rgba(111, 0, 198, 0.08)",
              gap: "12px",
            }}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box
                sx={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#7c6890",
                }}
              >
                Total
              </Box>
              <Box
                className={"price"}
                sx={{
                  fontSize: "18px",
                  fontWeight: 800,
                  color: "#2c1243",
                }}
              >
                $100
              </Box>
            </Stack>
            <Box
              sx={{
                fontSize: "12px",
                color: "#8a7897",
                mt: "-6px",
              }}
            >
              Includes $98 items + $2 service fee
            </Box>
            <Button
              startIcon={<ShoppingCartIcon />}
              variant={"contained"}
              sx={{
                minHeight: "46px",
                borderRadius: "16px",
                textTransform: "none",
                fontSize: "15px",
                fontWeight: 800,
                background: "linear-gradient(135deg, #6f00c6 0%, #410075 100%)",
                boxShadow: "0 16px 26px rgba(65, 0, 117, 0.28)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #7d18d1 0%, #4f0b8c 100%)",
                  boxShadow: "0 20px 30px rgba(65, 0, 117, 0.34)",
                },
              }}
            >
              Proceed to Order
            </Button>
          </Stack>
        </Stack>
      </Menu>
    </Box>
  );
};

export default Basket;
