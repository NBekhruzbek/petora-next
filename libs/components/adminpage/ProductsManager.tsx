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
  <Stack className="admin-prd-section">
    <Stack className="admin-prd-section-header">
      <Typography className="admin-prd-section-title">{title}</Typography>
    </Stack>
    <Stack className="admin-prd-section-body">{children}</Stack>
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
          className="admin-prd-add-btn"
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
            className="admin-toolbar-search admin-prd-search"
          />
          <Select
            size="small"
            value={filterCat}
            onChange={(e) => setFilterCat(e.target.value)}
            className="admin-toolbar-select admin-prd-cat-filter"
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
                  <TableCell className="admin-prd-name-cell">
                    <Stack className="admin-name-cell">
                      <Stack className="admin-prd-thumb-box">
                        {product.images[0] && (
                          <img
                            src={product.images[0]}
                            alt=""
                            onError={(e) => {
                              const img = e.target as HTMLImageElement;
                              img.src =
                                "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";
                              img.style.opacity = "0";
                            }}
                          />
                        )}
                      </Stack>
                      <Typography className="admin-prd-name-text">
                        {product.name}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell className="admin-prd-cat-cell">
                    {product.category}
                  </TableCell>
                  <TableCell className="admin-prd-pet-cell">
                    {product.petType}
                  </TableCell>
                  <TableCell>
                    <Stack gap={0.4}>
                      {product.price !== product.discountedPrice ? (
                        <>
                          <Typography className="admin-prd-old-price">
                            ₩{product.price.toLocaleString()}
                          </Typography>
                          <Stack direction="row" alignItems="center" gap={0.8}>
                            <Typography className="admin-prd-new-price">
                              ₩{product.discountedPrice.toLocaleString()}
                            </Typography>
                            <span className="admin-prd-discount-badge">
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
                        <Typography className="admin-prd-price-text">
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
                  <TableCell className="admin-prd-sold-cell">
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
        PaperProps={{ className: "admin-prd-drawer-paper" }}
        disablePortal
      >
        {/* Sticky Header */}
        <Stack
          direction="row"
          alignItems="center"
          gap={2}
          className="admin-prd-drawer-header"
        >
          <Stack
            alignItems="center"
            justifyContent="center"
            className="admin-prd-header-icon-box"
          >
            <InventoryIcon className="admin-icon-20-indigo" />
          </Stack>
          <Stack flex={1} minWidth={0}>
            <Typography className="admin-prd-drawer-title">
              {editingProduct ? "Edit Product" : "Add New Product"}
            </Typography>
            <Typography className="admin-prd-drawer-subtitle">
              {editingProduct
                ? editingProduct.name
                : "Fill in the details below"}
            </Typography>
          </Stack>
          <IconButton
            onClick={closeDrawer}
            size="small"
            className="admin-prd-close-btn"
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>

        {/* Scrollable Sections */}
        <Stack className="admin-prd-drawer-body">
          {/* Basic Info */}
          <Section title="Basic Info">
            <Stack>
              <Typography className="admin-prd-field-label">
                Product Name
              </Typography>
              <TextField
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                size="small"
                fullWidth
                className="admin-prd-input-h42"
              />
            </Stack>
            <Stack direction="row" gap={1.5}>
              <Stack flex={1}>
                <Typography className="admin-prd-field-label">
                  Category
                </Typography>
                <Select
                  size="small"
                  value={form.category}
                  onChange={(e) => handleChange("category", e.target.value)}
                  className="admin-prd-select"
                >
                  {CATEGORIES.map((c) => (
                    <MenuItem key={c} value={c}>
                      {c}
                    </MenuItem>
                  ))}
                </Select>
              </Stack>
              <Stack flex={1}>
                <Typography className="admin-prd-field-label">
                  Pet Type
                </Typography>
                <Select
                  size="small"
                  value={form.petType}
                  onChange={(e) => handleChange("petType", e.target.value)}
                  className="admin-prd-select"
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
                <Typography className="admin-prd-field-label">
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
                  className="admin-prd-input-h42"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Typography className="admin-prd-adornment-text">
                          ₩
                        </Typography>
                      </InputAdornment>
                    ),
                  }}
                />
              </Stack>
              <Stack flex={1}>
                <Typography className="admin-prd-field-label">
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
                  className="admin-prd-input-h42"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Typography className="admin-prd-adornment-text">
                          %
                        </Typography>
                      </InputAdornment>
                    ),
                  }}
                />
              </Stack>
            </Stack>

            {/* Price breakdown — borderColor and background are dynamic */}
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
                    <Typography className="admin-prd-pb-orig-label">
                      Original
                    </Typography>
                    <Typography className="admin-prd-pb-orig-value">
                      ₩{form.price.toLocaleString()}
                    </Typography>
                  </Stack>
                  <Stack alignItems="center" className="admin-prd-pb-center">
                    <Stack className="admin-prd-pb-disc-badge">
                      <Typography className="admin-prd-pb-disc-text">
                        -{form.discountPercent}%
                      </Typography>
                    </Stack>
                    <Typography className="admin-prd-pb-arrow">→</Typography>
                  </Stack>
                  <Stack alignItems="center" flex={1}>
                    <Typography className="admin-prd-pb-final-label">
                      Final Price
                    </Typography>
                    <Typography className="admin-prd-pb-final-value">
                      ₩{afterDiscount.toLocaleString()}
                    </Typography>
                  </Stack>
                  <Stack className="admin-prd-pb-divider-v" />
                  <Stack alignItems="center" flex={1}>
                    <Typography className="admin-prd-pb-saves-label">
                      Customer Saves
                    </Typography>
                    <Typography className="admin-prd-pb-saves-value">
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
                  <Typography className="admin-prd-pb-no-disc-label">
                    No discount applied
                  </Typography>
                  <Typography className="admin-prd-pb-no-disc-value">
                    ₩{form.price.toLocaleString()}
                  </Typography>
                </Stack>
              )}
            </Stack>

            <Stack direction="row" gap={1.5}>
              <Stack flex={1}>
                <Typography className="admin-prd-field-label">
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
                  className="admin-prd-input-h42"
                />
              </Stack>
              <Stack flex={1}>
                <Typography className="admin-prd-field-label">
                  Status
                </Typography>
                <Select
                  size="small"
                  value={form.status}
                  onChange={(e) =>
                    handleChange("status", e.target.value as ProductStatus)
                  }
                  className="admin-prd-select"
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
              className="admin-prd-input-auto"
            />
            <TextField
              label="Benefits"
              value={form.benefitsInput}
              onChange={(e) => handleChange("benefitsInput", e.target.value)}
              size="small"
              fullWidth
              className="admin-prd-input"
              placeholder="e.g. High protein, Shiny coat"
            />
          </Section>

          {/* Images */}
          <Section title={`Images (${allPreviewUrls.length}/5)`}>
            {/* Previews FIRST */}
            {allPreviewUrls.length > 0 && (
              <Stack direction="row" flexWrap="wrap" gap={1.5}>
                {existingImageUrls.map((url, i) => (
                  <Stack key={`ex-${i}`} className="admin-prd-img-existing">
                    <img
                      src={url}
                      alt=""
                      onError={(e) => {
                        const img = e.target as HTMLImageElement;
                        img.src =
                          "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";
                        img.style.opacity = "0";
                      }}
                    />
                    <Stack
                      className="rm admin-prd-img-remove-btn"
                      onClick={() => removeExisting(i)}
                    >
                      <CloseIcon className="admin-icon-12-white" />
                    </Stack>
                  </Stack>
                ))}
                {newImagePreviews.map((url, i) => (
                  <Stack key={`new-${i}`} className="admin-prd-img-new">
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
                      className="rm admin-prd-img-remove-btn"
                      onClick={() => removeNew(i)}
                    >
                      <CloseIcon className="admin-icon-12-white" />
                    </Stack>
                  </Stack>
                ))}
              </Stack>
            )}

            {/* Upload zone — isDragging is dynamic so keep sx for those props */}
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
                className={`admin-prd-upload-zone${isDragging ? " dragging" : ""}`}
              >
                <Stack
                  className={`admin-prd-upload-icon-box${isDragging ? " dragging" : ""}`}
                >
                  <CloudUploadIcon
                    sx={{
                      fontSize: 22,
                      color: isDragging ? "#fff" : "#9CA3AF",
                    }}
                  />
                </Stack>
                <Typography className="admin-prd-upload-label">
                  Click to upload or drag &amp; drop
                </Typography>
                <Typography className="admin-prd-upload-hint">
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
              <Typography className="admin-prd-img-required-msg">
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
          className="admin-prd-drawer-footer"
        >
          <Button onClick={closeDrawer} className="admin-prd-cancel-btn">
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={save}
            disabled={!isSaveEnabled}
            className="admin-prd-save-btn"
          >
            {editingProduct ? "Save Changes" : "Add New Product"}
          </Button>
        </Stack>
      </Drawer>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)} maxWidth="xs" disablePortal>
        <DialogTitle className="admin-prd-dialog-title">
          Delete Product?
        </DialogTitle>
        <DialogContent>
          <Typography className="admin-prd-dialog-body">
            This product will be permanently removed. This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions className="admin-prd-dialog-actions">
          <Button
            onClick={() => setDeleteId(null)}
            className="admin-prd-dialog-cancel-btn"
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
            className="admin-prd-dialog-delete-btn"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};

export default ProductsManager;
