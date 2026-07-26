import { ChangeEvent, useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Divider,
  Input,
  MenuItem,
  Pagination,
  PaginationItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import FilterListIcon from "@mui/icons-material/FilterList";
import { useQuery, useReactiveVar } from "@apollo/client";
import AgentCard from "./AgentCard";
import useDeviceDetect from "@/libs/hooks/useDeviceDetect";
import MobileDrawer from "../common/MobileDrawer";
import { userVar } from "@/apollo/store";
import { GET_AGENTS } from "@/apollo/user/query";
import { AgentsInquiry } from "@/libs/types/member/member.input";
import { Member } from "@/libs/types/member/member";
import { Direction, Message } from "@/libs/enums/common.enum";
import { ServiceLocation, ServiceType } from "@/libs/enums/service.enum";
import { T } from "@/libs/types/common";

type SortOption = "newest" | "rating" | "likes" | "views";

const SORT_OPTIONS: {
  value: SortOption;
  label: string;
  sort: string;
  direction: Direction;
}[] = [
  {
    value: "newest",
    label: "Newest",
    sort: "createdAt",
    direction: Direction.DESC,
  },
  {
    value: "rating",
    label: "Highest Rating",
    sort: "memberRating",
    direction: Direction.DESC,
  },
  {
    value: "likes",
    label: "Most Liked",
    sort: "memberLikes",
    direction: Direction.DESC,
  },
  {
    value: "views",
    label: "Most Viewed",
    sort: "memberViews",
    direction: Direction.DESC,
  },
];

const SERVICE_TYPE_OPTIONS: { label: string; value: ServiceType }[] = [
  { label: "Day Care", value: ServiceType.DAY_CARE },
  { label: "Walking", value: ServiceType.WALKING },
  { label: "Grooming", value: ServiceType.GROOMING },
  { label: "Boarding", value: ServiceType.BOARDING },
  { label: "Training", value: ServiceType.TRAINING },
  { label: "Veterinary", value: ServiceType.VETERINARY },
];

const SERVICE_AREA_OPTIONS: { label: string; value: ServiceLocation }[] = [
  { label: "Seoul", value: ServiceLocation.SEOUL },
  { label: "Busan", value: ServiceLocation.BUSAN },
  { label: "Incheon", value: ServiceLocation.INCHEON },
  { label: "Daegu", value: ServiceLocation.DAEGU },
  { label: "Suwon", value: ServiceLocation.SUWON },
  { label: "Gyeongju", value: ServiceLocation.GYEONGJU },
  { label: "Gwangju", value: ServiceLocation.GWANGJU },
  { label: "Jeonju", value: ServiceLocation.JEONJU },
  { label: "Daejeon", value: ServiceLocation.DAEJEON },
  { label: "Jeju", value: ServiceLocation.JEJU },
];

const initialInput: AgentsInquiry = {
  page: 1,
  limit: 6,
  sort: "createdAt",
  direction: Direction.DESC,
  search: {},
};

interface AgentsProps {
  initialInput?: AgentsInquiry;
}

const Agents = ({ initialInput: propInput = initialInput }: AgentsProps) => {
  const device = useDeviceDetect();
  const user = useReactiveVar(userVar);

  const [searchFilter, setSearchFilter] = useState<AgentsInquiry>(propInput);
  const [agents, setAgents] = useState<Member[]>([]);
  const [total, setTotal] = useState<number>(0);

  const [searchText, setSearchText] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  const [isTypeOpen, setIsTypeOpen] = useState(true);
  const [isAreaOpen, setIsAreaOpen] = useState(true);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const listTopRef = useRef<HTMLDivElement | null>(null);

  /** APOLLO REQUESTS **/

  const { loading: getAgentsLoading, refetch: getAgentsRefetch } = useQuery(
    GET_AGENTS,
    {
      fetchPolicy: "cache-and-network", // cache + => network
      variables: { input: searchFilter },
      notifyOnNetworkStatusChange: true,
      onCompleted: (data: T) => {
        setAgents(data?.getAgents?.list ?? []);
        setTotal(data?.getAgents?.metaCounter?.[0]?.total ?? 0);
      },
      // The API throws "No data found!" instead of returning an empty list, so
      // clear the previous results to let the no-data empty state render.
      onError: (error) => {
        if (
          error.graphQLErrors?.some((e) => e.message === Message.NO_DATA_FOUND)
        ) {
          setAgents([]);
          setTotal(0);
        }
      },
    },
  );

  /** LIFECYCLES **/

  // meLiked is computed server-side from the auth token, so re-run the query
  // whenever the logged-in member changes (login / logout / reload).
  useEffect(() => {
    getAgentsRefetch({ input: searchFilter });
  }, [user?._id]);

  // Debounced live search: apply the typed text to the query a short beat after
  // the user stops typing — updates results while typing without firing a
  // request on every keystroke. Enter / the search button apply immediately.
  useEffect(() => {
    const nextText = searchText.trim() || undefined;
    const timer = setTimeout(() => {
      setSearchFilter((prev) =>
        prev.search.text === nextText
          ? prev
          : { ...prev, page: 1, search: { ...prev.search, text: nextText } },
      );
    }, 400);
    return () => clearTimeout(timer);
  }, [searchText]);

  /** DERIVED **/

  const selectedTypes = searchFilter.search.memberServiceTypes ?? [];
  const selectedAreas = searchFilter.search.memberServiceArea ?? [];
  const totalPages = Math.max(1, Math.ceil(total / searchFilter.limit));
  const activeFilterCount = selectedTypes.length + selectedAreas.length;

  /** HANDLERS **/

  const typeToggleHandler = (value: ServiceType) => {
    setSearchFilter((prev) => {
      const current = prev.search.memberServiceTypes ?? [];
      const next = current.includes(value)
        ? current.filter((t) => t !== value)
        : [...current, value];
      return {
        ...prev,
        page: 1,
        search: {
          ...prev.search,
          memberServiceTypes: next.length ? next : undefined,
        },
      };
    });
  };

  const areaToggleHandler = (value: ServiceLocation) => {
    setSearchFilter((prev) => {
      const current = prev.search.memberServiceArea ?? [];
      const next = current.includes(value)
        ? current.filter((a) => a !== value)
        : [...current, value];
      return {
        ...prev,
        page: 1,
        search: {
          ...prev.search,
          memberServiceArea: next.length ? next : undefined,
        },
      };
    });
  };

  const searchApplyHandler = () => {
    const text = searchText.trim();
    setSearchFilter((prev) => ({
      ...prev,
      page: 1,
      search: { ...prev.search, text: text.length ? text : undefined },
    }));
  };

  const sortHandler = (value: SortOption) => {
    setSortBy(value);
    const option = SORT_OPTIONS.find((o) => o.value === value);
    if (!option) return;
    setSearchFilter((prev) => ({
      ...prev,
      page: 1,
      sort: option.sort,
      direction: option.direction,
    }));
  };

  const paginationHandler = (_event: ChangeEvent<unknown>, page: number) => {
    setSearchFilter((prev) => ({ ...prev, page }));
    if (!listTopRef.current) return;
    const scrollTarget =
      window.scrollY + listTopRef.current.getBoundingClientRect().top - 210;
    window.scrollTo({ top: Math.max(0, scrollTarget), behavior: "smooth" });
  };

  const sidebarContent = (
    <>
      <Box className="search-box">
        <Input
          placeholder="Search agents..."
          disableUnderline
          className="text-field"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") searchApplyHandler();
          }}
        />
        <Button className="search-button" onClick={searchApplyHandler}>
          <SearchIcon />
        </Button>
      </Box>

      <Divider className="divider" />

      <Stack className="category-section">
        <Stack
          className="category-header"
          onClick={() => setIsTypeOpen((p) => !p)}
        >
          <Typography className="category-title">Service Type</Typography>
          <Box
            className={`category-toggle ${isTypeOpen ? "is-open" : ""}`}
            aria-hidden="true"
          />
        </Stack>
        <Stack className={`category-list ${isTypeOpen ? "is-open" : ""}`}>
          {SERVICE_TYPE_OPTIONS.map((type) => (
            <Stack
              key={type.value}
              className={`category-option ${selectedTypes.includes(type.value) ? "is-selected" : ""}`}
              onClick={() => typeToggleHandler(type.value)}
            >
              <Box className="category-checkbox" aria-hidden="true" />
              <Typography className="category-label">{type.label}</Typography>
            </Stack>
          ))}
        </Stack>
      </Stack>

      <Divider className="divider" />

      <Stack className="category-section">
        <Stack
          className="category-header"
          onClick={() => setIsAreaOpen((p) => !p)}
        >
          <Typography className="category-title">Service Area</Typography>
          <Box
            className={`category-toggle ${isAreaOpen ? "is-open" : ""}`}
            aria-hidden="true"
          />
        </Stack>
        <Stack className={`category-list ${isAreaOpen ? "is-open" : ""}`}>
          {SERVICE_AREA_OPTIONS.map((area) => (
            <Stack
              key={area.value}
              className={`category-option ${selectedAreas.includes(area.value) ? "is-selected" : ""}`}
              onClick={() => areaToggleHandler(area.value)}
            >
              <Box className="category-checkbox" aria-hidden="true" />
              <Typography className="category-label">{area.label}</Typography>
            </Stack>
          ))}
        </Stack>
      </Stack>
    </>
  );

  return (
    <Stack className="agents-listing-page">
      <Stack className="container">
        <Box className="agents-page-title">Find Your Agent</Box>
        <Stack className="agents-main">
          {/* ── Sidebar (desktop) / Filter trigger (mobile) ── */}
          {device === "mobile" ? (
            <Button
              className="mobile-filter-trigger"
              onClick={() => setIsFilterDrawerOpen(true)}
            >
              <FilterListIcon fontSize="small" />
              Filters
              {activeFilterCount > 0 && (
                <Box className="mobile-filter-trigger-count">
                  {activeFilterCount}
                </Box>
              )}
            </Button>
          ) : (
            <Stack className="category">{sidebarContent}</Stack>
          )}

          {/* ── Grid ── */}
          <Stack className="sorting-agents" ref={listTopRef}>
            <Box className="filter-section-wrap">
              <Select
                value={sortBy}
                onChange={(e) => sortHandler(e.target.value as SortOption)}
                className="filter-section"
                MenuProps={{
                  disableScrollLock: true,
                  PaperProps: { className: "filter-menu" },
                  MenuListProps: { className: "filter-menu-list" },
                }}
              >
                {SORT_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </Box>

            <Stack className="agents-cards">
              {agents.length !== 0 ? (
                agents.map((agent) => (
                  <AgentCard
                    key={agent._id}
                    agent={agent}
                    getAgentsRefetch={getAgentsRefetch}
                  />
                ))
              ) : !getAgentsLoading ? (
                <Box className="no-data-wrap">
                  <img
                    src="/img/icons/no-data.png"
                    alt="No agents found"
                    className="no-data-img"
                  />
                </Box>
              ) : null}

              <Stack className="pagination-section">
                {agents.length !== 0 && (
                  <Pagination
                    count={totalPages}
                    page={searchFilter.page}
                    renderItem={(item) => (
                      <PaginationItem
                        components={{
                          previous: ArrowBackIcon,
                          next: ArrowForwardIcon,
                        }}
                        {...item}
                        color="primary"
                      />
                    )}
                    onChange={paginationHandler}
                  />
                )}
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </Stack>

      {device === "mobile" && (
        <MobileDrawer
          open={isFilterDrawerOpen}
          onClose={() => setIsFilterDrawerOpen(false)}
          title="Filters"
          primaryAction={{
            label: `Show ${total} agent${total === 1 ? "" : "s"}`,
            onClick: () => setIsFilterDrawerOpen(false),
          }}
        >
          <Stack className="category mobile-filter-panel">
            {sidebarContent}
          </Stack>
        </MobileDrawer>
      )}
    </Stack>
  );
};

export default Agents;
