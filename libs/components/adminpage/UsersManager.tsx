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
  Pagination,
} from "@mui/material";
import { useMutation, useQuery } from "@apollo/client";
import { GET_ALL_USERS_BY_ADMIN } from "@/apollo/admin/query";
import { UPDATE_MEMBER_BY_ADMIN } from "@/apollo/admin/mutation";
import { Member } from "@/libs/types/member/member";
import { MembersInquiry } from "@/libs/types/member/member.input";
import { MemberStatus } from "@/libs/enums/member.enum";
import { Direction } from "@/libs/enums/common.enum";
import {
  sweetBottomSmallSuccessAlert,
  sweetMixinErrorAlert,
} from "@/libs/sweetAlert";
import {
  avatarUrl,
  formatDate,
  isNoDataError,
  metaTotal,
  prettyEnum,
  statusChipClass,
  useDebouncedValue,
} from "./adminHelpers";

const USERS_PER_PAGE = 10;

// Members have no "paused" state — the schema only knows these three.
const STATUS_OPTIONS: MemberStatus[] = [
  MemberStatus.ACTIVE,
  MemberStatus.BLOCK,
  MemberStatus.DELETE,
];

const UsersManager = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"ALL" | MemberStatus>("ALL");
  const debouncedSearch = useDebouncedValue(search);

  /** APOLLO REQUESTS **/

  const searchFilter: MembersInquiry = {
    page,
    limit: USERS_PER_PAGE,
    sort: "createdAt",
    direction: Direction.DESC,
    search: {
      // The API regexes memberUserName for `text`.
      ...(debouncedSearch.trim() ? { text: debouncedSearch.trim() } : {}),
      ...(filterStatus === "ALL" ? {} : { memberStatus: filterStatus }),
    },
  };

  const {
    data: usersData,
    previousData: usersPreviousData,
    error: usersError,
    refetch: usersRefetch,
  } = useQuery(GET_ALL_USERS_BY_ADMIN, {
    fetchPolicy: "cache-and-network",
    variables: { input: searchFilter },
    notifyOnNetworkStatusChange: true,
  });

  const [updateMemberByAdmin] = useMutation(UPDATE_MEMBER_BY_ADMIN);

  /** DERIVED **/

  // Keep the previous page on screen while the next one loads — Apollo empties
  // `data` when the variables change, which would otherwise flash the empty row.
  const usersResult = usersData ?? usersPreviousData;
  // getAllUsersByAdmin rejects with "No data found!" rather than returning [].
  const users: Member[] = isNoDataError(usersError)
    ? []
    : (usersResult?.getAllUsersByAdmin?.list ?? []);
  const total = isNoDataError(usersError)
    ? 0
    : metaTotal(usersResult?.getAllUsersByAdmin?.metaCounter);
  const totalPages = Math.max(1, Math.ceil(total / USERS_PER_PAGE));

  /** HANDLERS **/

  const refreshUsers = async () => {
    try {
      await usersRefetch({ input: searchFilter });
    } catch {
      /* an emptied list surfaces through usersError */
    }
  };

  const changeStatus = async (member: Member, memberStatus: MemberStatus) => {
    if (member.memberStatus === memberStatus) return;
    try {
      await updateMemberByAdmin({
        variables: { input: { _id: member._id, memberStatus } },
      });
      await refreshUsers();
      await sweetBottomSmallSuccessAlert("User updated!", 700);
    } catch (err: any) {
      console.log("ERROR, changeStatus:", err.message);
      await sweetMixinErrorAlert(err.message);
    }
  };

  const resetToFirstPage = () => setPage(1);

  return (
    <Stack gap={0}>
      <Stack className="admin-page-header">
        <Typography className="admin-page-title">Users</Typography>
      </Stack>

      <Stack className="admin-card">
        <Stack className="admin-toolbar">
          <TextField
            size="small"
            placeholder="Search username…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              resetToFirstPage();
            }}
            className="admin-toolbar-search admin-usr-search"
          />
          <Select
            size="small"
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value as "ALL" | MemberStatus);
              resetToFirstPage();
            }}
            className="admin-toolbar-select admin-usr-status-filter"
          >
            <MenuItem value="ALL">All Statuses</MenuItem>
            {STATUS_OPTIONS.map((s) => (
              <MenuItem key={s} value={s}>
                {prettyEnum(s)}
              </MenuItem>
            ))}
          </Select>
          <Typography className="admin-meta-count">
            {users.length} of {total}
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
              {users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>
                    <Stack className="admin-name-cell">
                      <img
                        src={avatarUrl(
                          user.memberImage,
                          user.memberFullName || user.memberUserName,
                        )}
                        alt={user.memberUserName}
                        className="admin-table-avatar"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = avatarUrl(
                            undefined,
                            user.memberFullName || user.memberUserName,
                          );
                        }}
                      />
                      <Typography className="admin-cell-name">
                        {user.memberFullName || user.memberUserName}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Typography className="admin-cell-meta">
                      @{user.memberUserName}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography className="admin-cell-meta">
                      {user.memberEmail || "—"}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={user.memberStatus}
                      onChange={(e) =>
                        changeStatus(user, e.target.value as MemberStatus)
                      }
                      size="small"
                      className="admin-status-select"
                      renderValue={(val) => (
                        <span className={statusChipClass(val as string)}>
                          {val as string}
                        </span>
                      )}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <MenuItem key={s} value={s}>
                          <span className={statusChipClass(s)}>{s}</span>
                        </MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Typography className="admin-cell-date">
                      {formatDate(user.createdAt)}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
              {users.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    align="center"
                    className="admin-usr-empty-cell"
                  >
                    <Typography className="admin-table-empty">
                      No users found
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
    </Stack>
  );
};

export default UsersManager;
