import { useTranslation } from "react-i18next";
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
  Slider,
  Stack,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import FilterListIcon from "@mui/icons-material/FilterList";
import { useQuery, useReactiveVar } from "@apollo/client";
import useDeviceDetect from "@/libs/hooks/useDeviceDetect";
import MobileDrawer from "../common/MobileDrawer";
import ServiceCard from "./ServiceCard";
import { userVar } from "@/apollo/store";
import { GET_ALL_SERVICES } from "@/apollo/user/query";
import { ServicesInquiry } from "@/libs/types/service/service.input";
import { Service } from "@/libs/types/service/service";
import { Direction, Message } from "@/libs/enums/common.enum";
import { ServiceLocation, ServiceType } from "@/libs/enums/service.enum";
import { T } from "@/libs/types/common";

type SortOption = "new" | "rating" | "likes" | "price-low" | "price-high";

const SORT_OPTIONS: {
  value: SortOption;
  labelKey: string;
  sort: string;
  direction: Direction;
}[] = [
  {
    value: "new",
    labelKey: "sort.new",
    sort: "createdAt",
    direction: Direction.DESC,
  },
  {
    value: "rating",
    labelKey: "sort.ratingCap",
    sort: "serviceRating",
    direction: Direction.DESC,
  },
  {
    value: "likes",
    labelKey: "sort.liked",
    sort: "serviceLikes",
    direction: Direction.DESC,
  },
  {
    value: "price-low",
    labelKey: "sort.priceAsc",
    sort: "servicePrice",
    direction: Direction.ASC,
  },
  {
    value: "price-high",
    labelKey: "sort.priceDesc",
    sort: "servicePrice",
    direction: Direction.DESC,
  },
];

const CATEGORY_OPTIONS: { labelKey: string; value: ServiceType }[] = [
  { labelKey: "enums.serviceType.DAY_CARE", value: ServiceType.DAY_CARE },
  { labelKey: "enums.serviceType.WALKING", value: ServiceType.WALKING },
  { labelKey: "enums.serviceType.GROOMING", value: ServiceType.GROOMING },
  { labelKey: "enums.serviceType.BOARDING", value: ServiceType.BOARDING },
  { labelKey: "enums.serviceType.TRAINING", value: ServiceType.TRAINING },
  { labelKey: "enums.serviceType.VETERINARY", value: ServiceType.VETERINARY },
];

const LOCATION_OPTIONS: { labelKey: string; value: ServiceLocation }[] = [
  { labelKey: "enums.serviceLocation.SEOUL", value: ServiceLocation.SEOUL },
  { labelKey: "enums.serviceLocation.BUSAN", value: ServiceLocation.BUSAN },
  { labelKey: "enums.serviceLocation.INCHEON", value: ServiceLocation.INCHEON },
  { labelKey: "enums.serviceLocation.DAEGU", value: ServiceLocation.DAEGU },
  { labelKey: "enums.serviceLocation.SUWON", value: ServiceLocation.SUWON },
  {
    labelKey: "enums.serviceLocation.GYEONGJU",
    value: ServiceLocation.GYEONGJU,
  },
  { labelKey: "enums.serviceLocation.GWANGJU", value: ServiceLocation.GWANGJU },
  { labelKey: "enums.serviceLocation.JEONJU", value: ServiceLocation.JEONJU },
  { labelKey: "enums.serviceLocation.DAEJEON", value: ServiceLocation.DAEJEON },
  { labelKey: "enums.serviceLocation.JEJU", value: ServiceLocation.JEJU },
];

const DEFAULT_PRICE_RANGE = [0, 200];

const initialInput: ServicesInquiry = {
  page: 1,
  limit: 6,
  sort: "createdAt",
  direction: Direction.DESC,
  search: {
    onlyLiked: false,
  },
};

interface ServicesProps {
  initialInput?: ServicesInquiry;
}

