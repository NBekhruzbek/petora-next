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

const FieldLabel = ({ children }: { children: React.ReactNode }) => (
  <Typography className="admin-svc-field-label">{children}</Typography>
);

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <Stack className="admin-svc-section">
    <Stack className="admin-svc-section-header">
      <Typography className="admin-svc-section-title">{title}</Typography>
    </Stack>
    <Stack className="admin-svc-section-body">{children}</Stack>
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
      className="admin-svc-sort-cell"
      sx={{
        // color is dynamic: active changes it
        color: active ? "#6366F1 !important" : undefined,
      }}
    >
      <Stack direction="row" alignItems="center" gap={0.5}>
        {label}
        <Icon
          className="sort-icon"
          sx={{
            fontSize: 14,
            // opacity and color are dynamic based on active
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
            className="admin-toolbar-search admin-svc-search"
          />
          <Select
            size="small"
            value={filterCat}
            onChange={(e) => setFilterCat(e.target.value)}
            className="admin-toolbar-select admin-svc-cat-filter"
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
                  <TableCell className="admin-svc-name-cell">
                    {service.name}
                  </TableCell>
                  <TableCell>
                    <Stack gap={0.3}>
                      <Typography className="admin-cell-name">
                        {service.agentName || "—"}
                      </Typography>
                      {service.agentUsername && (
                        <Typography className="admin-agt-handle">
                          {service.agentUsername}
                        </Typography>
                      )}
                    </Stack>
                  </TableCell>
                  <TableCell className="admin-svc-cat-cell">
                    {service.category}
                  </TableCell>
                  <TableCell className="admin-svc-location-cell">
                    {service.location || "—"}
                  </TableCell>
                  <TableCell>
                    <Typography className="admin-svc-price-text">
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
                    className="admin-svc-empty-cell"
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
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)} maxWidth="xs" disablePortal>
        <DialogTitle className="admin-svc-dialog-title">
          Delete Service?
        </DialogTitle>
        <DialogContent>
          <Typography className="admin-svc-dialog-body">
            This service will be permanently removed.
          </Typography>
        </DialogContent>
        <DialogActions className="admin-svc-dialog-actions">
          <Button
            onClick={() => setDeleteId(null)}
            className="admin-svc-dialog-cancel-btn"
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={confirmDelete}
            className="admin-svc-dialog-delete-btn"
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
        PaperProps={{ className: "admin-svc-drawer-paper" }}
        disablePortal
      >
        {/* Sticky Header */}
        <Stack
          direction="row"
          alignItems="center"
          gap={2}
          className="admin-svc-drawer-header"
        >
          <Stack
            alignItems="center"
            justifyContent="center"
            className="admin-svc-header-icon-box"
          >
            <RoomServiceIcon className="admin-icon-20-indigo" />
          </Stack>
          <Stack flex={1} minWidth={0}>
            <Typography className="admin-svc-drawer-title">
              Edit Service
            </Typography>
            <Typography className="admin-svc-drawer-subtitle">
              {editingService?.name ?? ""}
            </Typography>
          </Stack>
          <IconButton
            onClick={() => setDrawerOpen(false)}
            size="small"
            className="admin-svc-close-btn"
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>

        {/* Sections */}
        <Stack className="admin-svc-drawer-body">
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
                className="admin-svc-input"
              />
            </Stack>
            <Stack>
              <FieldLabel>Category</FieldLabel>
              <Select
                value={form.category}
                onChange={(e) => handleChange("category", e.target.value)}
                size="small"
                fullWidth
                className="admin-svc-select"
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
                  className="admin-svc-input"
                />
              </Stack>
              <Stack flex={1}>
                <FieldLabel>Agent Name</FieldLabel>
                <TextField
                  value={form.agentName}
                  onChange={(e) => handleChange("agentName", e.target.value)}
                  size="small"
                  placeholder="e.g. Maria Garcia"
                  className="admin-svc-input"
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
                className="admin-svc-input"
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
                        <Typography className="admin-svc-adornment-text">
                          ₩
                        </Typography>
                      </InputAdornment>
                    ),
                  }}
                  className="admin-svc-input"
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
                        <Typography className="admin-svc-adornment-text">
                          ₩
                        </Typography>
                      </InputAdornment>
                    ),
                  }}
                  className="admin-svc-input"
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
                className="admin-svc-select"
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
          className="admin-svc-drawer-footer"
        >
          <Button
            onClick={() => setDrawerOpen(false)}
            className="admin-svc-cancel-btn"
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={save}
            disabled={!form.name.trim()}
            className="admin-svc-save-btn"
          >
            Save Changes
          </Button>
        </Stack>
      </Drawer>
    </Stack>
  );
};

export default ServicesManager;
