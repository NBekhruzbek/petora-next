import React, { useState } from "react";
import { useRouter } from "next/router";
import { Box, Button, Chip, Drawer, IconButton, Menu, Stack, Typography } from "@mui/material";
import Badge from "@mui/material/Badge";
import useDeviceDetect from "../hooks/useDeviceDetect";
import CancelIcon from "@mui/icons-material/Cancel";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

interface BasketItem {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  image: string;
}

const DELIVERY_FEE = 5;

const Basket = () => {
  const router = useRouter();
  const device = useDeviceDetect();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const [items, setItems] = useState<BasketItem[]>([
    {
      id: "prod-1",
      name: "Cat Fillet",
      description: "Cold treat for pets",
      price: 10,
      quantity: 1,
      image: "/img/products/fillet.png",
    },
    {
      id: "prod-2",
      name: "Bone Toy",
      description: "Chew toy for pets",
      price: 15,
      quantity: 2,
      image: "/img/products/bone-toy.png",
    },
    {
      id: "prod-3",
      name: "Royal Canin",
      description: "Premium dry food",
      price: 32,
      quantity: 1,
      image: "/img/products/royal-canin.png",
    },
  ]);

  const totalItemCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryFee = items.length > 0 && subtotal < 100 ? DELIVERY_FEE : 0;
  const total = subtotal + deliveryFee;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleClearAll = () => setItems([]);
  const removeItem = (id: string) => setItems((prev) => prev.filter((item) => item.id !== id));

  const increaseQuantity = (id: string) =>
    setItems((prev) => prev.map((item) => item.id === id ? { ...item, quantity: item.quantity + 1 } : item));

  const decreaseQuantity = (id: string) =>
    setItems((prev) =>
      prev.flatMap((item) => {
        if (item.id !== id) return item;
        return item.quantity === 1 ? [] : [{ ...item, quantity: item.quantity - 1 }];
      })
    );

  const basketContent = (
    <Stack className="basket-frame">

          {/* Header */}
          <Stack className="basket-header" direction="row" alignItems="center" justifyContent="space-between">
            <Stack direction="row" alignItems="center" gap="10px">
              <Typography className="basket-title">Your Basket</Typography>
              <Chip label={`${totalItemCount} ${totalItemCount === 1 ? "item" : "items"}`} className="basket-count-chip" size="small" />
            </Stack>
            {items.length > 0 && (
              <Stack direction="row" alignItems="center" gap="6px" className="basket-clear-btn" onClick={handleClearAll}>
                <DeleteOutlineIcon fontSize="small" />
                <span>Clear all</span>
              </Stack>
            )}
          </Stack>

          {/* Items list */}
          {items.length === 0 ? (
            <Stack className="basket-empty">
              <ShoppingBagOutlinedIcon className="basket-empty-icon" />
              <Typography className="basket-empty-title">Your basket is empty</Typography>
              <Typography className="basket-empty-sub">Add items from the shop to get started</Typography>
              <Button
                className="btn-continue-shopping"
                onClick={() => { handleClose(); void router.push("/shop"); }}
                endIcon={<ArrowForwardIcon />}
              >
                Continue Shopping
              </Button>
            </Stack>
          ) : (
            <Stack className="basket-items">
              {items.map((item) => (
                <Stack key={item.id} className="basket-item" direction="row" gap="12px" alignItems="flex-start">
                  <Box className="basket-item-img-wrap">
                    <img src={item.image} alt={item.name} className="basket-item-img" />
                  </Box>

                  <Stack className="basket-item-info" flex={1}>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                      <Typography className="basket-item-name">{item.name}</Typography>
                      <IconButton className="basket-item-remove" onClick={() => removeItem(item.id)} size="small">
                        <CancelIcon fontSize="small" />
                      </IconButton>
                    </Stack>

                    <Typography className="basket-item-desc">{item.description}</Typography>

                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography className="basket-item-price">
                        ${(item.price * item.quantity).toFixed(2)}
                      </Typography>
                      <Stack direction="row" alignItems="center" className="basket-qty-control">
                        <IconButton className="basket-qty-btn" onClick={() => decreaseQuantity(item.id)} size="small">
                          <RemoveIcon fontSize="small" />
                        </IconButton>
                        <Typography className="basket-qty-value">{item.quantity}</Typography>
                        <IconButton className="basket-qty-btn" onClick={() => increaseQuantity(item.id)} size="small">
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
              <Stack direction="row" justifyContent="space-between" className="basket-summary-row">
                <Typography className="summary-label">Subtotal</Typography>
                <Typography className="summary-value">${subtotal.toFixed(2)}</Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between" className="basket-summary-row">
                <Typography className="summary-label">Delivery</Typography>
                {deliveryFee === 0
                  ? <Typography className="summary-value free-delivery">Free</Typography>
                  : <Typography className="summary-value">${deliveryFee.toFixed(2)}</Typography>
                }
              </Stack>
              {deliveryFee > 0 && (
                <Typography className="free-delivery-hint">
                  Add ${(100 - subtotal).toFixed(2)} more for free delivery
                </Typography>
              )}
              <Box className="basket-summary-divider" />
              <Stack direction="row" justifyContent="space-between" alignItems="center" className="basket-summary-total-row">
                <Typography className="summary-total-label">Total</Typography>
                <Typography className="summary-total-value">${total.toFixed(2)}</Typography>
              </Stack>

              <Button
                className="btn-checkout"
                startIcon={<ShoppingBagOutlinedIcon />}
                onClick={() => { handleClose(); void router.push("/checkout"); }}
              >
                Proceed to Order
              </Button>
            </Stack>
          )}
        </Stack>
  );

  return (
    <Box className="basket-trigger-wrap">
      <IconButton className="basket-icon-btn" onClick={handleClick} aria-label="cart">
        <Badge badgeContent={totalItemCount} className="basket-badge">
          <img src="/img/icons/shopping-cart.png" className="basket-cart-img" alt="cart" />
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
