import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
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
import { mockAgents } from "@/libs/data/adminMockData";
import AgentCard from "./AgentCard";
import useDeviceDetect from "@/libs/hooks/useDeviceDetect";
import MobileDrawer from "../common/MobileDrawer";

const serviceTypes = ["Grooming", "Training", "Walking", "Boarding", "Day-care"];
const serviceAreas = ["Gangnam", "Mapo", "Yongsan", "Seongdong", "Songpa", "Jongno"];

type SortOption = "newest" | "rating" | "bookings";

const Agents = () => {
  const device = useDeviceDetect();
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [isTypeOpen, setIsTypeOpen] = useState(true);
  const [isAreaOpen, setIsAreaOpen] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [agentSearch, setAgentSearch] = useState({ page: 1, limit: 6 });
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const listTopRef = useRef<HTMLDivElement | null>(null);
  const activeFilterCount = selectedTypes.length + selectedAreas.length;

  const paginationHandler = (_event: ChangeEvent<unknown>, page: number) => {
    setAgentSearch((prev) => ({ ...prev, page }));
    if (!listTopRef.current) return;
    const scrollTarget =
      window.scrollY + listTopRef.current.getBoundingClientRect().top - 210;
    window.scrollTo({ top: Math.max(0, scrollTarget), behavior: "smooth" });
  };

  const filteredAgents = useMemo(() => {
    const normalizedSearch = searchText.trim().toLowerCase();
    return mockAgents.filter((a) => {
      const matchesType =
        selectedTypes.length === 0 || selectedTypes.includes(a.serviceType);
      const matchesArea =
        selectedAreas.length === 0 ||
        selectedAreas.some((area) => a.serviceArea?.includes(area));
      const matchesSearch =
        normalizedSearch.length === 0 ||
        a.fullName.toLowerCase().includes(normalizedSearch) ||
        (a.role ?? "").toLowerCase().includes(normalizedSearch) ||
        a.serviceType.toLowerCase().includes(normalizedSearch);
      return matchesType && matchesArea && matchesSearch;
    });
  }, [selectedTypes, selectedAreas, searchText]);

  const sortedAgents = useMemo(() => {
    const next = [...filteredAgents];
    switch (sortBy) {
      case "rating":
        next.sort((a, b) => b.rating - a.rating);
        break;
      case "bookings":
        next.sort((a, b) => b.totalBookings - a.totalBookings);
        break;
      case "newest":
        next.sort(
          (a, b) =>
            new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime(),
        );
        break;
    }
    return next;
  }, [filteredAgents, sortBy]);

  useEffect(() => {
    setAgentSearch((prev) => ({ ...prev, page: 1 }));
  }, [searchText, selectedTypes, selectedAreas, sortBy]);

  const totalPages = Math.max(1, Math.ceil(sortedAgents.length / agentSearch.limit));

  useEffect(() => {
    if (agentSearch.page > totalPages) {
      setAgentSearch((prev) => ({ ...prev, page: totalPages }));
    }
  }, [agentSearch.page, totalPages]);

  const startIndex = (agentSearch.page - 1) * agentSearch.limit;
  const pagedAgents = sortedAgents.slice(startIndex, startIndex + agentSearch.limit);

  const toggleType = (type: string) =>
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );

  const toggleArea = (area: string) =>
    setSelectedAreas((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area],
    );

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
            if (e.key === "Enter") setSearchText((prev) => prev.trim());
          }}
        />
        <Button
          className="search-button"
          onClick={() => setSearchText((prev) => prev.trim())}
        >
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
          {serviceTypes.map((type) => (
            <Stack
              key={type}
              className={`category-option ${selectedTypes.includes(type) ? "is-selected" : ""}`}
              onClick={() => toggleType(type)}
            >
              <Box className="category-checkbox" aria-hidden="true" />
              <Typography className="category-label">{type}</Typography>
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
          {serviceAreas.map((area) => (
            <Stack
              key={area}
              className={`category-option ${selectedAreas.includes(area) ? "is-selected" : ""}`}
              onClick={() => toggleArea(area)}
            >
              <Box className="category-checkbox" aria-hidden="true" />
              <Typography className="category-label">{area}</Typography>
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
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="filter-section"
                MenuProps={{
                  disableScrollLock: true,
                  PaperProps: { className: "filter-menu" },
                  MenuListProps: { className: "filter-menu-list" },
                }}
              >
                <MenuItem value="newest">Newest</MenuItem>
                <MenuItem value="rating">Highest Rating</MenuItem>
                <MenuItem value="bookings">Most Booked</MenuItem>
              </Select>
            </Box>

            <Stack className="agents-cards">
              {pagedAgents.length !== 0 ? (
                pagedAgents.map((agent) => (
                  <AgentCard key={agent.id} item={agent} />
                ))
              ) : (
                <Box className="no-data-wrap">
                  <img
                    src="/img/icons/no-data.png"
                    alt="No agents found"
                    className="no-data-img"
                  />
                </Box>
              )}

              <Stack className="pagination-section">
                {pagedAgents.length !== 0 && (
                  <Pagination
                    count={totalPages}
                    page={agentSearch.page}
                    renderItem={(item) => (
                      <PaginationItem
                        components={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
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
            label: `Show ${sortedAgents.length} agent${sortedAgents.length === 1 ? "" : "s"}`,
            onClick: () => setIsFilterDrawerOpen(false),
          }}
        >
          <Stack className="category mobile-filter-panel">{sidebarContent}</Stack>
        </MobileDrawer>
      )}
    </Stack>
  );
};

export default Agents;
