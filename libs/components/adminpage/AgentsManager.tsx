import { useIntlLocale } from "@/libs/i18n/format";
import { useTranslation } from "react-i18next";
import { useState } from "react";
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
  Rating,
  Pagination,
  Chip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PlaceIcon from "@mui/icons-material/Place";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import { useMutation, useQuery } from "@apollo/client";
import { GET_ALL_AGENTS_BY_ADMIN } from "@/apollo/admin/query";
import { UPDATE_MEMBER_BY_ADMIN } from "@/apollo/admin/mutation";
import { Member } from "@/libs/types/member/member";
import { MembersInquiry } from "@/libs/types/member/member.input";
import { MemberStatus } from "@/libs/enums/member.enum";
import { ServiceLocation, ServiceType } from "@/libs/enums/service.enum";
import { Direction } from "@/libs/enums/common.enum";
import {
  sweetBottomSmallSuccessAlert,
  sweetMixinErrorAlert,
} from "@/libs/sweetAlert";
import {
  avatarUrl,
  formatDate,
  imageUrl,
  isNoDataError,
  metaTotal,
  prettyEnum,
  statusChipClass,
  useDebouncedValue,
} from "./adminHelpers";

const AGENTS_PER_PAGE = 10;

const STATUS_OPTIONS: MemberStatus[] = [
  MemberStatus.ACTIVE,
  MemberStatus.BLOCK,
  MemberStatus.DELETE,
];

const SERVICE_TYPES = Object.values(ServiceType);
const SERVICE_AREAS = Object.values(ServiceLocation);

const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  [MemberStatus.ACTIVE]: { bg: "#ECFDF5", color: "#059669" },
  [MemberStatus.BLOCK]: { bg: "#FEF2F2", color: "#DC2626" },
  [MemberStatus.DELETE]: { bg: "#F3F4F6", color: "#6B7280" },
};

interface AgentForm {
  memberFullName: string;
  memberUserName: string;
  memberEmail: string;
  memberPhone: string;
  memberSpecialty: string;
  memberStatus: MemberStatus;
  memberExperience: string;
  memberApproach: string;
  memberLanguages: string;
  memberResponseTime: string;
  memberDesc: string;
  memberServiceTypes: string[];
  memberServiceArea: string[];
}

const emptyForm: AgentForm = {
  memberFullName: "",
  memberUserName: "",
  memberEmail: "",
  memberPhone: "",
  memberSpecialty: "",
  memberStatus: MemberStatus.ACTIVE,
  memberExperience: "",
  memberApproach: "",
  memberLanguages: "",
  memberResponseTime: "",
  memberDesc: "",
  memberServiceTypes: [],
  memberServiceArea: [],
};

const TEXT_FIELDS: { labelKey: string; field: keyof AgentForm }[] = [
  { labelKey: "admin.agents.fullName", field: "memberFullName" },
  { labelKey: "admin.col.username", field: "memberUserName" },
  { labelKey: "admin.col.email", field: "memberEmail" },
  { labelKey: "admin.agents.phone", field: "memberPhone" },
  { labelKey: "admin.agents.specialty", field: "memberSpecialty" },
  { labelKey: "admin.agents.experience", field: "memberExperience" },
  { labelKey: "admin.agents.approach", field: "memberApproach" },
  { labelKey: "admin.agents.languages", field: "memberLanguages" },
  { labelKey: "admin.agents.responseTime", field: "memberResponseTime" },
];

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <Stack
    direction="row"
    justifyContent="space-between"
    alignItems="flex-start"
    gap={2}
    className="admin-agt-info-row"
  >
    <Typography className="admin-agt-info-label">{label}</Typography>
    <Typography className="admin-agt-info-value" style={{ textAlign: "right" }}>
      {value}
    </Typography>
  </Stack>
);

