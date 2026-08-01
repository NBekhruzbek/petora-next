import { useIntlLocale } from "@/libs/i18n/format";
import { useTranslation } from "react-i18next";
import { useMemo, useState } from "react";
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
  Pagination,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import RoomServiceIcon from "@mui/icons-material/RoomService";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore";
import { useMutation, useQuery } from "@apollo/client";
import { GET_ALL_SERVICES } from "@/apollo/user/query";
import { GET_ALL_AGENTS_BY_ADMIN } from "@/apollo/admin/query";
import {
  REMOVE_SERVICE_BY_ADMIN,
  UPDATE_SERVICE_BY_ADMIN,
} from "@/apollo/admin/mutation";
import { Service } from "@/libs/types/service/service";
import { ServicesInquiry } from "@/libs/types/service/service.input";
import { Member } from "@/libs/types/member/member";
import {
  ServiceLocation,
  ServiceStatus,
  ServiceType,
} from "@/libs/enums/service.enum";
import { Direction } from "@/libs/enums/common.enum";
import {
  sweetBottomSmallSuccessAlert,
  sweetMixinErrorAlert,
} from "@/libs/sweetAlert";
import {
  isNoDataError,
  metaTotal,
  prettyEnum,
  statusChipClass,
  useDebouncedValue,
  won,
} from "./adminHelpers";

const SERVICES_PER_PAGE = 10;
// One page is enough to name the agents on any services page.
const AGENT_LOOKUP_LIMIT = 100;

const STATUS_OPTIONS: ServiceStatus[] = [
  ServiceStatus.ACTIVE,
  ServiceStatus.PAUSE,
];
const SERVICE_TYPES = Object.values(ServiceType);
const SERVICE_LOCATIONS = Object.values(ServiceLocation);

// The only sorts the API accepts for services; anything else would have to be
// faked by re-ordering the current page, which is not a table sort.
type SortKey = "servicePrice" | "createdAt";
type SortDir = Direction;

interface FormShape {
  serviceTitle: string;
  serviceType: ServiceType;
  serviceLocation: ServiceLocation;
  servicePrice: number;
  serviceDurationMinutes: number;
  serviceDescription: string;
  serviceStatus: ServiceStatus;
}

const emptyForm: FormShape = {
  serviceTitle: "",
  serviceType: ServiceType.GROOMING,
  serviceLocation: ServiceLocation.SEOUL,
  servicePrice: 0,
  serviceDurationMinutes: 0,
  serviceDescription: "",
  serviceStatus: ServiceStatus.ACTIVE,
};

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
    ? sortDir === Direction.ASC
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

const formatDuration = (
  minutes: number | undefined,
  t: (k: string, o?: Record<string, unknown>) => string,
) => {
  if (!minutes) return "—";
  if (minutes < 60) return t("admin.duration.min", { count: minutes });
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest
    ? t("admin.duration.hourMin", { h: hours, m: rest })
    : t("admin.duration.hour", { count: hours });
};

