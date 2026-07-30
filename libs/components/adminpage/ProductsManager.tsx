import { useState, useRef, useCallback, ChangeEvent } from "react";
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
  Pagination,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import InventoryIcon from "@mui/icons-material/Inventory";
import { useMutation, useQuery } from "@apollo/client";
import { GET_ALL_PRODUCTS_BY_ADMIN } from "@/apollo/admin/query";
import {
  CREATE_PRODUCT,
  REMOVE_PRODUCT_BY_ADMIN,
  UPDATE_PRODUCT,
} from "@/apollo/admin/mutation";
import { IMAGES_UPLOADER } from "@/apollo/user/mutation";
import { Product } from "@/libs/types/product/product";
import { ProductsInquiry } from "@/libs/types/product/product.input";
import {
  ProductPetType,
  ProductStatus,
  ProductType,
} from "@/libs/enums/product.enum";
import { Direction } from "@/libs/enums/common.enum";
import {
  sweetBottomSmallSuccessAlert,
  sweetMixinErrorAlert,
} from "@/libs/sweetAlert";
import {
  BLANK_IMAGE,
  imageUrl,
  metaTotal,
  prettyEnum,
  statusChipClass,
  useDebouncedValue,
  won,
} from "./adminHelpers";

const PRODUCTS_PER_PAGE = 10;
const MAX_IMAGES = 5;

// DELETE is reachable through the Delete button, not the inline status select.
const STATUS_OPTIONS: ProductStatus[] = [
  ProductStatus.ACTIVE,
  ProductStatus.PAUSE,
];
const PRODUCT_TYPES = Object.values(ProductType);
const PET_TYPES = Object.values(ProductPetType);

interface FormShape {
  productName: string;
  productType: ProductType;
  productPetType: ProductPetType;
  productBrand: string;
  productPrice: number;
  productDiscount: number;
  productQuantity: number;
  productStatus: ProductStatus;
  productShortDesc: string;
  productDesc: string;
  productBenefits: string;
}

const emptyForm: FormShape = {
  productName: "",
  productType: ProductType.FOOD,
  productPetType: ProductPetType.DOG,
  productBrand: "",
  productPrice: 0,
  productDiscount: 0,
  productQuantity: 0,
  productStatus: ProductStatus.ACTIVE,
  productShortDesc: "",
  productDesc: "",
  productBenefits: "",
};