const Services = ({
  initialInput: propInput = initialInput,
}: ServicesProps) => {
  const { t } = useTranslation();
  const device = useDeviceDetect();
  const user = useReactiveVar(userVar);

  const [searchFilter, setSearchFilter] = useState<ServicesInquiry>(propInput);
  const [services, setServices] = useState<Service[]>([]);
  const [total, setTotal] = useState<number>(0);

  // `priceRange` mirrors the slider while dragging; the query is only updated
  // once the drag is committed (see priceCommitHandler).
  const [priceRange, setPriceRange] = useState<number[]>(DEFAULT_PRICE_RANGE);
  const [searchText, setSearchText] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("new");

  const [isPriceOpen, setIsPriceOpen] = useState(true);
  const [isCategoryOpen, setIsCategoryOpen] = useState(true);
  const [isLocationOpen, setIsLocationOpen] = useState(true);
  const [isLikedOpen, setIsLikedOpen] = useState(true);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const servicesTopRef = useRef<HTMLDivElement | null>(null);

  /** APOLLO REQUESTS **/

  const { loading: getServicesLoading, refetch: getServicesRefetch } = useQuery(
    GET_ALL_SERVICES,
    {
      fetchPolicy: "cache-and-network", // cache + => network
      variables: { input: searchFilter },
      notifyOnNetworkStatusChange: true,
      onCompleted: (data: T) => {
        setServices(data?.getAllServices?.list ?? []);
        setTotal(data?.getAllServices?.metaCounter?.[0]?.total ?? 0);
      },
      // The API throws "No data found!" instead of returning an empty list, so
      // clear the previous results to let the no-data empty state render.
      onError: (error) => {
        if (
          error.graphQLErrors?.some((e) => e.message === Message.NO_DATA_FOUND)
        ) {
          setServices([]);
          setTotal(0);
        }
      },
    },
  );

  /** LIFECYCLES **/

  // meLiked / onlyLiked are computed server-side from the auth token, so re-run
  // the query whenever the logged-in member changes (login / logout / reload).
  useEffect(() => {
    getServicesRefetch({ input: searchFilter });
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

  const selectedCategories = searchFilter.search.serviceType ?? [];
  const selectedLocations = searchFilter.search.serviceLocation ?? [];
  const likedSelected = searchFilter.search.onlyLiked;
  const priceChanged =
    priceRange[0] !== DEFAULT_PRICE_RANGE[0] ||
    priceRange[1] !== DEFAULT_PRICE_RANGE[1];
  const totalPages = Math.max(1, Math.ceil(total / searchFilter.limit));
  const activeFilterCount =
    selectedCategories.length +
    selectedLocations.length +
    (likedSelected ? 1 : 0) +
    (priceChanged ? 1 : 0);

  /** HANDLERS **/

  const categoryToggleHandler = (value: ServiceType) => {
    setSearchFilter((prev) => {
      const current = prev.search.serviceType ?? [];
      const next = current.includes(value)
        ? current.filter((t) => t !== value)
        : [...current, value];
      return {
        ...prev,
        page: 1,
        search: { ...prev.search, serviceType: next.length ? next : undefined },
      };
    });
  };

  const locationToggleHandler = (value: ServiceLocation) => {
    setSearchFilter((prev) => {
      const current = prev.search.serviceLocation ?? [];
      const next = current.includes(value)
        ? current.filter((l) => l !== value)
        : [...current, value];
      return {
        ...prev,
        page: 1,
        search: {
          ...prev.search,
          serviceLocation: next.length ? next : undefined,
        },
      };
    });
  };

  const likedToggleHandler = () => {
    setSearchFilter((prev) => ({
      ...prev,
      page: 1,
      search: { ...prev.search, onlyLiked: !prev.search.onlyLiked },
    }));
  };

  const priceCommitHandler = (
    _event: Event | ChangeEvent<unknown>,
    value: number | number[],
  ) => {
    const range = value as number[];
    setPriceRange(range);
    const isDefault =
      range[0] === DEFAULT_PRICE_RANGE[0] &&
      range[1] === DEFAULT_PRICE_RANGE[1];
    setSearchFilter((prev) => ({
      ...prev,
      page: 1,
      search: {
        ...prev.search,
        priceRange: isDefault ? undefined : { min: range[0], max: range[1] },
      },
    }));
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
    if (!servicesTopRef.current) return;
    const scrollTarget =
      window.scrollY + servicesTopRef.current.getBoundingClientRect().top - 210;
    window.scrollTo({ top: Math.max(0, scrollTarget), behavior: "smooth" });
  };

  const sidebarContent = (
    <>
      <Box className="search-box">
        <Input
          placeholder={t("list.searchHere")}
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

      <Stack className="price-section category-section">
        <Stack
          className="category-header"
          onClick={() => setIsPriceOpen((p) => !p)}
        >
          <Typography className="category-title">Price range</Typography>
          <Box
            className={`category-toggle ${isPriceOpen ? "is-open" : ""}`}
            aria-hidden="true"
          />
        </Stack>
        <Stack className={`category-list ${isPriceOpen ? "is-open" : ""}`}>
          <Box className="price-range">
            <Slider
              value={priceRange}
              onChange={(_e, v) => setPriceRange(v as number[])}
              onChangeCommitted={priceCommitHandler}
              min={0}
              max={200}
              valueLabelDisplay="off"
              className="price-line"
            />
            <Typography className="selected-price">
              ${priceRange[0]} – ${priceRange[1]}
            </Typography>
          </Box>
        </Stack>
      </Stack>

      <Divider className="divider" />

      <Stack className="category-section">
        <Stack
          className="category-header"
          onClick={() => setIsCategoryOpen((p) => !p)}
        >
          <Typography className="category-title">Category</Typography>
          <Box
            className={`category-toggle ${isCategoryOpen ? "is-open" : ""}`}
            aria-hidden="true"
          />
        </Stack>
        <Stack className={`category-list ${isCategoryOpen ? "is-open" : ""}`}>
          {CATEGORY_OPTIONS.map((cat) => (
            <Stack
              key={cat.value}
              className={`category-option ${selectedCategories.includes(cat.value) ? "is-selected" : ""}`}
              onClick={() => categoryToggleHandler(cat.value)}
            >
              <Box className="category-checkbox" aria-hidden="true" />
              <Typography className="category-label">
                {t(cat.labelKey)}
              </Typography>
            </Stack>
          ))}
        </Stack>
      </Stack>

      <Divider className="divider" />

      <Stack className="category-section">
        <Stack
          className="category-header"
          onClick={() => setIsLocationOpen((p) => !p)}
        >
          <Typography className="category-title">Location</Typography>
          <Box
            className={`category-toggle ${isLocationOpen ? "is-open" : ""}`}
            aria-hidden="true"
          />
        </Stack>
        <Stack className={`category-list ${isLocationOpen ? "is-open" : ""}`}>
          {LOCATION_OPTIONS.map((loc) => (
            <Stack
              key={loc.value}
              className={`category-option ${selectedLocations.includes(loc.value) ? "is-selected" : ""}`}
              onClick={() => locationToggleHandler(loc.value)}
            >
              <Box className="category-checkbox" aria-hidden="true" />
              <Typography className="category-label">
                {t(loc.labelKey)}
              </Typography>
            </Stack>
          ))}
        </Stack>
      </Stack>

      <Divider className="divider" />

      <Stack className="liked-agents-section">
        <Stack
          className="likes-header"
          onClick={() => setIsLikedOpen((p) => !p)}
        >
          <Typography className="likes-title">Likes</Typography>
          <Box
            className={`likes-toggle ${isLikedOpen ? "is-open" : ""}`}
            aria-hidden="true"
          />
        </Stack>
        <Stack className={`likes-list ${isLikedOpen ? "is-open" : ""}`}>
          <Stack
            className={`likes-option ${likedSelected ? "is-selected" : ""}`}
            onClick={likedToggleHandler}
          >
            <Box className="likes-checkbox" aria-hidden="true" />
            <Typography className="likes-label">My Favorites</Typography>
          </Stack>
          <Divider className="likes-divider" />
        </Stack>
      </Stack>
    </>
  );

  return (
    <Stack className="services-agents-page">
      <Stack className="container">
        <Box className="title">Find Pet Care</Box>
        <Stack className="services-main">
          {/* ── Sidebar (desktop) / Filter trigger (mobile) ── */}
          {device === "mobile" ? (
            <Button
              className="mobile-filter-trigger"
              onClick={() => setIsFilterDrawerOpen(true)}
            >
              <FilterListIcon fontSize="small" />
              {t("list.filters")}
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
          <Stack className="sorting-agents" ref={servicesTopRef}>
            <Box className="filter-section-wrap">
              <Select
                value={sortBy}
                onChange={(e) => sortHandler(e.target.value as SortOption)}
                className="filter-section"
                MenuProps={{
                  disableScrollLock: true,
                  PaperProps: { className: "service-sort-menu" },
                  MenuListProps: { className: "service-sort-menu-list" },
                }}
              >
                {SORT_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {t(option.labelKey)}
                  </MenuItem>
                ))}
              </Select>
            </Box>

            <Stack className="agents-cards">
              {services.length !== 0 ? (
                services.map((service) => (
                  <ServiceCard
                    key={service._id}
                    service={service}
                    getServicesRefetch={getServicesRefetch}
                  />
                ))
              ) : !getServicesLoading ? (
                <Box
                  className="no-data-wrap"
                  sx={{
                    width: "800px",
                    height: "800px",
                    display: "flex",
                    alignContent: "center",
                    justifyContent: "center",
                  }}
                >
                  <img
                    className="no-data-img"
                    src="/img/icons/no-data.png"
                    alt="No services found"
                    style={{ width: 450, height: 450, marginTop: "120px" }}
                  />
                </Box>
              ) : null}

              <Stack className="pagination-section">
                {services.length !== 0 ? (
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
                ) : null}
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
            label: `Show ${total} service${total === 1 ? "" : "s"}`,
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

export default Services;