const ServicesManager = () => {
  const { t } = useTranslation();
  const intlLocale = useIntlLocale();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"ALL" | ServiceType>("ALL");
  const [sortBy, setSortBy] = useState<SortKey>("createdAt");
  const [sortDir, setSortDir] = useState<SortDir>(Direction.DESC);
  const debouncedSearch = useDebouncedValue(search);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [form, setForm] = useState<FormShape>(emptyForm);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Service | null>(null);
  const [removeTarget, setRemoveTarget] = useState<Service | null>(null);

  /** APOLLO REQUESTS **/

  // There is no getAllServicesByAdmin, but getAllServices accepts an explicit
  // serviceStatus list that overrides its ACTIVE-only default — that is how the
  // panel sees paused and removed offers too.
  const searchFilter: ServicesInquiry = {
    page,
    limit: SERVICES_PER_PAGE,
    sort: sortBy,
    direction: sortDir,
    search: {
      onlyLiked: false,
      serviceStatus: [
        ServiceStatus.ACTIVE,
        ServiceStatus.PAUSE,
        ServiceStatus.DELETE,
      ],
      ...(debouncedSearch.trim() ? { text: debouncedSearch.trim() } : {}),
      ...(filterType === "ALL" ? {} : { serviceType: [filterType] }),
    },
  };

  const {
    data: servicesData,
    previousData: servicesPreviousData,
    error: servicesError,
    refetch: servicesRefetch,
  } = useQuery(GET_ALL_SERVICES, {
    fetchPolicy: "cache-and-network",
    variables: { input: searchFilter },
    notifyOnNetworkStatusChange: true,
  });

  // Service carries only memberId — no memberData — so agent names come from a
  // separate lookup that is keyed by id below.
  const { data: agentsData } = useQuery(GET_ALL_AGENTS_BY_ADMIN, {
    fetchPolicy: "cache-first",
    variables: {
      input: {
        page: 1,
        limit: AGENT_LOOKUP_LIMIT,
        sort: "createdAt",
        direction: Direction.DESC,
        search: {},
      },
    },
  });

  const [updateServiceByAdmin] = useMutation(UPDATE_SERVICE_BY_ADMIN);
  const [removeServiceByAdmin] = useMutation(REMOVE_SERVICE_BY_ADMIN);

  /** DERIVED **/

  const servicesResult = servicesData ?? servicesPreviousData;
  const services: Service[] = isNoDataError(servicesError)
    ? []
    : (servicesResult?.getAllServices?.list ?? []);
  const total = isNoDataError(servicesError)
    ? 0
    : metaTotal(servicesResult?.getAllServices?.metaCounter);
  const totalPages = Math.max(1, Math.ceil(total / SERVICES_PER_PAGE));

  const agentsById = useMemo(() => {
    const list: Member[] = agentsData?.getAllAgentsByAdmin?.list ?? [];
    return new Map(list.map((agent) => [agent._id, agent]));
  }, [agentsData]);

  /** HANDLERS **/

  const refreshServices = async () => {
    try {
      await servicesRefetch({ input: searchFilter });
    } catch {
      /* an emptied list surfaces through servicesError */
    }
  };

  const handleSort = (col: SortKey) => {
    if (sortBy === col) {
      setSortDir((d) => (d === Direction.ASC ? Direction.DESC : Direction.ASC));
    } else {
      setSortBy(col);
      setSortDir(Direction.ASC);
    }
    setPage(1);
  };

  const handleChange = (field: keyof FormShape, value: string | number) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const openEdit = (service: Service) => {
    setEditingService(service);
    setForm({
      serviceTitle: service.serviceTitle,
      serviceType: service.serviceType,
      serviceLocation: service.serviceLocation,
      servicePrice: service.servicePrice,
      serviceDurationMinutes: service.serviceDurationMinutes,
      serviceDescription: service.serviceDescription,
      serviceStatus:
        service.serviceStatus === ServiceStatus.DELETE
          ? ServiceStatus.PAUSE
          : service.serviceStatus,
    });
    setDrawerOpen(true);
  };

  const save = async () => {
    if (!editingService || isSaving) return;
    try {
      if (!form.serviceTitle.trim())
        throw new Error(t("admin.services.titleRequired"));
      setIsSaving(true);

      await updateServiceByAdmin({
        variables: {
          input: {
            serviceId: editingService._id,
            serviceTitle: form.serviceTitle.trim(),
            serviceType: form.serviceType,
            serviceLocation: form.serviceLocation,
            servicePrice: form.servicePrice,
            serviceDurationMinutes: form.serviceDurationMinutes,
            serviceDescription: form.serviceDescription.trim(),
            serviceStatus: form.serviceStatus,
          },
        },
      });
      await refreshServices();
      setDrawerOpen(false);
      await sweetBottomSmallSuccessAlert("Service saved!", 700);
    } catch (err: any) {
      console.log("ERROR, save service:", err.message);
      await sweetMixinErrorAlert(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const changeStatus = async (
    service: Service,
    serviceStatus: ServiceStatus,
  ) => {
    if (service.serviceStatus === serviceStatus) return;
    try {
      await updateServiceByAdmin({
        variables: { input: { serviceId: service._id, serviceStatus } },
      });
      await refreshServices();
      await sweetBottomSmallSuccessAlert("Service updated!", 700);
    } catch (err: any) {
      console.log("ERROR, changeStatus:", err.message);
      await sweetMixinErrorAlert(err.message);
    }
  };

  // Services have no remove mutation either — DELETE takes the offer off the
  // public Service page and out of the agent's list.
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await updateServiceByAdmin({
        variables: {
          input: {
            serviceId: deleteTarget._id,
            serviceStatus: ServiceStatus.DELETE,
          },
        },
      });
      setDeleteTarget(null);
      await refreshServices();
      await sweetBottomSmallSuccessAlert("Service removed!", 700);
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
      await removeServiceByAdmin({ variables: { input: removeTarget._id } });
      setRemoveTarget(null);
      await refreshServices();
      await sweetBottomSmallSuccessAlert("Service deleted for good!", 900);
    } catch (err: any) {
      console.log("ERROR, confirmRemove:", err.message);
      await sweetMixinErrorAlert(err.message);
    }
  };

  const resetToFirstPage = () => setPage(1);
  const sortProps = { sortBy, sortDir, onSort: handleSort };

  return (
    <Stack gap={0}>
      <Stack className="admin-page-header">
        <Typography className="admin-page-title">
          {t("admin.services.title")}
        </Typography>
      </Stack>

      <Stack className="admin-card">
        <Stack className="admin-toolbar">
          <TextField
            size="small"
            placeholder={t("admin.services.search")}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              resetToFirstPage();
            }}
            className="admin-toolbar-search admin-svc-search"
          />
          <Select
            size="small"
            value={filterType}
            onChange={(e) => {
              setFilterType(e.target.value as "ALL" | ServiceType);
              resetToFirstPage();
            }}
            className="admin-toolbar-select admin-svc-cat-filter"
          >
            <MenuItem value="ALL">{t("admin.filter.allCategories")}</MenuItem>
            {SERVICE_TYPES.map((c) => (
              <MenuItem key={c} value={c}>
                {t(`enums.serviceType.${c}`)}
              </MenuItem>
            ))}
          </Select>
          <Typography className="admin-meta-count">
            {t("admin.showingOf", { shown: services.length, total })}
          </Typography>
        </Stack>

        <TableContainer>
          <Table className="admin-table">
            <TableHead>
              <TableRow>
                <TableCell>{t("admin.col.service")}</TableCell>
                <TableCell>{t("admin.col.agent")}</TableCell>
                <TableCell>{t("admin.col.category")}</TableCell>
                <TableCell>{t("admin.col.location")}</TableCell>
                <TableCell>{t("admin.col.duration")}</TableCell>
                <SortCell
                  label={t("admin.col.price")}
                  col="servicePrice"
                  {...sortProps}
                />
                <SortCell
                  label={t("admin.services.created")}
                  col="createdAt"
                  {...sortProps}
                />
                <TableCell>{t("admin.col.status")}</TableCell>
                <TableCell>{t("admin.col.actions")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {services.map((service) => {
                const agent = agentsById.get(service.memberId);
                const isRetired =
                  service.serviceStatus === ServiceStatus.DELETE;
                return (
                  <TableRow key={service._id}>
                    <TableCell className="admin-svc-name-cell">
                      {service.serviceTitle}
                    </TableCell>
                    <TableCell>
                      <Stack gap={0.3}>
                        <Typography className="admin-cell-name">
                          {agent?.memberFullName ||
                            agent?.memberUserName ||
                            "—"}
                        </Typography>
                        {agent?.memberUserName && (
                          <Typography className="admin-agt-handle">
                            @{agent.memberUserName}
                          </Typography>
                        )}
                      </Stack>
                    </TableCell>
                    <TableCell className="admin-svc-cat-cell">
                      {t(`enums.serviceType.${service.serviceType}`)}
                    </TableCell>
                    <TableCell className="admin-svc-location-cell">
                      {t(`enums.serviceLocation.${service.serviceLocation}`)}
                    </TableCell>
                    <TableCell className="admin-cell-meta">
                      {formatDuration(service.serviceDurationMinutes, t)}
                    </TableCell>
                    <TableCell>
                      <Typography className="admin-svc-price-text">
                        {won(service.servicePrice)}
                      </Typography>
                    </TableCell>
                    <TableCell className="admin-cell-date">
                      {new Date(service.createdAt).toLocaleDateString(
                        intlLocale,
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        },
                      )}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={service.serviceStatus}
                        onChange={(e) =>
                          changeStatus(service, e.target.value as ServiceStatus)
                        }
                        size="small"
                        renderValue={(val) => (
                          <span className={statusChipClass(val as string)}>
                            {t(`admin.status.${val}`)}
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
                          <MenuItem value={ServiceStatus.DELETE}>
                            <span
                              className={statusChipClass(ServiceStatus.DELETE)}
                            >
                              {ServiceStatus.DELETE}
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
                            onClick={() => setRemoveTarget(service)}
                            className="admin-btn-delete"
                          >
                            Remove
                          </Button>
                        ) : (
                          <>
                            <Button
                              size="small"
                              onClick={() => openEdit(service)}
                              className="admin-btn-edit"
                            >
                              Edit
                            </Button>
                            <Button
                              size="small"
                              onClick={() => setDeleteTarget(service)}
                              className="admin-btn-delete"
                            >
                              {t("admin.delete")}
                            </Button>
                          </>
                        )}
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}
              {services.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={9}
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

      {/* Delete Confirmation */}
      <Dialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        maxWidth="xs"
        disablePortal
      >
        <DialogTitle className="admin-svc-dialog-title">
          Delete Service?
        </DialogTitle>
        <DialogContent>
          <Typography className="admin-svc-dialog-body">
            This service will be taken off the public Service page and out of
            the agent&apos;s listings. Existing bookings are not affected.
          </Typography>
        </DialogContent>
        <DialogActions className="admin-svc-dialog-actions">
          <Button
            onClick={() => setDeleteTarget(null)}
            className="admin-svc-dialog-cancel-btn"
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={confirmDelete}
            className="admin-svc-dialog-delete-btn"
          >
            {t("admin.delete")}
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
        <DialogTitle className="admin-svc-dialog-title">
          Remove permanently?
        </DialogTitle>
        <DialogContent>
          <Typography className="admin-svc-dialog-body">
            <strong>{removeTarget?.serviceTitle}</strong> will be erased from
            the database. This cannot be undone — restore it instead if you only
            want the agent listing back.
          </Typography>
        </DialogContent>
        <DialogActions className="admin-svc-dialog-actions">
          <Button
            onClick={() => setRemoveTarget(null)}
            className="admin-svc-dialog-cancel-btn"
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={confirmRemove}
            className="admin-svc-dialog-delete-btn"
          >
            Remove
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
              {editingService?.serviceTitle ?? ""}
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
          <Section title={t("admin.services.info")}>
            <Stack>
              <FieldLabel>{t("admin.col.serviceTitle")}</FieldLabel>
              <TextField
                value={form.serviceTitle}
                onChange={(e) => handleChange("serviceTitle", e.target.value)}
                size="small"
                fullWidth
                placeholder={t("admin.services.phTitle")}
                className="admin-svc-input"
              />
            </Stack>
            <Stack>
              <FieldLabel>{t("admin.col.category")}</FieldLabel>
              <Select
                value={form.serviceType}
                onChange={(e) => handleChange("serviceType", e.target.value)}
                size="small"
                fullWidth
                className="admin-svc-select"
              >
                {SERVICE_TYPES.map((c) => (
                  <MenuItem key={c} value={c}>
                    {t(`enums.serviceType.${c}`)}
                  </MenuItem>
                ))}
              </Select>
            </Stack>
            <Stack>
              <FieldLabel>{t("admin.col.description")}</FieldLabel>
              <TextField
                value={form.serviceDescription}
                onChange={(e) =>
                  handleChange("serviceDescription", e.target.value)
                }
                size="small"
                fullWidth
                multiline
                rows={3}
                InputProps={{
                  style: {
                    height: "auto",
                    minHeight: "90px",
                    alignItems: "flex-start",
                  },
                }}
                className="admin-svc-input"
              />
            </Stack>
          </Section>

          {/* Owner (read-only — the agent owns the listing) */}
          <Section title={t("admin.services.agentLocation")}>
            <Stack>
              <FieldLabel>{t("admin.col.agent")}</FieldLabel>
              <Typography className="admin-svc-owner-text">
                {(() => {
                  const agent = editingService
                    ? agentsById.get(editingService.memberId)
                    : undefined;
                  return agent
                    ? `${agent.memberFullName || agent.memberUserName} · @${agent.memberUserName}`
                    : "Unknown agent";
                })()}
              </Typography>
            </Stack>
            <Stack>
              <FieldLabel>{t("admin.col.location")}</FieldLabel>
              <Select
                value={form.serviceLocation}
                onChange={(e) =>
                  handleChange("serviceLocation", e.target.value)
                }
                size="small"
                fullWidth
                className="admin-svc-select"
              >
                {SERVICE_LOCATIONS.map((l) => (
                  <MenuItem key={l} value={l}>
                    {t(`enums.serviceLocation.${l}`)}
                  </MenuItem>
                ))}
              </Select>
            </Stack>
          </Section>

          {/* Pricing */}
          <Section title={t("admin.services.pricingDuration")}>
            <Stack direction="row" gap={1.5}>
              <Stack flex={1}>
                <FieldLabel>{t("admin.col.price")}</FieldLabel>
                <TextField
                  type="number"
                  value={form.servicePrice === 0 ? "" : form.servicePrice}
                  onChange={(e) =>
                    handleChange(
                      "servicePrice",
                      e.target.value === "" ? 0 : Number(e.target.value),
                    )
                  }
                  size="small"
                  placeholder={t("admin.services.phZero")}
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
                <FieldLabel>{t("admin.services.durationMinutes")}</FieldLabel>
                <TextField
                  type="number"
                  value={
                    form.serviceDurationMinutes === 0
                      ? ""
                      : form.serviceDurationMinutes
                  }
                  onChange={(e) =>
                    handleChange(
                      "serviceDurationMinutes",
                      e.target.value === "" ? 0 : Number(e.target.value),
                    )
                  }
                  size="small"
                  placeholder={t("admin.services.phZero")}
                  className="admin-svc-input"
                />
              </Stack>
            </Stack>
          </Section>

          {/* Status */}
          <Section title={t("admin.services.statusSection")}>
            <Stack>
              <FieldLabel>{t("admin.col.visibility")}</FieldLabel>
              <Select
                value={form.serviceStatus}
                onChange={(e) => handleChange("serviceStatus", e.target.value)}
                size="small"
                fullWidth
                renderValue={(val) => (
                  <span className={statusChipClass(val as string)}>
                    {t(`admin.status.${val}`)}
                  </span>
                )}
                className="admin-svc-select"
              >
                {STATUS_OPTIONS.map((s) => (
                  <MenuItem key={s} value={s}>
                    <span className={statusChipClass(s)}>
                      {t(`admin.status.${s}`)}
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
            disabled={!form.serviceTitle.trim() || isSaving}
            className="admin-svc-save-btn"
          >
            {isSaving ? t("admin.action.saving") : t("admin.action.save")}
          </Button>
        </Stack>
      </Drawer>
    </Stack>
  );
};

export default ServicesManager;
