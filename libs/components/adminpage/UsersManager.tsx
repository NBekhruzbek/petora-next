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
} from "@mui/material";
import { mockUsers, AdminUser, UserStatus } from "../../data/adminMockData";

const STATUS_OPTIONS: UserStatus[] = ["active", "paused", "blocked"];

const UsersManager = () => {
  const [users, setUsers] = useState<AdminUser[]>(
    mockUsers.filter((u) => u.memberType === "USER"),
  );
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"ALL" | UserStatus>("ALL");

  const filtered = useMemo(
    () =>
      users.filter((u) => {
        if (filterStatus !== "ALL" && u.status !== filterStatus) return false;
        const q = search.toLowerCase();
        return (
          !q ||
          u.fullName.toLowerCase().includes(q) ||
          u.username.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q)
        );
      }),
    [users, search, filterStatus],
  );

  const changeStatus = (id: string, status: UserStatus) =>
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status } : u)));

  return (
    <Stack gap={0}>
      <Stack className="admin-page-header">
        <Typography className="admin-page-title">Users</Typography>
      </Stack>

      <Stack className="admin-card">
        <Stack className="admin-toolbar">
          <TextField
            size="small"
            placeholder="Search name, username, email…"
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
            sx={{ width: 150 }}
          >
            <MenuItem value="ALL">All Statuses</MenuItem>
            {STATUS_OPTIONS.map((s) => (
              <MenuItem key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </MenuItem>
            ))}
          </Select>
          <Typography className="admin-meta-count">
            {filtered.length} of {users.length}
          </Typography>
        </Stack>

        <TableContainer>
          <Table className="admin-table">
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Username</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Joined</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Stack className="admin-name-cell">
                      <img
                        src={user.avatar}
                        alt={user.fullName}
                        className="admin-table-avatar"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName)}&background=6366f1&color=fff`;
                        }}
                      />
                      <Typography className="admin-cell-name">
                        {user.fullName}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Typography className="admin-cell-meta">
                      @{user.username}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography className="admin-cell-meta">
                      {user.email}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={user.status}
                      onChange={(e) =>
                        changeStatus(user.id, e.target.value as UserStatus)
                      }
                      size="small"
                      className="admin-status-select"
                      renderValue={(val) => (
                        <span className={`status-chip status-${val}`}>
                          {val}
                        </span>
                      )}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <MenuItem key={s} value={s}>
                          <span className={`status-chip status-${s}`}>{s}</span>
                        </MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Typography className="admin-cell-date">
                      {user.joinDate}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                    <Typography className="admin-table-empty">
                      No users found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
    </Stack>
  );
};

export default UsersManager;
