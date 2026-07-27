import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Button,
  Chip,
  Drawer,
  IconButton,
  Menu,
  Stack,
  Typography,
} from "@mui/material";
import Badge from "@mui/material/Badge";
import { useReactiveVar } from "@apollo/client";
import useDeviceDetect from "../hooks/useDeviceDetect";
import CancelIcon from "@mui/icons-material/Cancel";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { basketVar } from "@/apollo/store";
import {
  DELIVERY_FEE,
  FREE_DELIVERY_THRESHOLD,
  basketItemCount,
  basketSubtotal,
  clearBasket,
  decreaseBasketQuantity,
  formatPrice,
  hydrateBasket,
  increaseBasketQuantity,
  removeFromBasket,
} from "@/libs/basket";
import { REACT_APP_API_URL } from "@/libs/config";

const Basket = () => {
  const router = useRouter();
  const device = useDeviceDetect();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const items = useReactiveVar(basketVar);

  useEffect(() => {
    hydrateBasket();
  }, []);

  const totalItemCount = basketItemCount(items);
  const subtotal = basketSubtotal(items);
  const deliveryFee =
    items.length > 0 && subtotal < FREE_DELIVERY_THRESHOLD ? DELIVERY_FEE : 0;
  const total = subtotal + deliveryFee;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) =>
    setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const basketContent = (
    <Stack className="basket-frame">
      {/* Header */}
      <Stack
        className="basket-header"
        direction="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <Stack direction="row" alignItems="center" gap="10px">
          <Typography className="basket-title">Your Basket</Typography>
          <Chip
            label={`${totalItemCount} ${totalItemCount === 1 ? "item" : "items"}`}
            className="basket-count-chip"
            size="small"
          />
        </Stack>
        {items.length > 0 && (
          <Stack
            direction="row"
            alignItems="center"
            gap="6px"
            className="basket-clear-btn"
            onClick={clearBasket}
          >
            <DeleteOutlineIcon fontSize="small" />
            <span>Clear all</span>
          </Stack>
        )}
      </Stack>

      {/* Items list */}
      {items.length === 0 ? (
        <Stack className="basket-empty">
          <ShoppingBagOutlinedIcon className="basket-empty-icon" />
          <Typography className="basket-empty-title">
            Your basket is empty
          </Typography>
          <Typography className="basket-empty-sub">
            Add items from the shop to get started
          </Typography>
          <Button
            className="btn-continue-shopping"
            onClick={() => {
              handleClose();
              void router.push("/shop");
            }}
            endIcon={<ArrowForwardIcon />}
          >
            Continue Shopping
          </Button>
        </Stack>
      ) : (
        <Stack className="basket-items">
          {items.map((item) => (
            <Stack
              key={item.productId}
              className="basket-item"
              direction="row"
              gap="12px"
              alignItems="flex-start"
            >
              <Box className="basket-item-img-wrap">
                <img
                  src={`${REACT_APP_API_URL}/${item.image}`}
                  alt={item.name}
                  className="basket-item-img"
                />
              </Box>

              <Stack className="basket-item-info" flex={1}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="flex-start"
                >
                  <Typography className="basket-item-name">
                    {item.name}
                  </Typography>
                  <IconButton
                    className="basket-item-remove"
                    onClick={() => removeFromBasket(item.productId)}
                    size="small"
                  >
                    <CancelIcon fontSize="small" />
                  </IconButton>
                </Stack>

                {item.description ? (
                  <Typography className="basket-item-desc">
                    {item.description}
                  </Typography>
                ) : null}

                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography className="basket-item-price">
                    {formatPrice(item.price * item.quantity)}
                  </Typography>
                  <Stack
                    direction="row"
                    alignItems="center"
                    className="basket-qty-control"
                  >
                    <IconButton
                      className="basket-qty-btn"
                      onClick={() => decreaseBasketQuantity(item.productId)}
                      size="small"
                    >
                      <RemoveIcon fontSize="small" />
                    </IconButton>
                    <Typography className="basket-qty-value">
                      {item.quantity}
                    </Typography>
                    <IconButton
                      className="basket-qty-btn"
                      onClick={() => increaseBasketQuantity(item.productId)}
                      size="small"
                    >
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                </Stack>
              </Stack>
            </Stack>
          ))}
        </Stack>
      )}

      {/* Summary */}
      {items.length > 0 && (
        <Stack className="basket-summary">
          <Stack
            direction="row"
            justifyContent="space-between"
            className="basket-summary-row"
          >
            <Typography className="summary-label">Subtotal</Typography>
            <Typography className="summary-value">
              {formatPrice(subtotal)}
            </Typography>
          </Stack>
          <Stack
            direction="row"
            justifyContent="space-between"
            className="basket-summary-row"
          >
            <Typography className="summary-label">Delivery</Typography>
            {deliveryFee === 0 ? (
              <Typography className="summary-value free-delivery">
                Free
              </Typography>
            ) : (
              <Typography className="summary-value">
                {formatPrice(deliveryFee)}
              </Typography>
            )}
          </Stack>
          {deliveryFee > 0 && (
            <Typography className="free-delivery-hint">
              Add {formatPrice(FREE_DELIVERY_THRESHOLD - subtotal)} more for
              free delivery
            </Typography>
          )}
          <Box className="basket-summary-divider" />
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            className="basket-summary-total-row"
          >
            <Typography className="summary-total-label">Total</Typography>
            <Typography className="summary-total-value">
              {formatPrice(total)}
            </Typography>
          </Stack>

          <Button
            className="btn-checkout"
            startIcon={<ShoppingBagOutlinedIcon />}
            onClick={() => {
              handleClose();
              void router.push("/checkout");
            }}
          >
            Proceed to Order
          </Button>
        </Stack>
      )}
    </Stack>
  );

  return (
    <Box className="basket-trigger-wrap">
      <IconButton
        className="basket-icon-btn"
        onClick={handleClick}
        aria-label="cart"
      >
        <Badge badgeContent={totalItemCount} className="basket-badge">
          <img
            src="/img/icons/shopping-cart.png"
            className="basket-cart-img"
            alt="cart"
          />
        </Badge>
      </IconButton>

      {device === "mobile" ? (
        <Drawer
          anchor="bottom"
          open={open}
          onClose={handleClose}
          PaperProps={{ className: "basket-menu-paper basket-drawer-paper" }}
          sx={{ zIndex: 12000 }}
        >
          {basketContent}
        </Drawer>
      ) : (
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          className="basket-menu"
          disableScrollLock
          PaperProps={{ className: "basket-menu-paper", elevation: 0 }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          sx={{ zIndex: 12000 }}
        >
          {basketContent}
        </Menu>
      )}
    </Box>
  );
};

export default Basket;
