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
  Rating,
  Switch,
  FormControlLabel,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import VerifiedIcon from "@mui/icons-material/Verified";
import PlaceIcon from "@mui/icons-material/Place";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import { mockAgents, AdminAgent, UserStatus } from "../../data/adminMockData";

const STATUS_OPTIONS: UserStatus[] = ["active", "paused", "blocked"];
const SERVICE_TYPES = [
  "Grooming",
  "Training",
  "Walking",
  "Boarding",
  "Day-care",
  "Health",
];

// ─── Status color map ─────────────────────────────────────────────────────
const STATUS_STYLE: Record<UserStatus, { bg: string; color: string }> = {
  active: { bg: "#ECFDF5", color: "#059669" },
  paused: { bg: "#FFFBEB", color: "#D97706" },
  blocked: { bg: "#FEF2F2", color: "#DC2626" },
  deleted: { bg: "#F3F4F6", color: "#6B7280" },
};

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
  const [agents, setAgents] = useState<AdminAgent[]>(mockAgents);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"ALL" | UserStatus>("ALL");

  // Edit drawer
  const [editOpen, setEditOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState<AdminAgent | null>(null);
  const [form, setForm] = useState<
    Pick<
      AdminAgent,
      | "fullName"
      | "username"
      | "email"
      | "phone"
      | "serviceType"
      | "role"
      | "status"
      | "verified"
      | "serviceArea"
      | "experience"
      | "approach"
      | "languages"
      | "responseTime"
    >
  >({
    fullName: "",
    username: "",
    email: "",
    phone: "",
    serviceType: "Grooming",
    role: "",
    status: "active",
    verified: false,
    serviceArea: "",
    experience: "",
    approach: "",
    languages: "",
    responseTime: "",
  });

  // Detail drawer
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailAgent, setDetailAgent] = useState<AdminAgent | null>(null);

  const filtered = useMemo(
    () =>
      agents.filter((a) => {
        if (filterStatus !== "ALL" && a.status !== filterStatus) return false;
        const q = search.toLowerCase();
        return (
          !q ||
          a.fullName.toLowerCase().includes(q) ||
          a.email.toLowerCase().includes(q) ||
          a.serviceType.toLowerCase().includes(q)
        );
      }),
    [agents, search, filterStatus],
  );

  const changeStatus = (id: string, status: UserStatus) =>
    setAgents((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));

  const openEdit = (agent: AdminAgent) => {
    setEditingAgent(agent);
    setForm({
      fullName: agent.fullName,
      username: agent.username,
      email: agent.email,
      phone: agent.phone ?? "",
      serviceType: agent.serviceType,
      role: agent.role ?? "",
      status: agent.status,
      verified: agent.verified,
      serviceArea: agent.serviceArea ?? "",
      experience: agent.experience ?? "",
      approach: agent.approach ?? "",
      languages: agent.languages ?? "",
      responseTime: agent.responseTime ?? "",
    });
    setEditOpen(true);
  };

  const saveEdit = () => {
    if (!editingAgent) return;
    setAgents((prev) =>
      prev.map((a) => (a.id === editingAgent.id ? { ...a, ...form } : a)),
    );
    setEditOpen(false);
  };

  const openDetail = (agent: AdminAgent) => {
    setDetailAgent(agent);
    setDetailOpen(true);
  };

  return (
    <Stack gap={0}>
      <Stack className="admin-page-header">
        <Typography className="admin-page-title">Agents</Typography>
        <Typography className="admin-agt-pending-count">
          {agents.filter((a) => a.status === "paused").length} pending approval
        </Typography>
      </Stack>

      <Stack className="admin-card">
        <Stack className="admin-toolbar">
          <TextField
            size="small"
            placeholder="Search name, email, service…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="admin-toolbar-search admin-agt-search"
          />
          <Select
            size="small"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="admin-toolbar-select admin-agt-status-filter"
          >
            <MenuItem value="ALL">All Statuses</MenuItem>
            {STATUS_OPTIONS.map((s) => (
              <MenuItem key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </MenuItem>
            ))}
          </Select>
          <Typography className="admin-meta-count">
            {filtered.length} of {agents.length}
          </Typography>
        </Stack>

        <TableContainer>
          <Table className="admin-table">
            <TableHead>
              <TableRow>
                <TableCell>Agent</TableCell>
                <TableCell>Service</TableCell>
                <TableCell>Rating</TableCell>
                <TableCell>Bookings</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Joined</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((agent) => (
                <TableRow key={agent.id}>
                  <TableCell>
                    <Stack className="admin-name-cell">
                      <Stack className="admin-agt-avatar-wrap">
                        <img
                          src={agent.avatar}
                          alt={agent.fullName}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              `https://ui-avatars.com/api/?name=${encodeURIComponent(agent.fullName)}&background=0ea5e9&color=fff`;
                          }}
                        />
                      </Stack>
                      <Stack>
                        <Stack direction="row" alignItems="center" gap={0.5}>
                          <Typography className="admin-agt-name">
                            {agent.fullName}
                          </Typography>
                          {agent.verified && (
                            <VerifiedIcon className="admin-icon-13-blue" />
                          )}
                        </Stack>
                        <Typography className="admin-agt-handle">
                          @{agent.username}
                        </Typography>
                      </Stack>
                    </Stack>
                  </TableCell>
                  <TableCell className="admin-agt-service-cell">
                    {agent.serviceType}
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" alignItems="center" gap={0.5}>
                      <Rating
                        value={agent.rating}
                        precision={0.1}
                        readOnly
                        size="small"
                        className="admin-agt-rating-stars"
                      />
                      <Typography className="admin-agt-rating-value">
                        {agent.rating}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell className="admin-agt-bookings-cell">
                    {agent.totalBookings}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={agent.status}
                      onChange={(e) =>
                        changeStatus(agent.id, e.target.value as UserStatus)
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
                  <TableCell className="admin-agt-joined-cell">
                    {agent.joinDate}
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
            </TableBody>
          </Table>
        </TableContainer>
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
            const ss = STATUS_STYLE[detailAgent.status] ?? STATUS_STYLE.active;
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
                    {/* Cover strip */}
                    <Stack className="admin-agt-cover-strip" />
                    <Stack className="admin-agt-profile-body">
                      {/* Avatar */}
                      <Stack className="admin-agt-avatar-outer">
                        <Stack className="admin-agt-avatar-lg">
                          <img
                            src={detailAgent.avatar}
                            alt={detailAgent.fullName}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                `https://ui-avatars.com/api/?name=${encodeURIComponent(detailAgent.fullName)}&background=6366f1&color=fff&size=72`;
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
                          <Stack direction="row" alignItems="center" gap={0.8}>
                            <Typography className="admin-agt-fullname">
                              {detailAgent.fullName}
                            </Typography>
                            {detailAgent.verified && (
                              <VerifiedIcon className="admin-icon-16-blue" />
                            )}
                          </Stack>
                          {detailAgent.role && (
                            <Typography className="admin-agt-role">
                              {detailAgent.role}
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
                          {detailAgent.status}
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
                            {detailAgent.rating}
                          </Typography>
                          <Rating
                            value={detailAgent.rating}
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
                            {detailAgent.totalBookings}
                          </Typography>
                          <Typography className="admin-agt-stat-label">
                            Bookings
                          </Typography>
                        </Stack>
                        <Stack className="admin-agt-divider-v" />
                        <Stack alignItems="center" flex={1}>
                          <Typography className="admin-agt-stat-value">
                            {(detailAgent.certifications ?? []).length}
                          </Typography>
                          <Typography className="admin-agt-stat-label">
                            Certs
                          </Typography>
                        </Stack>
                      </Stack>
                    </Stack>
                  </Stack>

                  {/* Bio */}
                  {detailAgent.bio && (
                    <Stack className="admin-agt-section-card">
                      <Typography className="admin-agt-section-heading">
                        About
                      </Typography>
                      <Typography className="admin-agt-bio-text">
                        {detailAgent.bio}
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
                        label="Username"
                        value={`@${detailAgent.username}`}
                      />
                      <InfoRow label="Email" value={detailAgent.email} />
                      {detailAgent.phone && (
                        <InfoRow label="Phone" value={detailAgent.phone} />
                      )}
                      {detailAgent.serviceArea && (
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
                            {detailAgent.serviceArea}
                          </Typography>
                        </Stack>
                      )}
                      {detailAgent.responseTime && (
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
                            {detailAgent.responseTime}
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
                        label="Service Type"
                        value={detailAgent.serviceType}
                      />
                      {detailAgent.experience && (
                        <InfoRow
                          label="Experience"
                          value={detailAgent.experience}
                        />
                      )}
                      {detailAgent.approach && (
                        <InfoRow
                          label="Approach"
                          value={detailAgent.approach}
                        />
                      )}
                      {detailAgent.languages && (
                        <InfoRow
                          label="Languages"
                          value={detailAgent.languages}
                        />
                      )}
                      <InfoRow label="Joined" value={detailAgent.joinDate} />
                    </Stack>
                  </Stack>

                  {/* Certifications */}
                  {(detailAgent.certifications ?? []).length > 0 && (
                    <Stack className="admin-agt-section-card">
                      <Stack direction="row" alignItems="center" gap={1} mb={2}>
                        <WorkspacePremiumIcon className="admin-icon-16-indigo" />
                        <Typography className="admin-agt-section-heading">
                          Certifications
                        </Typography>
                      </Stack>
                      <Stack direction="row" flexWrap="wrap" gap={1.5}>
                        {(detailAgent.certifications ?? []).map((cert, i) => (
                          <Stack key={i} className="admin-agt-cert-wrap">
                            <Stack className="admin-agt-cert-img-box">
                              <img
                                src={cert.image}
                                alt={cert.title}
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.opacity =
                                    "0";
                                }}
                              />
                            </Stack>
                            <Typography className="admin-agt-cert-title">
                              {cert.title}
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
                  {editingAgent.fullName}
                </Typography>
              </Stack>
              <IconButton onClick={() => setEditOpen(false)} size="small">
                <CloseIcon fontSize="small" />
              </IconButton>
            </Stack>

            <Stack className="admin-agt-edit-body">
              {[
                { label: "Full Name", field: "fullName" },
                { label: "Username", field: "username" },
                { label: "Email", field: "email" },
                { label: "Phone", field: "phone" },
                { label: "Role / Specialty", field: "role" },
                { label: "Experience", field: "experience" },
                { label: "Service Area", field: "serviceArea" },
                { label: "Approach", field: "approach" },
                { label: "Languages", field: "languages" },
                { label: "Response Time", field: "responseTime" },
              ].map(({ label, field }) => (
                <Stack key={field} gap={0.7}>
                  <Typography className="admin-agt-field-label">
                    {label}
                  </Typography>
                  <TextField
                    size="small"
                    fullWidth
                    value={(form as any)[field]}
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
                  Service Type
                </Typography>
                <Select
                  size="small"
                  value={form.serviceType}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, serviceType: e.target.value }))
                  }
                  className="admin-agt-select"
                >
                  {SERVICE_TYPES.map((t) => (
                    <MenuItem key={t} value={t}>
                      {t}
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
                  value={form.status}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      status: e.target.value as UserStatus,
                    }))
                  }
                  className="admin-agt-select"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <MenuItem key={s} value={s}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
              </Stack>

              <FormControlLabel
                control={
                  <Switch
                    checked={form.verified}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, verified: e.target.checked }))
                    }
                    className="admin-agt-verified-switch"
                  />
                }
                label={
                  <Typography className="admin-agt-verified-label">
                    Verified Agent
                  </Typography>
                }
              />
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
                className="admin-agt-save-btn"
              >
                Save Changes
              </Button>
            </Stack>
          </>
        )}
      </Drawer>
    </Stack>
  );
};

export default AgentsManager;