/** A picked file waiting to be uploaded, or a path the product already stores. */
interface ImageSlot {
  path?: string;
  file?: File;
  preview: string;
}

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
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"ALL" | ProductType>("ALL");
  const debouncedSearch = useDebouncedValue(search);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<FormShape>(emptyForm);
  const [images, setImages] = useState<ImageSlot[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [removeTarget, setRemoveTarget] = useState<Product | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /** APOLLO REQUESTS **/

  const searchFilter: ProductsInquiry = {
    page,
    limit: PRODUCTS_PER_PAGE,
    sort: "createdAt",
    direction: Direction.DESC,
    search: {
      // Retired products stay listed so an admin can either restore them or
      // remove them for good — the shop already hides them from customers.
      productStatus: [
        ProductStatus.ACTIVE,
        ProductStatus.PAUSE,
        ProductStatus.DELETE,
      ],
      ...(debouncedSearch.trim() ? { text: debouncedSearch.trim() } : {}),
      ...(filterType === "ALL" ? {} : { productType: [filterType] }),
    },
  };

  const {
    data: productsData,
    previousData: productsPreviousData,
    refetch: productsRefetch,
  } = useQuery(GET_ALL_PRODUCTS_BY_ADMIN, {
    fetchPolicy: "cache-and-network",
    variables: { input: searchFilter },
    notifyOnNetworkStatusChange: true,
  });

  const [createProduct] = useMutation(CREATE_PRODUCT);
  const [updateProduct] = useMutation(UPDATE_PRODUCT);
  const [removeProductByAdmin] = useMutation(REMOVE_PRODUCT_BY_ADMIN);
  const [imagesUploader] = useMutation(IMAGES_UPLOADER);

  /** DERIVED **/

  const productsResult = productsData ?? productsPreviousData;
  const products: Product[] =
    productsResult?.getAllProductsByAdmin?.list ?? [];
  const total = metaTotal(productsResult?.getAllProductsByAdmin?.metaCounter);
  const totalPages = Math.max(1, Math.ceil(total / PRODUCTS_PER_PAGE));

  const canUploadMore = images.length < MAX_IMAGES;
  const afterDiscount =
    form.productDiscount > 0
      ? Math.round(form.productPrice * (1 - form.productDiscount / 100))
      : form.productPrice;
  const savings = form.productPrice - afterDiscount;
  const isSaveEnabled =
    form.productName.trim().length >= 3 &&
    form.productShortDesc.trim().length >= 3 &&
    Boolean(form.productDesc.trim()) &&
    images.length >= 1 &&
    !isSaving;

  /** HANDLERS **/

  const handleChange = (field: keyof FormShape, value: string | number) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const addFiles = useCallback(
    (files: File[]) => {
      setImages((prev) => {
        const toAdd = files
          .filter((f) => f.type.startsWith("image/"))
          .slice(0, MAX_IMAGES - prev.length);
        if (!toAdd.length) return prev;
        return [
          ...prev,
          ...toAdd.map((file) => ({
            file,
            preview: URL.createObjectURL(file),
          })),
        ];
      });
    },
    [],
  );

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    addFiles(Array.from(e.target.files ?? []));
    // Reset the input so re-picking the same file still fires a change.
    e.target.value = "";
  };

  const removeImage = (idx: number) =>
    setImages((prev) => {
      const target = prev[idx];
      if (target?.file) URL.revokeObjectURL(target.preview);
      return prev.filter((_, i) => i !== idx);
    });

  const releasePreviews = () =>
    images.forEach((image) => {
      if (image.file) URL.revokeObjectURL(image.preview);
    });

  const openAdd = () => {
    releasePreviews();
    setEditingProduct(null);
    setForm(emptyForm);
    setImages([]);
    setDrawerOpen(true);
  };

  const openEdit = (product: Product) => {
    releasePreviews();
    setEditingProduct(product);
    setForm({
      productName: product.productName,
      productType: product.productType,
      productPetType: product.productPetType,
      productBrand: product.productBrand ?? "",
      productPrice: product.productPrice,
      productDiscount: product.productDiscount ?? 0,
      productQuantity: product.productQuantity,
      productStatus:
        product.productStatus === ProductStatus.DELETE
          ? ProductStatus.PAUSE
          : product.productStatus,
      productShortDesc: product.productShortDesc ?? "",
      productDesc: product.productDesc ?? "",
      productBenefits: product.productBenefits ?? "",
    });
    setImages(
      (product.productImages ?? []).filter(Boolean).map((path) => ({
        path,
        preview: imageUrl(path),
      })),
    );
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    releasePreviews();
    setImages([]);
    setDrawerOpen(false);
  };

  const save = async () => {
    if (isSaving) return;
    try {
      setIsSaving(true);

      // Only newly picked files need uploading; saved paths are reused as-is.
      const pending = images.filter((image) => image.file);
      let uploaded: string[] = [];
      if (pending.length) {
        const { data } = await imagesUploader({
          variables: {
            files: pending.map((image) => image.file),
            target: "product",
          },
        });
        uploaded = (data?.imagesUploader ?? []).filter(Boolean);
        if (uploaded.length !== pending.length) {
          throw new Error("Image upload failed, please retry.");
        }
      }

      let nextUpload = 0;
      const productImages = images
        .map((image) => (image.file ? uploaded[nextUpload++] : image.path))
        .filter(Boolean) as string[];

      // productPriceAfterDiscount is derived server-side from price + discount.
      const payload = {
        productName: form.productName.trim(),
        productType: form.productType,
        productPetType: form.productPetType,
        productStatus: form.productStatus,
        productBrand: form.productBrand.trim(),
        productShortDesc: form.productShortDesc.trim(),
        productDesc: form.productDesc.trim(),
        productBenefits: form.productBenefits.trim(),
        productPrice: form.productPrice,
        productDiscount: form.productDiscount,
        productQuantity: form.productQuantity,
        productImages,
      };

      if (editingProduct) {
        await updateProduct({
          variables: { input: { productId: editingProduct._id, ...payload } },
        });
      } else {
        await createProduct({ variables: { input: payload } });
      }

      await productsRefetch({ input: searchFilter });
      closeDrawer();
      await sweetBottomSmallSuccessAlert(
        editingProduct ? "Product saved!" : "Product added!",
        700,
      );
    } catch (err: any) {
      console.log("ERROR, save product:", err.message);
      await sweetMixinErrorAlert(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const changeStatus = async (
    product: Product,
    productStatus: ProductStatus,
  ) => {
    if (product.productStatus === productStatus) return;
    try {
      await updateProduct({
        variables: { input: { productId: product._id, productStatus } },
      });
      await productsRefetch({ input: searchFilter });
      await sweetBottomSmallSuccessAlert("Product updated!", 700);
    } catch (err: any) {
      console.log("ERROR, changeStatus:", err.message);
      await sweetMixinErrorAlert(err.message);
    }
  };

  // The API has no remove mutation for products, so this is a soft delete:
  // DELETE takes it out of both the shop and this table.
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await updateProduct({
        variables: {
          input: {
            productId: deleteTarget._id,
            productStatus: ProductStatus.DELETE,
          },
        },
      });
      setDeleteTarget(null);
      await productsRefetch({ input: searchFilter });
      await sweetBottomSmallSuccessAlert("Product removed!", 700);
    } catch (err: any) {
      console.log("ERROR, confirmDelete:", err.message);
      await sweetMixinErrorAlert(err.message);
    }
  };

  // Hard delete, offered only on rows already in DELETE. The row is gone from
  // Mongo afterwards, so there is nothing left to restore.
  const confirmRemove = async () => {
    if (!removeTarget) return;
    try {
      await removeProductByAdmin({ variables: { input: removeTarget._id } });
      setRemoveTarget(null);
      await productsRefetch({ input: searchFilter });
      await sweetBottomSmallSuccessAlert("Product deleted for good!", 900);
    } catch (err: any) {
      console.log("ERROR, confirmRemove:", err.message);
      await sweetMixinErrorAlert(err.message);
    }
  };

  const resetToFirstPage = () => setPage(1);

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
            onChange={(e) => {
              setSearch(e.target.value);
              resetToFirstPage();
            }}
            className="admin-toolbar-search admin-prd-search"
          />
          <Select
            size="small"
            value={filterType}
            onChange={(e) => {
              setFilterType(e.target.value as "ALL" | ProductType);
              resetToFirstPage();
            }}
            className="admin-toolbar-select admin-prd-cat-filter"
          >
            <MenuItem value="ALL">All Categories</MenuItem>
            {PRODUCT_TYPES.map((c) => (
              <MenuItem key={c} value={c}>
                {prettyEnum(c)}
              </MenuItem>
            ))}
          </Select>
          <Typography className="admin-meta-count">
            {products.length} of {total}
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
              {products.map((product) => {
                const finalPrice =
                  product.productPriceAfterDiscount ?? product.productPrice;
                const isDiscounted = finalPrice !== product.productPrice;
                const isRetired =
                  product.productStatus === ProductStatus.DELETE;
                return (
                  <TableRow key={product._id}>
                    <TableCell className="admin-prd-name-cell">
                      <Stack className="admin-name-cell">
                        <Stack className="admin-prd-thumb-box">
                          {product.productImages?.[0] && (
                            <img
                              src={imageUrl(product.productImages[0])}
                              alt=""
                              onError={(e) => {
                                const img = e.target as HTMLImageElement;
                                img.src = BLANK_IMAGE;
                                img.style.opacity = "0";
                              }}
                            />
                          )}
                        </Stack>
                        <Typography className="admin-prd-name-text">
                          {product.productName}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell className="admin-prd-cat-cell">
                      {prettyEnum(product.productType)}
                    </TableCell>
                    <TableCell className="admin-prd-pet-cell">
                      {prettyEnum(product.productPetType)}
                    </TableCell>
                    <TableCell>
                      <Stack gap={0.4}>
                        {isDiscounted ? (
                          <>
                            <Typography className="admin-prd-old-price">
                              {won(product.productPrice)}
                            </Typography>
                            <Stack
                              direction="row"
                              alignItems="center"
                              gap={0.8}
                            >
                              <Typography className="admin-prd-new-price">
                                {won(finalPrice)}
                              </Typography>
                              <span className="admin-prd-discount-badge">
                                -{product.productDiscount}%
                              </span>
                            </Stack>
                          </>
                        ) : (
                          <Typography className="admin-prd-price-text">
                            {won(product.productPrice)}
                          </Typography>
                        )}
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Typography
                        sx={{
                          fontSize: "12px",
                          fontWeight: 600,
                          color:
                            product.productQuantity === 0
                              ? "#EF4444"
                              : "#374151",
                        }}
                      >
                        {product.productQuantity === 0
                          ? "Out"
                          : product.productQuantity}
                      </Typography>
                    </TableCell>
                    <TableCell className="admin-prd-sold-cell">
                      {product.productSoldTimes ?? 0}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={product.productStatus}
                        onChange={(e) =>
                          changeStatus(
                            product,
                            e.target.value as ProductStatus,
                          )
                        }
                        size="small"
                        renderValue={(val) => (
                          <span className={statusChipClass(val as string)}>
                            {val as string}
                          </span>
                        )}
                        className="admin-status-select"
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <MenuItem key={s} value={s}>
                            <span className={statusChipClass(s)}>{s}</span>
                          </MenuItem>
                        ))}
                        {/* Only the current value of an already-retired row —
                            picking Active or Pause above restores it. */}
                        {isRetired && (
                          <MenuItem value={ProductStatus.DELETE}>
                            <span
                              className={statusChipClass(ProductStatus.DELETE)}
                            >
                              {ProductStatus.DELETE}
                            </span>
                          </MenuItem>
                        )}
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Stack className="admin-action-row">
                        {isRetired ? (
                          <Button
                            size="small"
                            onClick={() => setRemoveTarget(product)}
                            className="admin-btn-delete"
                          >
                            Remove
                          </Button>
                        ) : (
                          <>
                            <Button
                              size="small"
                              onClick={() => openEdit(product)}
                              className="admin-btn-edit"
                            >
                              Edit
                            </Button>
                            <Button
                              size="small"
                              onClick={() => setDeleteTarget(product)}
                              className="admin-btn-delete"
                            >
                              Delete
                            </Button>
                          </>
                        )}
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}
              {products.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <Typography className="admin-table-empty">
                      No products found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {totalPages > 1 && (
          <Stack className="admin-pagination">
            <Pagination
              page={page}
              count={totalPages}
              onChange={(_, value) => setPage(value)}
              shape="rounded"
              color="primary"
            />
          </Stack>
        )}
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
                ? editingProduct.productName
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
                value={form.productName}
                onChange={(e) => handleChange("productName", e.target.value)}
                size="small"
                fullWidth
                placeholder="At least 3 characters"
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
                  value={form.productType}
                  onChange={(e) => handleChange("productType", e.target.value)}
                  className="admin-prd-select"
                >
                  {PRODUCT_TYPES.map((c) => (
                    <MenuItem key={c} value={c}>
                      {prettyEnum(c)}
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
                  value={form.productPetType}
                  onChange={(e) =>
                    handleChange("productPetType", e.target.value)
                  }
                  className="admin-prd-select"
                >
                  {PET_TYPES.map((t) => (
                    <MenuItem key={t} value={t}>
                      {prettyEnum(t)}
                    </MenuItem>
                  ))}
                </Select>
              </Stack>
            </Stack>
            <Stack>
              <Typography className="admin-prd-field-label">Brand</Typography>
              <TextField
                value={form.productBrand}
                onChange={(e) => handleChange("productBrand", e.target.value)}
                size="small"
                fullWidth
                placeholder="Optional"
                className="admin-prd-input-h42"
              />
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
                  value={form.productPrice === 0 ? "" : form.productPrice}
                  placeholder="0"
                  onChange={(e) =>
                    handleChange(
                      "productPrice",
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
                  value={form.productDiscount === 0 ? "" : form.productDiscount}
                  placeholder="0"
                  onChange={(e) =>
                    handleChange(
                      "productDiscount",
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
                borderColor: form.productDiscount > 0 ? "#C7D2FE" : "#E8ECF0",
                background:
                  form.productDiscount > 0
                    ? "linear-gradient(135deg,#EEF2FF,#F5F3FF)"
                    : "#F9FAFB",
                p: 2,
              }}
            >
              {form.productDiscount > 0 ? (
                <Stack direction="row" alignItems="center">
                  <Stack alignItems="center" flex={1}>
                    <Typography className="admin-prd-pb-orig-label">
                      Original
                    </Typography>
                    <Typography className="admin-prd-pb-orig-value">
                      {won(form.productPrice)}
                    </Typography>
                  </Stack>
                  <Stack alignItems="center" className="admin-prd-pb-center">
                    <Stack className="admin-prd-pb-disc-badge">
                      <Typography className="admin-prd-pb-disc-text">
                        -{form.productDiscount}%
                      </Typography>
                    </Stack>
                    <Typography className="admin-prd-pb-arrow">→</Typography>
                  </Stack>
                  <Stack alignItems="center" flex={1}>
                    <Typography className="admin-prd-pb-final-label">
                      Final Price
                    </Typography>
                    <Typography className="admin-prd-pb-final-value">
                      {won(afterDiscount)}
                    </Typography>
                  </Stack>
                  <Stack className="admin-prd-pb-divider-v" />
                  <Stack alignItems="center" flex={1}>
                    <Typography className="admin-prd-pb-saves-label">
                      Customer Saves
                    </Typography>
                    <Typography className="admin-prd-pb-saves-value">
                      {won(savings)}
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
                    {won(form.productPrice)}
                  </Typography>
                </Stack>
              )}
            </Stack>

            <Stack direction="row" gap={1.5}>
              <Stack flex={1}>
                <Typography className="admin-prd-field-label">Stock</Typography>
                <TextField
                  type="number"
                  value={form.productQuantity === 0 ? "" : form.productQuantity}
                  placeholder="0"
                  onChange={(e) =>
                    handleChange(
                      "productQuantity",
                      e.target.value === ""
                        ? 0
                        : Math.max(0, Number(e.target.value)),
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
                  value={form.productStatus}
                  onChange={(e) =>
                    handleChange("productStatus", e.target.value)
                  }
                  className="admin-prd-select"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <MenuItem key={s} value={s}>
                      {prettyEnum(s)}
                    </MenuItem>
                  ))}
                </Select>
              </Stack>
            </Stack>
          </Section>

          {/* Details */}
          <Section title="Product Details">
            <TextField
              label="Short Description"
              value={form.productShortDesc}
              onChange={(e) =>
                handleChange("productShortDesc", e.target.value)
              }
              size="small"
              fullWidth
              inputProps={{ maxLength: 250, style: { color: "#111827" } }}
              helperText="Shown on the shop card · 3–250 characters"
              className="admin-prd-input"
            />
            <TextField
              label="Full Description"
              value={form.productDesc}
              onChange={(e) => handleChange("productDesc", e.target.value)}
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
              value={form.productBenefits}
              onChange={(e) => handleChange("productBenefits", e.target.value)}
              size="small"
              fullWidth
              className="admin-prd-input"
              placeholder="e.g. High protein, Shiny coat"
            />
          </Section>

          {/* Images */}
          <Section title={`Images (${images.length}/${MAX_IMAGES})`}>
            {images.length > 0 && (
              <Stack direction="row" flexWrap="wrap" gap={1.5}>
                {images.map((image, i) => (
                  <Stack
                    key={`${image.path ?? image.preview}-${i}`}
                    className={
                      image.file ? "admin-prd-img-new" : "admin-prd-img-existing"
                    }
                  >
                    <img
                      src={image.preview}
                      alt=""
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                      }}
                      onError={(e) => {
                        const img = e.target as HTMLImageElement;
                        img.src = BLANK_IMAGE;
                        img.style.opacity = "0";
                      }}
                    />
                    <Stack
                      className="rm admin-prd-img-remove-btn"
                      onClick={() => removeImage(i)}
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
                  PNG, JPG, WEBP · {MAX_IMAGES - images.length} slot
                  {MAX_IMAGES - images.length !== 1 ? "s" : ""} remaining
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

            {images.length < 1 && (
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
            {isSaving
              ? "Saving…"
              : editingProduct
                ? "Save Changes"
                : "Add New Product"}
          </Button>
        </Stack>
      </Drawer>

      {/* Delete Confirmation */}
      <Dialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        maxWidth="xs"
        disablePortal
      >
        <DialogTitle className="admin-prd-dialog-title">
          Delete Product?
        </DialogTitle>
        <DialogContent>
          <Typography className="admin-prd-dialog-body">
            This product will be taken off the shop and out of this list. Past
            orders that contain it are not affected.
          </Typography>
        </DialogContent>
        <DialogActions className="admin-prd-dialog-actions">
          <Button
            onClick={() => setDeleteTarget(null)}
            className="admin-prd-dialog-cancel-btn"
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={confirmDelete}
            className="admin-prd-dialog-delete-btn"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Permanent Removal Confirmation */}
      <Dialog
        open={!!removeTarget}
        onClose={() => setRemoveTarget(null)}
        maxWidth="xs"
        disablePortal
      >
        <DialogTitle className="admin-prd-dialog-title">
          Remove permanently?
        </DialogTitle>
        <DialogContent>
          <Typography className="admin-prd-dialog-body">
            <strong>{removeTarget?.productName}</strong> will be erased from the
            database. This cannot be undone — restore it instead if you only
            want it back in the shop.
          </Typography>
        </DialogContent>
        <DialogActions className="admin-prd-dialog-actions">
          <Button
            onClick={() => setRemoveTarget(null)}
            className="admin-prd-dialog-cancel-btn"
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={confirmRemove}
            className="admin-prd-dialog-delete-btn"
          >
            Remove
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};

export default ProductsManager;
