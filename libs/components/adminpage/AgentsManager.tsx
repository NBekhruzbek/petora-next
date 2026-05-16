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
  Divider,
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
    sx={{ py: 0.8, borderBottom: "1px solid #F9FAFB" }}
  >
    <Typography
      sx={{
        fontSize: "12px",
        color: "#9CA3AF",
        fontWeight: 600,
        flexShrink: 0,
      }}
    >
      {label}
    </Typography>
    <Typography
      sx={{
        fontSize: "12.5px",
        color: "#374151",
        fontWeight: 600,
        textAlign: "right",
      }}
    >
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
        <Typography sx={{ fontSize: "13px", color: "#9CA3AF" }}>
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
            className="admin-toolbar-search"
            sx={{ width: 260 }}
          />
          <Select
            size="small"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="admin-toolbar-select"
            sx={{ width: 160 }}
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
                      <Stack
                        sx={{
                          width: 36,
                          height: 36,
                          borderRadius: "50%",
                          overflow: "hidden",
                          border: "1.5px solid #E8ECF0",
                          flexShrink: 0,
                        }}
                      >
                        <img
                          src={agent.avatar}
                          alt={agent.fullName}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              `https://ui-avatars.com/api/?name=${encodeURIComponent(agent.fullName)}&background=0ea5e9&color=fff`;
                          }}
                        />
                      </Stack>
                      <Stack>
                        <Stack direction="row" alignItems="center" gap={0.5}>
                          <Typography
                            sx={{
                              fontSize: "13px",
                              fontWeight: 600,
                              color: "#111827",
                            }}
                          >
                            {agent.fullName}
                          </Typography>
                          {agent.verified && (
                            <VerifiedIcon
                              sx={{ fontSize: 13, color: "#3B82F6" }}
                            />
                          )}
                        </Stack>
                        <Typography sx={{ fontSize: "11px", color: "#9CA3AF" }}>
                          @{agent.username}
                        </Typography>
                      </Stack>
                    </Stack>
                  </TableCell>
                  <TableCell sx={{ fontSize: "12px" }}>
                    {agent.serviceType}
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" alignItems="center" gap={0.5}>
                      <Rating
                        value={agent.rating}
                        precision={0.1}
                        readOnly
                        size="small"
                        sx={{ fontSize: "13px" }}
                      />
                      <Typography sx={{ fontSize: "11px", color: "#9CA3AF" }}>
                        {agent.rating}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>
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
                  <TableCell sx={{ color: "#9CA3AF", fontSize: "12px" }}>
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
        PaperProps={{
          sx: {
            width: 500,
            boxShadow: "-8px 0 32px rgba(0,0,0,0.10)",
            background: "#F4F5FA",
            overflowY: "auto",
          },
        }}
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
                  sx={{
                    px: 3,
                    py: 2,
                    background: "#fff",
                    borderBottom: "1px solid #E8ECF0",
                    position: "sticky",
                    top: 0,
                    zIndex: 10,
                  }}
                >
                  <Typography
                    sx={{ fontSize: "16px", fontWeight: 700, color: "#111827" }}
                  >
                    Agent Profile
                  </Typography>
                  <IconButton
                    onClick={() => setDetailOpen(false)}
                    size="small"
                    sx={{
                      color: "#6B7280",
                      "&:hover": { background: "#F3F4F6" },
                    }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Stack>

                <Stack sx={{ p: 2, gap: 2, pb: 14 }}>
                  {/* Profile card */}
                  <Stack
                    sx={{
                      background: "#fff",
                      borderRadius: "16px",
                      border: "1px solid #F0F1F5",
                      overflow: "hidden",
                    }}
                  >
                    {/* Cover strip */}
                    <Stack
                      sx={{
                        height: 72,
                        background: "linear-gradient(135deg, #EEF2FF, #E0E7FF)",
                      }}
                    />
                    <Stack sx={{ px: 2.5, pb: 2.5 }}>
                      {/* Avatar */}
                      <Stack sx={{ mt: -4, mb: 1.5 }}>
                        <Stack
                          sx={{
                            width: 72,
                            height: 72,
                            borderRadius: "50%",
                            overflow: "hidden",
                            border: "3px solid #fff",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
                          }}
                        >
                          <img
                            src={detailAgent.avatar}
                            alt={detailAgent.fullName}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              display: "block",
                            }}
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
                            <Typography
                              sx={{
                                fontSize: "18px",
                                fontWeight: 800,
                                color: "#111827",
                              }}
                            >
                              {detailAgent.fullName}
                            </Typography>
                            {detailAgent.verified && (
                              <VerifiedIcon
                                sx={{ fontSize: 16, color: "#3B82F6" }}
                              />
                            )}
                          </Stack>
                          {detailAgent.role && (
                            <Typography
                              sx={{
                                fontSize: "12.5px",
                                color: "#6B7280",
                                mt: 0.3,
                              }}
                            >
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
                        sx={{ mt: 2, pt: 2, borderTop: "1px solid #F3F4F6" }}
                      >
                        <Stack alignItems="center" flex={1}>
                          <Typography
                            sx={{
                              fontSize: "20px",
                              fontWeight: 800,
                              color: "#111827",
                            }}
                          >
                            {detailAgent.rating}
                          </Typography>
                          <Rating
                            value={detailAgent.rating}
                            readOnly
                            size="small"
                            sx={{ fontSize: "12px" }}
                          />
                          <Typography
                            sx={{
                              fontSize: "10px",
                              color: "#9CA3AF",
                              fontWeight: 600,
                              textTransform: "uppercase",
                              letterSpacing: "0.05em",
                              mt: 0.3,
                            }}
                          >
                            Rating
                          </Typography>
                        </Stack>
                        <Stack
                          sx={{
                            width: "1px",
                            alignSelf: "stretch",
                            background: "#E5E7EB",
                          }}
                        />
                        <Stack alignItems="center" flex={1}>
                          <Typography
                            sx={{
                              fontSize: "20px",
                              fontWeight: 800,
                              color: "#111827",
                            }}
                          >
                            {detailAgent.totalBookings}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: "10px",
                              color: "#9CA3AF",
                              fontWeight: 600,
                              textTransform: "uppercase",
                              letterSpacing: "0.05em",
                              mt: 0.3,
                            }}
                          >
                            Bookings
                          </Typography>
                        </Stack>
                        <Stack
                          sx={{
                            width: "1px",
                            alignSelf: "stretch",
                            background: "#E5E7EB",
                          }}
                        />
                        <Stack alignItems="center" flex={1}>
                          <Typography
                            sx={{
                              fontSize: "20px",
                              fontWeight: 800,
                              color: "#111827",
                            }}
                          >
                            {(detailAgent.certifications ?? []).length}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: "10px",
                              color: "#9CA3AF",
                              fontWeight: 600,
                              textTransform: "uppercase",
                              letterSpacing: "0.05em",
                              mt: 0.3,
                            }}
                          >
                            Certs
                          </Typography>
                        </Stack>
                      </Stack>
                    </Stack>
                  </Stack>

                  {/* Bio */}
                  {detailAgent.bio && (
                    <Stack
                      sx={{
                        background: "#fff",
                        borderRadius: "14px",
                        border: "1px solid #F0F1F5",
                        p: 2.5,
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "11px",
                          fontWeight: 700,
                          color: "#9CA3AF",
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                          mb: 1.2,
                        }}
                      >
                        About
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "13px",
                          color: "#374151",
                          lineHeight: 1.75,
                        }}
                      >
                        {detailAgent.bio}
                      </Typography>
                    </Stack>
                  )}

                  {/* Contact & Location */}
                  <Stack
                    sx={{
                      background: "#fff",
                      borderRadius: "14px",
                      border: "1px solid #F0F1F5",
                      p: 2.5,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "11px",
                        fontWeight: 700,
                        color: "#9CA3AF",
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        mb: 1.5,
                      }}
                    >
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
                          sx={{ py: 0.8, borderBottom: "1px solid #F9FAFB" }}
                        >
                          <Stack direction="row" alignItems="center" gap={0.5}>
                            <PlaceIcon
                              sx={{ fontSize: 13, color: "#9CA3AF" }}
                            />
                            <Typography
                              sx={{
                                fontSize: "12px",
                                color: "#9CA3AF",
                                fontWeight: 600,
                              }}
                            >
                              Service Area
                            </Typography>
                          </Stack>
                          <Typography
                            sx={{
                              fontSize: "12.5px",
                              color: "#374151",
                              fontWeight: 600,
                            }}
                          >
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
                          sx={{ py: 0.8 }}
                        >
                          <Stack direction="row" alignItems="center" gap={0.5}>
                            <AccessTimeIcon
                              sx={{ fontSize: 13, color: "#9CA3AF" }}
                            />
                            <Typography
                              sx={{
                                fontSize: "12px",
                                color: "#9CA3AF",
                                fontWeight: 600,
                              }}
                            >
                              Response
                            </Typography>
                          </Stack>
                          <Typography
                            sx={{
                              fontSize: "12.5px",
                              color: "#374151",
                              fontWeight: 600,
                            }}
                          >
                            {detailAgent.responseTime}
                          </Typography>
                        </Stack>
                      )}
                    </Stack>
                  </Stack>

                  {/* Basic Info */}
                  <Stack
                    sx={{
                      background: "#fff",
                      borderRadius: "14px",
                      border: "1px solid #F0F1F5",
                      p: 2.5,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "11px",
                        fontWeight: 700,
                        color: "#9CA3AF",
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        mb: 1.5,
                      }}
                    >
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
                    <Stack
                      sx={{
                        background: "#fff",
                        borderRadius: "14px",
                        border: "1px solid #F0F1F5",
                        p: 2.5,
                      }}
                    >
                      <Stack direction="row" alignItems="center" gap={1} mb={2}>
                        <WorkspacePremiumIcon
                          sx={{ fontSize: 16, color: "#6366F1" }}
                        />
                        <Typography
                          sx={{
                            fontSize: "11px",
                            fontWeight: 700,
                            color: "#9CA3AF",
                            textTransform: "uppercase",
                            letterSpacing: "0.08em",
                          }}
                        >
                          Certifications
                        </Typography>
                      </Stack>
                      <Stack direction="row" flexWrap="wrap" gap={1.5}>
                        {(detailAgent.certifications ?? []).map((cert, i) => (
                          <Stack key={i} sx={{ width: 130, gap: 1 }}>
                            <Stack
                              sx={{
                                height: 90,
                                borderRadius: "10px",
                                overflow: "hidden",
                                border: "1px solid #E8ECF0",
                                background: "#F9FAFB",
                              }}
                            >
                              <img
                                src={cert.image}
                                alt={cert.title}
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "contain",
                                  padding: "6px",
                                  display: "block",
                                }}
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.opacity =
                                    "0";
                                }}
                              />
                            </Stack>
                            <Typography
                              sx={{
                                fontSize: "11px",
                                fontWeight: 600,
                                color: "#374151",
                                lineHeight: 1.4,
                                textAlign: "center",
                              }}
                            >
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
                    onClick={() => openEdit(detailAgent)}
                    sx={{
                      textTransform: "none",
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "#6366F1",
                      border: "1px solid #E0E7FF",
                      borderRadius: "10px",
                      height: "40px",
                      px: 2.5,
                      "&:hover": { background: "#EEF2FF" },
                    }}
                  >
                    Edit Agent
                  </Button>
                  <Button
                    onClick={() => setDetailOpen(false)}
                    sx={{
                      textTransform: "none",
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "#6B7280",
                      border: "1px solid #E8ECF0",
                      borderRadius: "10px",
                      height: "40px",
                      px: 3,
                      "&:hover": { background: "#F9FAFB" },
                    }}
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
        PaperProps={{
          sx: {
            width: 500,
            boxShadow: "-4px 0 24px rgba(0,0,0,0.08)",
            background: "#F4F5FA",
            overflowY: "auto",
          },
        }}
      >
        {editingAgent && (
          <>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
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
              <Stack>
                <Typography
                  sx={{ fontSize: "16px", fontWeight: 700, color: "#111827" }}
                >
                  Edit Agent
                </Typography>
                <Typography
                  sx={{ fontSize: "12px", color: "#9CA3AF", mt: 0.2 }}
                >
                  {editingAgent.fullName}
                </Typography>
              </Stack>
              <IconButton onClick={() => setEditOpen(false)} size="small">
                <CloseIcon fontSize="small" />
              </IconButton>
            </Stack>

            <Stack sx={{ p: 2.5, gap: 2, pb: 14 }}>
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
                  <Typography
                    sx={{
                      fontSize: "11px",
                      fontWeight: 700,
                      color: "#9CA3AF",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                    }}
                  >
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
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        height: 42,
                        borderRadius: "10px",
                        fontSize: "14px",
                        color: "#111827",
                        background: "#fff",
                        "& fieldset": { borderColor: "#E5E7EB" },
                        "&:hover fieldset": { borderColor: "#C7D2FE" },
                        "&.Mui-focused fieldset": {
                          borderColor: "#6366F1",
                          borderWidth: "1.5px",
                        },
                      },
                    }}
                  />
                </Stack>
              ))}

              <Stack gap={0.7}>
                <Typography
                  sx={{
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "#9CA3AF",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}
                >
                  Service Type
                </Typography>
                <Select
                  size="small"
                  value={form.serviceType}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, serviceType: e.target.value }))
                  }
                  sx={{
                    height: 42,
                    borderRadius: "10px",
                    fontSize: "14px",
                    color: "#111827",
                    background: "#fff",
                    "& fieldset": { borderColor: "#E5E7EB" },
                    "&:hover fieldset": { borderColor: "#C7D2FE" },
                    "&.Mui-focused fieldset": { borderColor: "#6366F1" },
                    "& .MuiSelect-icon": { color: "#9CA3AF" },
                  }}
                >
                  {SERVICE_TYPES.map((t) => (
                    <MenuItem key={t} value={t}>
                      {t}
                    </MenuItem>
                  ))}
                </Select>
              </Stack>

              <Stack gap={0.7}>
                <Typography
                  sx={{
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "#9CA3AF",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}
                >
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
                  sx={{
                    height: 42,
                    borderRadius: "10px",
                    fontSize: "14px",
                    color: "#111827",
                    background: "#fff",
                    "& fieldset": { borderColor: "#E5E7EB" },
                    "&:hover fieldset": { borderColor: "#C7D2FE" },
                    "&.Mui-focused fieldset": { borderColor: "#6366F1" },
                    "& .MuiSelect-icon": { color: "#9CA3AF" },
                  }}
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
                    sx={{
                      "& .MuiSwitch-switchBase.Mui-checked": {
                        color: "#6366F1",
                      },
                      "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                        { backgroundColor: "#6366F1" },
                    }}
                  />
                }
                label={
                  <Typography
                    sx={{ fontSize: "14px", fontWeight: 600, color: "#374151" }}
                  >
                    Verified Agent
                  </Typography>
                }
              />
            </Stack>

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
                onClick={() => setEditOpen(false)}
                sx={{
                  textTransform: "none",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#6B7280",
                  border: "1px solid #E8ECF0",
                  borderRadius: "9px",
                  height: "38px",
                  px: 2,
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={saveEdit}
                sx={{
                  textTransform: "none",
                  fontSize: "13px",
                  fontWeight: 700,
                  color: "#ffffff",
                  backgroundColor: "#6366F1",
                  boxShadow: "none",
                  borderRadius: "9px",
                  height: "38px",
                  px: 3,
                  "&:hover": { backgroundColor: "#5254CC", boxShadow: "none" },
                }}
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
