import { useState, useMemo } from "react";
import {
  Stack,
  Typography,
  TextField,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Drawer,
  IconButton,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import RoomServiceIcon from "@mui/icons-material/RoomService";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore";
import {
  mockServices,
  AdminService,
  ProductStatus,
} from "../../data/adminMockData";

const STATUS_OPTIONS: ProductStatus[] = ["active", "paused"];
const CATEGORIES = [
  "Grooming",
  "Training",
  "Walking",
  "Boarding",
  "Day-care",
  "Health",
];

const inputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
    fontSize: "14px",
    color: "#111827",
    background: "#fff",
    height: 42,
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
  height: 42,
  "& fieldset": { borderColor: "#E5E7EB" },
  "&:hover fieldset": { borderColor: "#C7D2FE" },
  "&.Mui-focused fieldset": { borderColor: "#6366F1", borderWidth: "1.5px" },
  "& .MuiSelect-icon": { color: "#9CA3AF" },
};

const FieldLabel = ({ children }: { children: React.ReactNode }) => (
  <Typography
    sx={{
      fontSize: "11px",
      fontWeight: 700,
      color: "#9CA3AF",
      mb: 0.8,
      textTransform: "uppercase",
      letterSpacing: "0.05em",
    }}
  >
    {children}
  </Typography>
);

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

type SortKey =
  | "name"
  | "agentName"
  | "category"
  | "location"
  | "priceMin"
  | "status";
type SortDir = "asc" | "desc";

interface FormShape {
  name: string;
  category: string;
  agentUsername: string;
  agentName: string;
  location: string;
  priceMin: number;
  priceMax: number;
  status: ProductStatus;
}

const emptyForm: FormShape = {
  name: "",
  category: "Grooming",
  agentUsername: "",
  agentName: "",
  location: "",
  priceMin: 0,
  priceMax: 0,
  status: "active",
};

// ─── Sortable header cell ────────────────────────────────────────────────────
const SortCell = ({
  label,
  col,
  sortBy,
  sortDir,
  onSort,
}: {
  label: string;
  col: SortKey;
  sortBy: SortKey;
  sortDir: SortDir;
  onSort: (col: SortKey) => void;
}) => {
  const active = sortBy === col;
  const Icon = active
    ? sortDir === "asc"
      ? ArrowUpwardIcon
      : ArrowDownwardIcon
    : UnfoldMoreIcon;
  return (
    <TableCell
      onClick={() => onSort(col)}
      sx={{
        cursor: "pointer",
        userSelect: "none",
        whiteSpace: "nowrap",
        "&:hover .sort-icon": { opacity: 1 },
        color: active ? "#6366F1 !important" : undefined,
      }}
    >
      <Stack direction="row" alignItems="center" gap={0.5}>
        {label}
        <Icon
          className="sort-icon"
          sx={{
            fontSize: 14,
            opacity: active ? 1 : 0.3,
            color: active ? "#6366F1" : "#9CA3AF",
            transition: "opacity 0.15s",
          }}
        />
      </Stack>
    </TableCell>
  );
};