const AgentsManager = () => {
  const { t } = useTranslation();
  const intlLocale = useIntlLocale();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"ALL" | MemberStatus>("ALL");
  const debouncedSearch = useDebouncedValue(search);

  const [editOpen, setEditOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState<Member | null>(null);
  const [form, setForm] = useState<AgentForm>(emptyForm);
  const [isSaving, setIsSaving] = useState(false);

  const [detailOpen, setDetailOpen] = useState(false);
  const [detailAgent, setDetailAgent] = useState<Member | null>(null);

  /** APOLLO REQUESTS **/

  const searchFilter: MembersInquiry = {
    page,
    limit: AGENTS_PER_PAGE,
    sort: "createdAt",
    direction: Direction.DESC,
    search: {
      ...(debouncedSearch.trim() ? { text: debouncedSearch.trim() } : {}),
      ...(filterStatus === "ALL" ? {} : { memberStatus: filterStatus }),
    },
  };

  const {
    data: agentsData,
    previousData: agentsPreviousData,
    error: agentsError,
    refetch: agentsRefetch,
  } = useQuery(GET_ALL_AGENTS_BY_ADMIN, {
    fetchPolicy: "cache-and-network",
    variables: { input: searchFilter },
    notifyOnNetworkStatusChange: true,
  });

  const [updateMemberByAdmin] = useMutation(UPDATE_MEMBER_BY_ADMIN);

  /** DERIVED **/

  const agentsResult = agentsData ?? agentsPreviousData;
  const agents: Member[] = isNoDataError(agentsError)
    ? []
    : (agentsResult?.getAllAgentsByAdmin?.list ?? []);
  const total = isNoDataError(agentsError)
    ? 0
    : metaTotal(agentsResult?.getAllAgentsByAdmin?.metaCounter);
  const totalPages = Math.max(1, Math.ceil(total / AGENTS_PER_PAGE));
  const blockedCount = agents.filter(
    (a) => a.memberStatus === MemberStatus.BLOCK,
  ).length;

  /** HANDLERS **/

  const refreshAgents = async () => {
    try {
      await agentsRefetch({ input: searchFilter });
    } catch {
      /* an emptied list surfaces through agentsError */
    }
  };

  const changeStatus = async (agent: Member, memberStatus: MemberStatus) => {
    if (agent.memberStatus === memberStatus) return;
    try {
      await updateMemberByAdmin({
        variables: { input: { _id: agent._id, memberStatus } },
      });
      await refreshAgents();
      await sweetBottomSmallSuccessAlert("Agent updated!", 700);
    } catch (err: any) {
      console.log("ERROR, changeStatus:", err.message);
      await sweetMixinErrorAlert(err.message);
    }
  };

  const openEdit = (agent: Member) => {
    setEditingAgent(agent);
    setForm({
      memberFullName: agent.memberFullName ?? "",
      memberUserName: agent.memberUserName ?? "",
      memberEmail: agent.memberEmail ?? "",
      memberPhone: agent.memberPhone ?? "",
      memberSpecialty: agent.memberSpecialty ?? "",
      memberStatus: agent.memberStatus,
      memberExperience: agent.memberExperience ?? "",
      memberApproach: agent.memberApproach ?? "",
      memberLanguages: agent.memberLanguages ?? "",
      memberResponseTime: agent.memberResponseTime ?? "",
      memberDesc: agent.memberDesc ?? "",
      memberServiceTypes: agent.memberServiceTypes ?? [],
      memberServiceArea: agent.memberServiceArea ?? [],
    });
    setDetailOpen(false);
    setEditOpen(true);
  };

  const saveEdit = async () => {
    if (!editingAgent || isSaving) return;
    try {
      if (!form.memberUserName.trim())
        throw new Error(t("admin.agents.usernameRequired"));
      setIsSaving(true);

      await updateMemberByAdmin({
        variables: {
          input: {
            _id: editingAgent._id,
            memberFullName: form.memberFullName.trim(),
            memberUserName: form.memberUserName.trim(),
            memberEmail: form.memberEmail.trim(),
            memberPhone: form.memberPhone.trim(),
            memberSpecialty: form.memberSpecialty.trim(),
            memberStatus: form.memberStatus,
            memberExperience: form.memberExperience.trim(),
            memberApproach: form.memberApproach.trim(),
            memberLanguages: form.memberLanguages.trim(),
            memberResponseTime: form.memberResponseTime.trim(),
            memberDesc: form.memberDesc.trim(),
            memberServiceTypes: form.memberServiceTypes,
            memberServiceArea: form.memberServiceArea,
          },
        },
      });
      await refreshAgents();
      setEditOpen(false);
      await sweetBottomSmallSuccessAlert("Agent saved!", 700);
    } catch (err: any) {
      console.log("ERROR, saveEdit:", err.message);
      await sweetMixinErrorAlert(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const openDetail = (agent: Member) => {
    setDetailAgent(agent);
    setDetailOpen(true);
  };

  const resetToFirstPage = () => setPage(1);

  return (
    <Stack gap={0}>
      <Stack className="admin-page-header">
        <Typography className="admin-page-title">
          {t("admin.agents.title")}
        </Typography>
        <Typography className="admin-agt-pending-count">
          {t("admin.blockedOnPage", { count: blockedCount })}
        </Typography>
      </Stack>

      <Stack className="admin-card">
        <Stack className="admin-toolbar">
          <TextField
            size="small"
            placeholder={t("admin.agents.search")}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              resetToFirstPage();
            }}
            className="admin-toolbar-search admin-agt-search"
          />
          <Select
            size="small"
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value as "ALL" | MemberStatus);
              resetToFirstPage();
            }}
            className="admin-toolbar-select admin-agt-status-filter"
          >
            <MenuItem value="ALL">{t("admin.filter.allStatuses")}</MenuItem>
            {STATUS_OPTIONS.map((s) => (
              <MenuItem key={s} value={s}>
                {prettyEnum(s)}
              </MenuItem>
            ))}
          </Select>
          <Typography className="admin-meta-count">
            {t("admin.showingOf", { shown: agents.length, total })}
          </Typography>
        </Stack>

        <TableContainer>
          <Table className="admin-table">
            <TableHead>
              <TableRow>
                <TableCell>{t("admin.col.agent")}</TableCell>
                <TableCell>{t("admin.col.serviceTypes")}</TableCell>
                <TableCell>{t("admin.col.rating")}</TableCell>
                <TableCell>{t("admin.nav.services")}</TableCell>
                <TableCell>{t("admin.col.status")}</TableCell>
                <TableCell>{t("admin.col.joined")}</TableCell>
                <TableCell>{t("admin.col.actions")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {agents.map((agent) => (
                <TableRow key={agent._id}>
                  <TableCell>
                    <Stack className="admin-name-cell">
                      <Stack className="admin-agt-avatar-wrap">
                        <img
                          src={avatarUrl(
                            agent.memberImage,
                            agent.memberFullName || agent.memberUserName,
                          )}
                          alt={agent.memberUserName}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = avatarUrl(
                              undefined,
                              agent.memberFullName || agent.memberUserName,
                            );
                          }}
                        />
                      </Stack>
                      <Stack>
                        <Typography className="admin-agt-name">
                          {agent.memberFullName || agent.memberUserName}
                        </Typography>
                        <Typography className="admin-agt-handle">
                          @{agent.memberUserName}
                        </Typography>
                      </Stack>
                    </Stack>
                  </TableCell>
                  <TableCell className="admin-agt-service-cell">
                    {(agent.memberServiceTypes ?? []).length
                      ? (agent.memberServiceTypes ?? [])
                          .map(prettyEnum)
                          .join(", ")
                      : "—"}
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" alignItems="center" gap={0.5}>
                      <Rating
                        value={agent.memberRating ?? 0}
                        precision={0.1}
                        readOnly
                        size="small"
                        className="admin-agt-rating-stars"
                      />
                      <Typography className="admin-agt-rating-value">
                        {(agent.memberRating ?? 0).toFixed(1)}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell className="admin-agt-bookings-cell">
                    {agent.memberServices ?? 0}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={agent.memberStatus}
                      onChange={(e) =>
                        changeStatus(agent, e.target.value as MemberStatus)
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
                    </Select>
                  </TableCell>
                  <TableCell className="admin-agt-joined-cell">
                    {formatDate(agent.createdAt, intlLocale)}
                  </TableCell>
                  <TableCell>
                    <Stack className="admin-action-row">
                      <Button
                        size="small"
                        onClick={() => openDetail(agent)}
                        className="admin-btn-sm admin-btn-sm-indigo-bold"
                      >
                        Details
                      </Button>
                      <Button
                        size="small"
                        onClick={() => openEdit(agent)}
                        className="admin-btn-sm admin-btn-sm-gray"
                      >
                        Edit
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
              {agents.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography className="admin-table-empty">
                      {t("admin.empty.agents")}
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

      {/* ── Agent Detail Drawer ───────────────────────────── */}
      <Drawer
        anchor="right"
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        PaperProps={{ className: "admin-agt-detail-paper" }}
        disablePortal
      >
        {detailAgent &&
          (() => {
            const ss =
              STATUS_STYLE[detailAgent.memberStatus] ??
              STATUS_STYLE[MemberStatus.ACTIVE];
            const certificates = (detailAgent.memberCertificates ?? []).filter(
              Boolean,
            );
            return (
              <>
                {/* Sticky Header */}
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  className="admin-agt-detail-header"
                >
                  <Typography className="admin-agt-detail-header-title">
                    Agent Profile
                  </Typography>
                  <IconButton
                    onClick={() => setDetailOpen(false)}
                    size="small"
                    className="admin-agt-detail-close-btn"
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Stack>

                <Stack className="admin-agt-detail-body">
                  {/* Profile card */}
                  <Stack className="admin-agt-profile-card">
                    <Stack className="admin-agt-cover-strip" />
                    <Stack className="admin-agt-profile-body">
                      <Stack className="admin-agt-avatar-outer">
                        <Stack className="admin-agt-avatar-lg">
                          <img
                            src={avatarUrl(
                              detailAgent.memberImage,
                              detailAgent.memberFullName ||
                                detailAgent.memberUserName,
                            )}
                            alt={detailAgent.memberUserName}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = avatarUrl(
                                undefined,
                                detailAgent.memberFullName ||
                                  detailAgent.memberUserName,
                              );
                            }}
                          />
                        </Stack>
                      </Stack>
                      <Stack
                        direction="row"
                        alignItems="flex-start"
                        justifyContent="space-between"
                      >
                        <Stack>
                          <Typography className="admin-agt-fullname">
                            {detailAgent.memberFullName ||
                              detailAgent.memberUserName}
                          </Typography>
                          {detailAgent.memberSpecialty && (
                            <Typography className="admin-agt-role">
                              {detailAgent.memberSpecialty}
                            </Typography>
                          )}
                        </Stack>
                        <span
                          style={{
                            fontSize: "10.5px",
                            fontWeight: 700,
                            background: ss.bg,
                            color: ss.color,
                            borderRadius: "999px",
                            padding: "4px 12px",
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                          }}
                        >
                          {detailAgent.memberStatus}
                        </span>
                      </Stack>

                      {/* Quick stats */}
                      <Stack
                        direction="row"
                        gap={2}
                        className="admin-agt-stats-row"
                      >
                        <Stack alignItems="center" flex={1}>
                          <Typography className="admin-agt-stat-value">
                            {(detailAgent.memberRating ?? 0).toFixed(1)}
                          </Typography>
                          <Rating
                            value={detailAgent.memberRating ?? 0}
                            readOnly
                            size="small"
                            className="admin-agt-rating-sm"
                          />
                          <Typography className="admin-agt-stat-label">
                            Rating
                          </Typography>
                        </Stack>
                        <Stack className="admin-agt-divider-v" />
                        <Stack alignItems="center" flex={1}>
                          <Typography className="admin-agt-stat-value">
                            {detailAgent.memberServices ?? 0}
                          </Typography>
                          <Typography className="admin-agt-stat-label">
                            Services
                          </Typography>
                        </Stack>
                        <Stack className="admin-agt-divider-v" />
                        <Stack alignItems="center" flex={1}>
                          <Typography className="admin-agt-stat-value">
                            {certificates.length}
                          </Typography>
                          <Typography className="admin-agt-stat-label">
                            Certs
                          </Typography>
                        </Stack>
                      </Stack>
                    </Stack>
                  </Stack>

                  {/* Bio */}
                  {detailAgent.memberDesc && (
                    <Stack className="admin-agt-section-card">
                      <Typography className="admin-agt-section-heading">
                        About
                      </Typography>
                      <Typography className="admin-agt-bio-text">
                        {detailAgent.memberDesc}
                      </Typography>
                    </Stack>
                  )}

                  {/* Contact & Location */}
                  <Stack className="admin-agt-section-card">
                    <Typography className="admin-agt-section-heading-lg">
                      Contact & Location
                    </Typography>
                    <Stack gap={1}>
                      <InfoRow
                        label={t("admin.col.username")}
                        value={`@${detailAgent.memberUserName}`}
                      />
                      <InfoRow
                        label={t("admin.col.email")}
                        value={detailAgent.memberEmail || "—"}
                      />
                      {detailAgent.memberPhone && (
                        <InfoRow
                          label={t("admin.agents.phone")}
                          value={detailAgent.memberPhone}
                        />
                      )}
                      {(detailAgent.memberServiceArea ?? []).length > 0 && (
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                          gap={2}
                          className="admin-agt-info-row"
                        >
                          <Stack direction="row" alignItems="center" gap={0.5}>
                            <PlaceIcon className="admin-icon-13-gray" />
                            <Typography className="admin-agt-info-label">
                              Service Area
                            </Typography>
                          </Stack>
                          <Typography className="admin-agt-info-value">
                            {(detailAgent.memberServiceArea ?? [])
                              .map(prettyEnum)
                              .join(", ")}
                          </Typography>
                        </Stack>
                      )}
                      {detailAgent.memberResponseTime && (
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                          gap={2}
                          className="admin-agt-info-row-last"
                        >
                          <Stack direction="row" alignItems="center" gap={0.5}>
                            <AccessTimeIcon className="admin-icon-13-gray" />
                            <Typography className="admin-agt-info-label">
                              Response
                            </Typography>
                          </Stack>
                          <Typography className="admin-agt-info-value">
                            {detailAgent.memberResponseTime}
                          </Typography>
                        </Stack>
                      )}
                    </Stack>
                  </Stack>

                  {/* Basic Info */}
                  <Stack className="admin-agt-section-card">
                    <Typography className="admin-agt-section-heading-lg">
                      Basic Information
                    </Typography>
                    <Stack gap={0}>
                      <InfoRow
                        label={t("admin.col.serviceTypes")}
                        value={
                          (detailAgent.memberServiceTypes ?? []).length
                            ? (detailAgent.memberServiceTypes ?? [])
                                .map(prettyEnum)
                                .join(", ")
                            : "—"
                        }
                      />
                      {detailAgent.memberExperience && (
                        <InfoRow
                          label={t("admin.agents.experience")}
                          value={detailAgent.memberExperience}
                        />
                      )}
                      {detailAgent.memberApproach && (
                        <InfoRow
                          label={t("admin.agents.approach")}
                          value={detailAgent.memberApproach}
                        />
                      )}
                      {detailAgent.memberLanguages && (
                        <InfoRow
                          label={t("admin.agents.languages")}
                          value={detailAgent.memberLanguages}
                        />
                      )}
                      <InfoRow
                        label={t("admin.col.joined")}
                        value={formatDate(detailAgent.createdAt, intlLocale)}
                      />
                    </Stack>
                  </Stack>

                  {/* Certifications */}
                  {certificates.length > 0 && (
                    <Stack className="admin-agt-section-card">
                      <Stack direction="row" alignItems="center" gap={1} mb={2}>
                        <WorkspacePremiumIcon className="admin-icon-16-indigo" />
                        <Typography className="admin-agt-section-heading">
                          Certifications
                        </Typography>
                      </Stack>
                      <Stack direction="row" flexWrap="wrap" gap={1.5}>
                        {certificates.map((cert, i) => (
                          <Stack key={i} className="admin-agt-cert-wrap">
                            <Stack className="admin-agt-cert-img-box">
                              <img
                                src={imageUrl(cert)}
                                alt={`Certificate ${i + 1}`}
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.opacity =
                                    "0";
                                }}
                              />
                            </Stack>
                            <Typography className="admin-agt-cert-title">
                              Certificate {i + 1}
                            </Typography>
                          </Stack>
                        ))}
                      </Stack>
                    </Stack>
                  )}
                </Stack>

                {/* Footer */}
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  className="admin-agt-detail-footer"
                >
                  <Button
                    onClick={() => openEdit(detailAgent)}
                    className="admin-agt-footer-edit-btn"
                  >
                    Edit Agent
                  </Button>
                  <Button
                    onClick={() => setDetailOpen(false)}
                    className="admin-agt-footer-close-btn"
                  >
                    Close
                  </Button>
                </Stack>
              </>
            );
          })()}
      </Drawer>

      {/* ── Edit Drawer ───────────────────────────────────── */}
      <Drawer
        anchor="right"
        open={editOpen}
        onClose={() => setEditOpen(false)}
        PaperProps={{ className: "admin-agt-edit-paper" }}
        disablePortal
      >
        {editingAgent && (
          <>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              className="admin-agt-edit-header"
            >
              <Stack>
                <Typography className="admin-agt-edit-title">
                  Edit Agent
                </Typography>
                <Typography className="admin-agt-edit-subtitle">
                  {editingAgent.memberFullName || editingAgent.memberUserName}
                </Typography>
              </Stack>
              <IconButton onClick={() => setEditOpen(false)} size="small">
                <CloseIcon fontSize="small" />
              </IconButton>
            </Stack>

            <Stack className="admin-agt-edit-body">
              {TEXT_FIELDS.map(({ labelKey, field }) => (
                <Stack key={field} gap={0.7}>
                  <Typography className="admin-agt-field-label">
                    {t(labelKey)}
                  </Typography>
                  <TextField
                    size="small"
                    fullWidth
                    value={form[field] as string}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, [field]: e.target.value }))
                    }
                    inputProps={{ style: { color: "#111827" } }}
                    className="admin-agt-input"
                  />
                </Stack>
              ))}

              <Stack gap={0.7}>
                <Typography className="admin-agt-field-label">
                  {t("admin.col.about")}
                </Typography>
                <TextField
                  size="small"
                  fullWidth
                  multiline
                  rows={3}
                  value={form.memberDesc}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, memberDesc: e.target.value }))
                  }
                  inputProps={{ style: { color: "#111827" } }}
                  InputProps={{
                    style: {
                      height: "auto",
                      minHeight: "90px",
                      alignItems: "flex-start",
                    },
                  }}
                  className="admin-agt-input"
                />
              </Stack>

              <Stack gap={0.7}>
                <Typography className="admin-agt-field-label">
                  Service Types
                </Typography>
                <Select
                  size="small"
                  multiple
                  value={form.memberServiceTypes}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      memberServiceTypes: e.target.value as string[],
                    }))
                  }
                  renderValue={(selected) => (
                    <Stack className="admin-chip-row">
                      {(selected as string[]).map((value) => (
                        <Chip
                          key={value}
                          size="small"
                          label={prettyEnum(value)}
                        />
                      ))}
                    </Stack>
                  )}
                  className="admin-agt-select"
                >
                  {SERVICE_TYPES.map((t) => (
                    <MenuItem key={t} value={t}>
                      {prettyEnum(t)}
                    </MenuItem>
                  ))}
                </Select>
              </Stack>

              <Stack gap={0.7}>
                <Typography className="admin-agt-field-label">
                  Service Area
                </Typography>
                <Select
                  size="small"
                  multiple
                  value={form.memberServiceArea}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      memberServiceArea: e.target.value as string[],
                    }))
                  }
                  renderValue={(selected) => (
                    <Stack className="admin-chip-row">
                      {(selected as string[]).map((value) => (
                        <Chip
                          key={value}
                          size="small"
                          label={prettyEnum(value)}
                        />
                      ))}
                    </Stack>
                  )}
                  className="admin-agt-select"
                >
                  {SERVICE_AREAS.map((a) => (
                    <MenuItem key={a} value={a}>
                      {prettyEnum(a)}
                    </MenuItem>
                  ))}
                </Select>
              </Stack>

              <Stack gap={0.7}>
                <Typography className="admin-agt-field-label">
                  Status
                </Typography>
                <Select
                  size="small"
                  value={form.memberStatus}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      memberStatus: e.target.value as MemberStatus,
                    }))
                  }
                  className="admin-agt-select"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <MenuItem key={s} value={s}>
                      {prettyEnum(s)}
                    </MenuItem>
                  ))}
                </Select>
              </Stack>
            </Stack>

            <Stack
              direction="row"
              justifyContent="flex-end"
              gap={1.5}
              className="admin-agt-edit-footer"
            >
              <Button
                onClick={() => setEditOpen(false)}
                className="admin-agt-cancel-btn"
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={saveEdit}
                disabled={isSaving}
                className="admin-agt-save-btn"
              >
                {isSaving ? "Saving…" : "Save Changes"}
              </Button>
            </Stack>
          </>
        )}
      </Drawer>
    </Stack>
  );
};

export default AgentsManager;
