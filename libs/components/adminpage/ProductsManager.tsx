import { useState, useMemo, useRef, useCallback, ChangeEvent } from "react";
import {
  Stack,
  Typography,
  TextField,
  Select,
  MenuItem,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Drawer,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import InventoryIcon from "@mui/icons-material/Inventory";
import {
  mockProducts,
  AdminProduct,
  ProductStatus,
} from "../../data/adminMockData";

const STATUS_OPTIONS: ProductStatus[] = ["active", "paused"];
const CATEGORIES = [
  "Foods",
  "Accessories",
  "Toys",
  "Health",
  "Clothes",
  "Others",
];
const PET_TYPES = ["Dogs", "Cats", "All"];

const inputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
    fontSize: "14px",
    color: "#111827",
    background: "#fff",
    "& fieldset": { borderColor: "#E5E7EB" },
    "&:hover fieldset": { borderColor: "#C7D2FE" },
    "&.Mui-focused fieldset": {
      borderColor: "#6366F1",
      borderWidth: "1.5px",
      boxShadow: "0 0 0 3px rgba(99,102,241,0.08)",
    },
  },
  "& .MuiInputLabel-root": { fontSize: "13px", color: "#9CA3AF" },
  "& .MuiInputLabel-root.Mui-focused": { color: "#6366F1" },
  "& .MuiInputBase-input": { color: "#111827" },
};
const selectSx = {
  borderRadius: "10px",
  fontSize: "14px",
  color: "#111827",
  background: "#fff",
  "& fieldset": { borderColor: "#E5E7EB" },
  "&:hover fieldset": { borderColor: "#C7D2FE" },
  "&.Mui-focused fieldset": { borderColor: "#6366F1", borderWidth: "1.5px" },
  "& .MuiSelect-icon": { color: "#9CA3AF" },
};

interface FormShape {
  name: string;
  category: string;
  petType: string;
  price: number;
  discountPercent: number;
  stock: number;
  status: ProductStatus;
  description: string;
  benefitsInput: string;
}

const emptyForm: FormShape = {
  name: "",
  category: "Foods",
  petType: "All",
  price: 0,
  discountPercent: 0,
  stock: 0,
  status: "active",
  description: "",
  benefitsInput: "",
};

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <Stack
    sx={{
      background: "#fff",
      border: "1px solid #F3F4F6",
      borderRadius: "14px",
      overflow: "hidden",
    }}
  >
    <Stack sx={{ px: 2.5, py: 1.5, borderBottom: "1px solid #F3F4F6" }}>
      <Typography
        sx={{
          fontSize: "11px",
          fontWeight: 700,
          color: "#9CA3AF",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
        }}
      >
        {title}
      </Typography>
    </Stack>
    <Stack sx={{ p: 2.5, gap: 2 }}>{children}</Stack>
  </Stack>
);