const ServicesManager = () => {
  const [services, setServices] = useState<AdminService[]>(mockServices);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("ALL");
  const [sortBy, setSortBy] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingService, setEditingService] = useState<AdminService | null>(
    null,
  );
  const [form, setForm] = useState<FormShape>(emptyForm);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleSort = (col: SortKey) => {
    if (sortBy === col) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(col);
      setSortDir("asc");
    }
  };

  const displayed = useMemo(() => {
    let list = services.filter((s) => {
      if (filterCat !== "ALL" && s.category !== filterCat) return false;
      const q = search.toLowerCase();
      return (
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.agentName.toLowerCase().includes(q) ||
        s.location.toLowerCase().includes(q)
      );
    });

    list = [...list].sort((a, b) => {
      let va: string | number = "";
      let vb: string | number = "";
      if (sortBy === "priceMin") {
        va = a.priceMin;
        vb = b.priceMin;
      } else {
        va = (a[sortBy] as string).toLowerCase();
        vb = (b[sortBy] as string).toLowerCase();
      }
      if (va < vb) return sortDir === "asc" ? -1 : 1;
      if (va > vb) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

    return list;
  }, [services, search, filterCat, sortBy, sortDir]);

  const handleChange = (field: keyof FormShape, value: string | number) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const openEdit = (service: AdminService) => {
    setEditingService(service);
    setForm({
      name: service.name,
      category: service.category,
      agentUsername: service.agentUsername,
      agentName: service.agentName,
      location: service.location,
      priceMin: service.priceMin,
      priceMax: service.priceMax,
      status: service.status,
    });
    setDrawerOpen(true);
  };

  const save = () => {
    if (editingService) {
      setServices((prev) =>
        prev.map((s) => (s.id === editingService.id ? { ...s, ...form } : s)),
      );
    }
    setDrawerOpen(false);
  };

  const confirmDelete = () => {
    if (deleteId) {
      setServices((prev) => prev.filter((s) => s.id !== deleteId));
      setDeleteId(null);
    }
  };

  const sortProps = { sortBy, sortDir, onSort: handleSort };

  return (
    <Stack gap={0}>
      <Stack className="admin-page-header">
        <Typography className="admin-page-title">Services</Typography>
      </Stack>

      <Stack className="admin-card">
        <Stack className="admin-toolbar">
          <TextField
            size="small"
            placeholder="Search name, agent, location…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="admin-toolbar-search"
            sx={{ width: 260 }}
          />
          <Select
            size="small"
            value={filterCat}
            onChange={(e) => setFilterCat(e.target.value)}
            className="admin-toolbar-select"
            sx={{ width: 160 }}
          >
            <MenuItem value="ALL">All Categories</MenuItem>
            {CATEGORIES.map((c) => (
              <MenuItem key={c} value={c}>
                {c}
              </MenuItem>
            ))}
          </Select>
          <Typography className="admin-meta-count">
            {displayed.length} of {services.length}
          </Typography>
        </Stack>

        <TableContainer>
          <Table className="admin-table">
            <TableHead>
              <TableRow>
                <SortCell label="Service" col="name" {...sortProps} />
                <SortCell label="Agent" col="agentName" {...sortProps} />
                <SortCell label="Category" col="category" {...sortProps} />
                <SortCell label="Location" col="location" {...sortProps} />
                <SortCell label="Price" col="priceMin" {...sortProps} />
                <SortCell label="Status" col="status" {...sortProps} />
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayed.map((service) => (
                <TableRow key={service.id}>
                  <TableCell sx={{ fontWeight: 600, fontSize: "13px" }}>
                    {service.name}
                  </TableCell>
                  <TableCell>
                    <Stack gap={0.3}>
                      <Typography
                        className="admin-cell-name"
                        sx={{
                          fontWeight: 500,
                          fontSize: "13px",
                          color: "#111827",
                        }}
                      >
                        {service.agentName || "—"}
                      </Typography>
                      {service.agentUsername && (
                        <Typography sx={{ fontSize: "11px", color: "#9CA3AF" }}>
                          {service.agentUsername}
                        </Typography>
                      )}
                    </Stack>
                  </TableCell>
                  <TableCell sx={{ fontSize: "12px" }}>
                    {service.category}
                  </TableCell>
                  <TableCell sx={{ fontSize: "12px", color: "#6B7280" }}>
                    {service.location || "—"}
                  </TableCell>
                  <TableCell>
                    <Typography
                      sx={{
                        fontSize: "13px",
                        fontWeight: 700,
                        color: "#6366F1",
                      }}
                    >
                      ₩{service.priceMin.toLocaleString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={service.status}
                      onChange={(e) =>
                        setServices((prev) =>
                          prev.map((s) =>
                            s.id === service.id
                              ? {
                                  ...s,
                                  status: e.target.value as ProductStatus,
                                }
                              : s,
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
                        onClick={() => openEdit(service)}
                        className="admin-btn-edit"
                      >
                        Edit
                      </Button>
                      <Button
                        size="small"
                        onClick={() => setDeleteId(service.id)}
                        className="admin-btn-delete"
                      >
                        Delete
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
              {displayed.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    align="center"
                    sx={{ py: 4, color: "#9CA3AF" }}
                  >
                    No services found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)} maxWidth="xs">
        <DialogTitle
          sx={{ fontWeight: 700, fontSize: "16px", color: "#111827" }}
        >
          Delete Service?
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ fontSize: "14px", color: "#6B7280" }}>
            This service will be permanently removed.
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
            onClick={confirmDelete}
            sx={{
              textTransform: "none",
              fontWeight: 700,
              color: "#ffffff",
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

      {/* Edit Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: 520,
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
            <RoomServiceIcon sx={{ fontSize: 20, color: "#6366F1" }} />
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
              Edit Service
            </Typography>
            <Typography sx={{ fontSize: "12px", color: "#9CA3AF", mt: 0.3 }}>
              {editingService?.name ?? ""}
            </Typography>
          </Stack>
          <IconButton
            onClick={() => setDrawerOpen(false)}
            size="small"
            sx={{
              color: "#6B7280",
              "&:hover": { background: "#F3F4F6", color: "#111827" },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>

        {/* Sections */}
        <Stack sx={{ p: 2.5, gap: 2, pb: 14 }}>
          {/* Service Info */}
          <Section title="Service Info">
            <Stack>
              <FieldLabel>Service Name</FieldLabel>
              <TextField
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                size="small"
                fullWidth
                placeholder="e.g. Premium Dog Grooming"
                sx={inputSx}
              />
            </Stack>
            <Stack>
              <FieldLabel>Category</FieldLabel>
              <Select
                value={form.category}
                onChange={(e) => handleChange("category", e.target.value)}
                size="small"
                fullWidth
                sx={selectSx}
              >
                {CATEGORIES.map((c) => (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </Select>
            </Stack>
          </Section>

          {/* Agent & Location */}
          <Section title="Agent & Location">
            <Stack direction="row" gap={1.5}>
              <Stack flex={1}>
                <FieldLabel>Username</FieldLabel>
                <TextField
                  value={form.agentUsername}
                  onChange={(e) =>
                    handleChange("agentUsername", e.target.value)
                  }
                  size="small"
                  placeholder="e.g. @maria.garcia"
                  sx={inputSx}
                />
              </Stack>
              <Stack flex={1}>
                <FieldLabel>Agent Name</FieldLabel>
                <TextField
                  value={form.agentName}
                  onChange={(e) => handleChange("agentName", e.target.value)}
                  size="small"
                  placeholder="e.g. Maria Garcia"
                  sx={inputSx}
                />
              </Stack>
            </Stack>
            <Stack>
              <FieldLabel>Location</FieldLabel>
              <TextField
                value={form.location}
                onChange={(e) => handleChange("location", e.target.value)}
                size="small"
                fullWidth
                placeholder="e.g. Gangnam, Seoul"
                sx={inputSx}
              />
            </Stack>
          </Section>

          {/* Pricing */}
          <Section title="Pricing">
            <Stack direction="row" gap={1.5}>
              <Stack flex={1}>
                <FieldLabel>Min Price</FieldLabel>
                <TextField
                  type="number"
                  value={form.priceMin === 0 ? "" : form.priceMin}
                  onChange={(e) =>
                    handleChange(
                      "priceMin",
                      e.target.value === "" ? 0 : Number(e.target.value),
                    )
                  }
                  size="small"
                  placeholder="0"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Typography sx={{ fontSize: "14px", color: "#9CA3AF" }}>
                          ₩
                        </Typography>
                      </InputAdornment>
                    ),
                  }}
                  sx={inputSx}
                />
              </Stack>
              <Stack flex={1}>
                <FieldLabel>Max Price</FieldLabel>
                <TextField
                  type="number"
                  value={form.priceMax === 0 ? "" : form.priceMax}
                  onChange={(e) =>
                    handleChange(
                      "priceMax",
                      e.target.value === "" ? 0 : Number(e.target.value),
                    )
                  }
                  size="small"
                  placeholder="0"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Typography sx={{ fontSize: "14px", color: "#9CA3AF" }}>
                          ₩
                        </Typography>
                      </InputAdornment>
                    ),
                  }}
                  sx={inputSx}
                />
              </Stack>
            </Stack>
          </Section>

          {/* Status */}
          <Section title="Status">
            <Stack>
              <FieldLabel>Visibility</FieldLabel>
              <Select
                value={form.status}
                onChange={(e) => handleChange("status", e.target.value)}
                size="small"
                fullWidth
                renderValue={(val) => (
                  <span className={`status-chip status-${val}`}>
                    {(val as string).charAt(0).toUpperCase() +
                      (val as string).slice(1)}
                  </span>
                )}
                sx={selectSx}
              >
                {STATUS_OPTIONS.map((s) => (
                  <MenuItem key={s} value={s}>
                    <span className={`status-chip status-${s}`}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </span>
                  </MenuItem>
                ))}
              </Select>
            </Stack>
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
            onClick={() => setDrawerOpen(false)}
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
            disabled={!form.name.trim()}
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
            Save Changes
          </Button>
        </Stack>
      </Drawer>
    </Stack>
  );
};

export default ServicesManager;