const ProductsManager = () => {
  const [products, setProducts] = useState<AdminProduct[]>(mockProducts);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("ALL");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(
    null,
  );
  const [form, setForm] = useState<FormShape>(emptyForm);
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const allPreviewUrls = [...existingImageUrls, ...newImagePreviews];
  const canUploadMore = allPreviewUrls.length < 5;
  const afterDiscount =
    form.discountPercent > 0
      ? Math.round(form.price * (1 - form.discountPercent / 100))
      : form.price;
  const savings = form.price - afterDiscount;
  const isSaveEnabled = form.name.trim() && allPreviewUrls.length >= 1;

  const filtered = useMemo(
    () =>
      products.filter((p) => {
        if (filterCat !== "ALL" && p.category !== filterCat) return false;
        const q = search.toLowerCase();
        return !q || p.name.toLowerCase().includes(q);
      }),
    [products, search, filterCat],
  );

  const handleChange = (field: keyof FormShape, value: string | number) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const addFiles = useCallback(
    (files: File[]) => {
      const remaining = 5 - existingImageUrls.length - newImageFiles.length;
      const toAdd = files
        .filter((f) => f.type.startsWith("image/"))
        .slice(0, remaining);
      if (!toAdd.length) return;
      const previews = toAdd.map((f) => URL.createObjectURL(f));
      setNewImageFiles((prev) => [...prev, ...toAdd]);
      setNewImagePreviews((prev) => [...prev, ...previews]);
    },
    [existingImageUrls.length, newImageFiles.length],
  );

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    addFiles(Array.from(e.target.files ?? []));
    e.target.value = "";
  };

  const removeExisting = (idx: number) =>
    setExistingImageUrls((prev) => prev.filter((_, i) => i !== idx));

  const removeNew = (idx: number) => {
    URL.revokeObjectURL(newImagePreviews[idx]);
    setNewImageFiles((prev) => prev.filter((_, i) => i !== idx));
    setNewImagePreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const openAdd = () => {
    setEditingProduct(null);
    setForm(emptyForm);
    setExistingImageUrls([]);
    setNewImageFiles([]);
    setNewImagePreviews([]);
    setDrawerOpen(true);
  };

  const openEdit = (product: AdminProduct) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      category: product.category,
      petType: product.petType,
      price: product.price,
      discountPercent:
        product.price > 0 && product.price !== product.discountedPrice
          ? Math.round(
              ((product.price - product.discountedPrice) / product.price) * 100,
            )
          : 0,
      stock: product.stock,
      status: product.status,
      description: product.description,
      benefitsInput: product.benefits.join(", "),
    });
    setExistingImageUrls([...product.images]);
    setNewImageFiles([]);
    setNewImagePreviews([]);
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    newImagePreviews.forEach((url) => URL.revokeObjectURL(url));
    setDrawerOpen(false);
  };

  const save = () => {
    const images = [...existingImageUrls, ...newImagePreviews];
    const benefits = form.benefitsInput
      .split(",")
      .map((b) => b.trim())
      .filter(Boolean);
    const discountedPrice =
      form.discountPercent > 0
        ? Math.round(form.price * (1 - form.discountPercent / 100))
        : form.price;
    if (editingProduct) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingProduct.id
            ? {
                ...p,
                name: form.name,
                category: form.category,
                petType: form.petType,
                price: form.price,
                discountedPrice,
                stock: form.stock,
                status: form.status,
                description: form.description,
                benefits,
                images,
              }
            : p,
        ),
      );
    } else {
      setProducts((prev) => [
        {
          id: `p${Date.now()}`,
          name: form.name,
          category: form.category,
          petType: form.petType,
          price: form.price,
          discountedPrice,
          stock: form.stock,
          status: form.status,
          description: form.description,
          benefits,
          images,
          sold: 0,
          createdAt: "May 15, 2026",
        },
        ...prev,
      ]);
    }
    closeDrawer();
  };

  return (
    <Stack gap={0}>
      <Stack className="admin-page-header">
        <Typography className="admin-page-title">Products</Typography>
        <Button
          variant="contained"
          onClick={openAdd}
          sx={{
            color: "#ffffff",
            backgroundColor: "#6366F1",
            textTransform: "none",
            fontWeight: 700,
            fontSize: "13px",
            borderRadius: "9px",
            height: "36px",
            boxShadow: "none",
            "&:hover": { backgroundColor: "#5254CC", boxShadow: "none" },
          }}
        >
          Add New Product
        </Button>
      </Stack>

      <Stack className="admin-card">
        <Stack className="admin-toolbar">
          <TextField
            size="small"
            placeholder="Search products…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="admin-toolbar-search"
            sx={{ width: 240 }}
          />
          <Select
            size="small"
            value={filterCat}
            onChange={(e) => setFilterCat(e.target.value)}
            className="admin-toolbar-select"
            sx={{ width: 150 }}
          >
            <MenuItem value="ALL">All Categories</MenuItem>
            {CATEGORIES.map((c) => (
              <MenuItem key={c} value={c}>
                {c}
              </MenuItem>
            ))}
          </Select>
          <Typography className="admin-meta-count">
            {filtered.length} products
          </Typography>
        </Stack>

        <TableContainer>
          <Table className="admin-table">
            <TableHead>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Pet</TableCell>
                <TableCell>Price / Discount</TableCell>
                <TableCell>Stock</TableCell>
                <TableCell>Sold</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((product) => (
                <TableRow key={product.id}>
                  <TableCell sx={{ minWidth: 220 }}>
                    <Stack className="admin-name-cell">
                      <Stack
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: "8px",
                          background: "#F3F4F6",
                          flexShrink: 0,
                          overflow: "hidden",
                          border: "1px solid #E8ECF0",
                        }}
                      >
                        {product.images[0] && (
                          <img
                            src={product.images[0]}
                            alt=""
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              display: "block",
                            }}
                            onError={(e) => {
                              const img = e.target as HTMLImageElement;
                              img.src =
                                "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";
                              img.style.opacity = "0";
                            }}
                          />
                        )}
                      </Stack>
                      <Typography
                        sx={{
                          fontSize: "13px",
                          fontWeight: 600,
                          minWidth: 0,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {product.name}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell sx={{ fontSize: "12px" }}>
                    {product.category}
                  </TableCell>
                  <TableCell sx={{ fontSize: "12px" }}>
                    {product.petType}
                  </TableCell>
                  <TableCell>
                    <Stack gap={0.4}>
                      {product.price !== product.discountedPrice ? (
                        <>
                          <Typography
                            sx={{
                              fontSize: "11px",
                              color: "#9CA3AF",
                              textDecoration: "line-through",
                              lineHeight: 1.2,
                            }}
                          >
                            ₩{product.price.toLocaleString()}
                          </Typography>
                          <Stack direction="row" alignItems="center" gap={0.8}>
                            <Typography
                              sx={{
                                fontSize: "13px",
                                fontWeight: 700,
                                color: "#6366F1",
                                lineHeight: 1.2,
                              }}
                            >
                              ₩{product.discountedPrice.toLocaleString()}
                            </Typography>
                            <span
                              style={{
                                fontSize: "10px",
                                fontWeight: 700,
                                color: "#EF4444",
                                background: "#FEF2F2",
                                borderRadius: "4px",
                                padding: "1px 5px",
                              }}
                            >
                              -
                              {Math.round(
                                ((product.price - product.discountedPrice) /
                                  product.price) *
                                  100,
                              )}
                              %
                            </span>
                          </Stack>
                        </>
                      ) : (
                        <Typography
                          sx={{
                            fontSize: "13px",
                            fontWeight: 700,
                            color: "#111827",
                          }}
                        >
                          ₩{product.price.toLocaleString()}
                        </Typography>
                      )}
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Typography
                      sx={{
                        fontSize: "12px",
                        fontWeight: 600,
                        color: product.stock === 0 ? "#EF4444" : "#374151",
                      }}
                    >
                      {product.stock === 0 ? "Out" : product.stock}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ fontSize: "12px", color: "#6B7280" }}>
                    {product.sold}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={product.status}
                      onChange={(e) =>
                        setProducts((prev) =>
                          prev.map((p) =>
                            p.id === product.id
                              ? {
                                  ...p,
                                  status: e.target.value as ProductStatus,
                                }
                              : p,
                          ),
                        )
                      }
                      size="small"
                      renderValue={(val) => (
                        <span className={`status-chip status-${val}`}>
                          {val}
                        </span>
                      )}
                      className="admin-status-select"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <MenuItem key={s} value={s}>
                          <span className={`status-chip status-${s}`}>{s}</span>
                        </MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Stack className="admin-action-row">
                      <Button
                        size="small"
                        onClick={() => openEdit(product)}
                        className="admin-btn-edit"
                      >
                        Edit
                      </Button>
                      <Button
                        size="small"
                        onClick={() => setDeleteId(product.id)}
                        className="admin-btn-delete"
                      >
                        Delete
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>

      {/* ── Drawer ───────────────────────────────────────────────── */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={closeDrawer}
        PaperProps={{
          sx: {
            width: 560,
            boxShadow: "-8px 0 32px rgba(0,0,0,0.10)",
            background: "#F4F5FA",
            overflowY: "auto",
          },
        }}
      >
        {/* Sticky Header */}
        <Stack
          direction="row"
          alignItems="center"
          gap={2}
          sx={{
            px: 3,
            py: 2.5,
            background: "#fff",
            borderBottom: "1px solid #E8ECF0",
            position: "sticky",
            top: 0,
            zIndex: 10,
          }}
        >
          <Stack
            alignItems="center"
            justifyContent="center"
            sx={{
              width: 40,
              height: 40,
              borderRadius: "12px",
              background: "#EEF2FF",
              flexShrink: 0,
            }}
          >
            <InventoryIcon sx={{ fontSize: 20, color: "#6366F1" }} />
          </Stack>
          <Stack flex={1} minWidth={0}>
            <Typography
              sx={{
                fontSize: "16px",
                fontWeight: 700,
                color: "#111827",
                lineHeight: 1.2,
              }}
            >
              {editingProduct ? "Edit Product" : "Add New Product"}
            </Typography>
            <Typography sx={{ fontSize: "12px", color: "#9CA3AF", mt: 0.3 }}>
              {editingProduct
                ? editingProduct.name
                : "Fill in the details below"}
            </Typography>
          </Stack>
          <IconButton
            onClick={closeDrawer}
            size="small"
            sx={{
              color: "#6B7280",
              "&:hover": { background: "#F3F4F6", color: "#111827" },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>

        {/* Scrollable Sections */}
        <Stack sx={{ p: 2.5, gap: 2, pb: 14 }}>
          {/* Basic Info */}
          <Section title="Basic Info">
            <Stack>
              <Typography
                sx={{
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "#9CA3AF",
                  mb: 0.8,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Product Name
              </Typography>
              <TextField
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                size="small"
                fullWidth
                sx={{
                  ...inputSx,
                  "& .MuiOutlinedInput-root": {
                    ...inputSx["& .MuiOutlinedInput-root"],
                    height: 42,
                  },
                }}
              />
            </Stack>
            <Stack direction="row" gap={1.5}>
              <Stack flex={1}>
                <Typography
                  sx={{
                    fontSize: "11px",
                    fontWeight: 600,
                    color: "#9CA3AF",
                    mb: 0.8,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Category
                </Typography>
                <Select
                  size="small"
                  value={form.category}
                  onChange={(e) => handleChange("category", e.target.value)}
                  sx={{ ...selectSx, height: 42 }}
                >
                  {CATEGORIES.map((c) => (
                    <MenuItem key={c} value={c}>
                      {c}
                    </MenuItem>
                  ))}
                </Select>
              </Stack>
              <Stack flex={1}>
                <Typography
                  sx={{
                    fontSize: "11px",
                    fontWeight: 600,
                    color: "#9CA3AF",
                    mb: 0.8,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Pet Type
                </Typography>
                <Select
                  size="small"
                  value={form.petType}
                  onChange={(e) => handleChange("petType", e.target.value)}
                  sx={{ ...selectSx, height: 42 }}
                >
                  {PET_TYPES.map((t) => (
                    <MenuItem key={t} value={t}>
                      {t}
                    </MenuItem>
                  ))}
                </Select>
              </Stack>
            </Stack>
          </Section>

          {/* Pricing */}
          <Section title="Pricing & Stock">
            <Stack direction="row" gap={1.5}>
              <Stack flex={1}>
                <Typography
                  sx={{
                    fontSize: "11px",
                    fontWeight: 600,
                    color: "#9CA3AF",
                    mb: 0.8,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Original Price
                </Typography>
                <TextField
                  type="number"
                  value={form.price === 0 ? "" : form.price}
                  placeholder="0"
                  onChange={(e) =>
                    handleChange(
                      "price",
                      e.target.value === "" ? 0 : Number(e.target.value),
                    )
                  }
                  size="small"
                  fullWidth
                  sx={{
                    ...inputSx,
                    "& .MuiOutlinedInput-root": {
                      ...inputSx["& .MuiOutlinedInput-root"],
                      height: 42,
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Typography sx={{ fontSize: "13px", color: "#9CA3AF" }}>
                          ₩
                        </Typography>
                      </InputAdornment>
                    ),
                  }}
                />
              </Stack>
              <Stack flex={1}>
                <Typography
                  sx={{
                    fontSize: "11px",
                    fontWeight: 600,
                    color: "#9CA3AF",
                    mb: 0.8,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Discount
                </Typography>
                <TextField
                  type="number"
                  value={form.discountPercent === 0 ? "" : form.discountPercent}
                  placeholder="0"
                  onChange={(e) =>
                    handleChange(
                      "discountPercent",
                      e.target.value === ""
                        ? 0
                        : Math.min(100, Math.max(0, Number(e.target.value))),
                    )
                  }
                  size="small"
                  fullWidth
                  inputProps={{ min: 0, max: 100 }}
                  sx={{
                    ...inputSx,
                    "& .MuiOutlinedInput-root": {
                      ...inputSx["& .MuiOutlinedInput-root"],
                      height: 42,
                    },
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Typography sx={{ fontSize: "13px", color: "#9CA3AF" }}>
                          %
                        </Typography>
                      </InputAdornment>
                    ),
                  }}
                />
              </Stack>
            </Stack>

            {/* Price breakdown */}
            <Stack
              sx={{
                borderRadius: "12px",
                border: "1px solid",
                borderColor: form.discountPercent > 0 ? "#C7D2FE" : "#E8ECF0",
                background:
                  form.discountPercent > 0
                    ? "linear-gradient(135deg,#EEF2FF,#F5F3FF)"
                    : "#F9FAFB",
                p: 2,
              }}
            >
              {form.discountPercent > 0 ? (
                <Stack direction="row" alignItems="center">
                  <Stack alignItems="center" flex={1}>
                    <Typography
                      sx={{
                        fontSize: "11px",
                        color: "#9CA3AF",
                        fontWeight: 600,
                        mb: 0.5,
                      }}
                    >
                      Original
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "15px",
                        fontWeight: 700,
                        color: "#9CA3AF",
                        textDecoration: "line-through",
                      }}
                    >
                      ₩{form.price.toLocaleString()}
                    </Typography>
                  </Stack>
                  <Stack alignItems="center" sx={{ px: 1 }}>
                    <Stack
                      sx={{
                        background: "#EF4444",
                        borderRadius: "20px",
                        px: 1.5,
                        py: 0.5,
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "12px",
                          fontWeight: 800,
                          color: "#fff",
                        }}
                      >
                        -{form.discountPercent}%
                      </Typography>
                    </Stack>
                    <Typography
                      sx={{ fontSize: "16px", color: "#C7D2FE", mt: 0.3 }}
                    >
                      →
                    </Typography>
                  </Stack>
                  <Stack alignItems="center" flex={1}>
                    <Typography
                      sx={{
                        fontSize: "11px",
                        color: "#6366F1",
                        fontWeight: 600,
                        mb: 0.5,
                      }}
                    >
                      Final Price
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "20px",
                        fontWeight: 800,
                        color: "#6366F1",
                      }}
                    >
                      ₩{afterDiscount.toLocaleString()}
                    </Typography>
                  </Stack>
                  <Stack
                    sx={{
                      width: "1px",
                      height: 40,
                      background: "#C7D2FE",
                      mx: 1,
                    }}
                  />
                  <Stack alignItems="center" flex={1}>
                    <Typography
                      sx={{
                        fontSize: "11px",
                        color: "#059669",
                        fontWeight: 600,
                        mb: 0.5,
                      }}
                    >
                      Customer Saves
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "15px",
                        fontWeight: 700,
                        color: "#059669",
                      }}
                    >
                      ₩{savings.toLocaleString()}
                    </Typography>
                  </Stack>
                </Stack>
              ) : (
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography sx={{ fontSize: "13px", color: "#9CA3AF" }}>
                    No discount applied
                  </Typography>
                  <Typography
                    sx={{ fontSize: "16px", fontWeight: 700, color: "#111827" }}
                  >
                    ₩{form.price.toLocaleString()}
                  </Typography>
                </Stack>
              )}
            </Stack>

            <Stack direction="row" gap={1.5}>
              <Stack flex={1}>
                <Typography
                  sx={{
                    fontSize: "11px",
                    fontWeight: 600,
                    color: "#9CA3AF",
                    mb: 0.8,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Stock
                </Typography>
                <TextField
                  type="number"
                  value={form.stock === 0 ? "" : form.stock}
                  placeholder="0"
                  onChange={(e) =>
                    handleChange(
                      "stock",
                      e.target.value === "" ? 0 : Number(e.target.value),
                    )
                  }
                  size="small"
                  fullWidth
                  sx={{
                    ...inputSx,
                    "& .MuiOutlinedInput-root": {
                      ...inputSx["& .MuiOutlinedInput-root"],
                      height: 42,
                    },
                  }}
                />
              </Stack>
              <Stack flex={1}>
                <Typography
                  sx={{
                    fontSize: "11px",
                    fontWeight: 600,
                    color: "#9CA3AF",
                    mb: 0.8,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Status
                </Typography>
                <Select
                  size="small"
                  value={form.status}
                  onChange={(e) =>
                    handleChange("status", e.target.value as ProductStatus)
                  }
                  sx={{ ...selectSx, height: 42 }}
                >
                  {STATUS_OPTIONS.map((s) => (
                    <MenuItem key={s} value={s}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
              </Stack>
            </Stack>
          </Section>

          {/* Details */}
          <Section title="Product Details">
            <TextField
              label="Description"
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              size="small"
              multiline
              rows={3}
              fullWidth
              inputProps={{ style: { color: "#111827" } }}
              InputProps={{
                style: {
                  height: "auto",
                  minHeight: "90px",
                  alignItems: "flex-start",
                },
              }}
              sx={{
                ...inputSx,
                "& .MuiOutlinedInput-root": {
                  ...inputSx["& .MuiOutlinedInput-root"],
                  height: "auto !important",
                },
              }}
            />
            <TextField
              label="Benefits"
              value={form.benefitsInput}
              onChange={(e) => handleChange("benefitsInput", e.target.value)}
              size="small"
              fullWidth
              sx={inputSx}
              placeholder="e.g. High protein, Shiny coat"
            />
          </Section>

          {/* Images */}
          <Section title={`Images (${allPreviewUrls.length}/5)`}>
            {/* Previews FIRST */}
            {allPreviewUrls.length > 0 && (
              <Stack direction="row" flexWrap="wrap" gap={1.5}>
                {existingImageUrls.map((url, i) => (
                  <Stack
                    key={`ex-${i}`}
                    sx={{
                      position: "relative",
                      width: 88,
                      height: 88,
                      borderRadius: "10px",
                      overflow: "hidden",
                      border: "1px solid #E8ECF0",
                      flexShrink: 0,
                      "&:hover .rm": { opacity: 1 },
                    }}
                  >
                    <img
                      src={url}
                      alt=""
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                      }}
                      onError={(e) => {
                        const img = e.target as HTMLImageElement;
                        img.src =
                          "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";
                        img.style.opacity = "0";
                      }}
                    />
                    <Stack
                      className="rm"
                      onClick={() => removeExisting(i)}
                      sx={{
                        position: "absolute",
                        top: 4,
                        right: 4,
                        width: 22,
                        height: 22,
                        borderRadius: "50%",
                        background: "rgba(0,0,0,0.6)",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        opacity: 0,
                        transition: "opacity 0.15s",
                      }}
                    >
                      <CloseIcon sx={{ fontSize: 12, color: "#fff" }} />
                    </Stack>
                  </Stack>
                ))}
                {newImagePreviews.map((url, i) => (
                  <Stack
                    key={`new-${i}`}
                    sx={{
                      position: "relative",
                      width: 88,
                      height: 88,
                      borderRadius: "10px",
                      overflow: "hidden",
                      border: "2px solid #6366F1",
                      flexShrink: 0,
                      "&:hover .rm": { opacity: 1 },
                    }}
                  >
                    <img
                      src={url}
                      alt=""
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                    <Stack
                      className="rm"
                      onClick={() => removeNew(i)}
                      sx={{
                        position: "absolute",
                        top: 4,
                        right: 4,
                        width: 22,
                        height: 22,
                        borderRadius: "50%",
                        background: "rgba(0,0,0,0.6)",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        opacity: 0,
                        transition: "opacity 0.15s",
                      }}
                    >
                      <CloseIcon sx={{ fontSize: 12, color: "#fff" }} />
                    </Stack>
                  </Stack>
                ))}
              </Stack>
            )}

            {/* Upload zone AFTER previews */}
            {canUploadMore && (
              <Stack
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  addFiles(Array.from(e.dataTransfer.files));
                }}
                sx={{
                  border: "2px dashed",
                  borderColor: isDragging ? "#6366F1" : "#E5E7EB",
                  borderRadius: "12px",
                  py: 4,
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  background: isDragging ? "#EEF2FF" : "#FAFAFA",
                  transition: "all 0.2s",
                  "&:hover": { borderColor: "#6366F1", background: "#EEF2FF" },
                }}
              >
                <Stack
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: "12px",
                    background: isDragging ? "#6366F1" : "#E5E7EB",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 1.5,
                    transition: "background 0.2s",
                  }}
                >
                  <CloudUploadIcon
                    sx={{
                      fontSize: 22,
                      color: isDragging ? "#fff" : "#9CA3AF",
                    }}
                  />
                </Stack>
                <Typography
                  sx={{ fontSize: "14px", fontWeight: 600, color: "#374151" }}
                >
                  Click to upload or drag & drop
                </Typography>
                <Typography
                  sx={{ fontSize: "12px", color: "#9CA3AF", mt: 0.5 }}
                >
                  PNG, JPG, WEBP · {5 - allPreviewUrls.length} slot
                  {5 - allPreviewUrls.length !== 1 ? "s" : ""} remaining
                </Typography>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  hidden
                  onChange={handleFileInput}
                />
              </Stack>
            )}

            {allPreviewUrls.length < 1 && (
              <Typography
                sx={{ fontSize: "11.5px", color: "#EF4444", fontWeight: 600 }}
              >
                At least 1 image is required
              </Typography>
            )}
          </Section>
        </Stack>

        {/* Sticky Footer */}
        <Stack
          direction="row"
          justifyContent="flex-end"
          gap={1.5}
          sx={{
            px: 3,
            py: 2,
            background: "#fff",
            borderTop: "1px solid #E8ECF0",
            position: "sticky",
            bottom: 0,
            zIndex: 10,
          }}
        >
          <Button
            onClick={closeDrawer}
            sx={{
              textTransform: "none",
              fontSize: "13px",
              fontWeight: 600,
              color: "#6B7280",
              border: "1px solid #E8ECF0",
              borderRadius: "10px",
              height: "40px",
              px: 2.5,
              "&:hover": { background: "#F9FAFB" },
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={save}
            disabled={!isSaveEnabled}
            sx={{
              color: "#ffffff",
              textTransform: "none",
              fontSize: "13px",
              fontWeight: 700,
              backgroundColor: "#6366F1",
              boxShadow: "0 2px 8px rgba(99,102,241,0.35)",
              borderRadius: "10px",
              height: "40px",
              px: 3,
              "&:hover": { backgroundColor: "#5254CC" },
              "&:disabled": {
                backgroundColor: "#E5E7EB",
                color: "#9CA3AF",
                boxShadow: "none",
              },
            }}
          >
            {editingProduct ? "Save Changes" : "Add New Product"}
          </Button>
        </Stack>
      </Drawer>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)} maxWidth="xs">
        <DialogTitle
          sx={{ fontWeight: 700, fontSize: "16px", color: "#111827" }}
        >
          Delete Product?
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ fontSize: "14px", color: "#6B7280" }}>
            This product will be permanently removed. This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button
            onClick={() => setDeleteId(null)}
            sx={{
              textTransform: "none",
              color: "#6B7280",
              border: "1px solid #E8ECF0",
              borderRadius: "8px",
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              if (deleteId) {
                setProducts((prev) => prev.filter((p) => p.id !== deleteId));
                setDeleteId(null);
              }
            }}
            sx={{
              color: "#ffffff",
              textTransform: "none",
              fontWeight: 700,
              backgroundColor: "#EF4444",
              boxShadow: "none",
              borderRadius: "8px",
              "&:hover": { backgroundColor: "#DC2626", boxShadow: "none" },
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};

export default ProductsManager;
