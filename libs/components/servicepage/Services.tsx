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
  Slider,
  Stack,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ServiceCard, { ServiceItem } from "./ServiceCard";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import FilterListIcon from "@mui/icons-material/FilterList";
import useDeviceDetect from "@/libs/hooks/useDeviceDetect";
import MobileDrawer from "../common/MobileDrawer";

const initialServices: ServiceItem[] = [
  {
    _id: "svc-1",
    serviceName: "Premium Dog Grooming",
    category: "Grooming",
    image: "/img/services/grooming.jpg",
    price: 50,
    duration: "45 min",
    location: "Seoul",
    rating: 4.4,
    reviewCount: 128,
    likes: 121,
    liked: false,
    bookingCount: 843,
  },
  {
    _id: "svc-2",
    serviceName: "Full Cat Spa & Trim",
    category: "Grooming",
    image: "/img/services/grooming.jpg",
    price: 40,
    duration: "40 min",
    location: "Busan",
    rating: 4.2,
    reviewCount: 84,
    likes: 98,
    liked: false,
    bookingCount: 412,
  },
  {
    _id: "svc-3",
    serviceName: "Daily Dog Walk – 1 hr",
    category: "Walking",
    image: "/img/services/walking.jpg",
    price: 25,
    duration: "60 min",
    location: "Seoul",
    rating: 4.7,
    reviewCount: 256,
    likes: 201,
    liked: true,
    bookingCount: 2140,
  },
  {
    _id: "svc-4",
    serviceName: "Morning Park Walk",
    category: "Walking",
    image: "/img/services/walking.jpg",
    price: 18,
    duration: "45 min",
    location: "Incheon",
    rating: 4.3,
    reviewCount: 97,
    likes: 76,
    liked: false,
    bookingCount: 638,
  },
  {
    _id: "svc-5",
    serviceName: "Cat Overnight Boarding",
    category: "Boarding",
    image: "/img/services/boarding.png",
    price: 65,
    duration: "per night",
    location: "Daegu",
    rating: 4.9,
    reviewCount: 89,
    likes: 312,
    liked: true,
    bookingCount: 527,
  },
  {
    _id: "svc-6",
    serviceName: "Dog Home Boarding",
    category: "Boarding",
    image: "/img/services/boarding.png",
    price: 55,
    duration: "per night",
    location: "Suwon",
    rating: 4.6,
    reviewCount: 143,
    likes: 187,
    liked: false,
    bookingCount: 1380,
  },
  {
    _id: "svc-7",
    serviceName: "Basic Obedience Training",
    category: "Training",
    image: "/img/services/grooming.jpg",
    price: 90,
    duration: "60 min",
    location: "Seoul",
    rating: 4.8,
    reviewCount: 211,
    likes: 321,
    liked: true,
    bookingCount: 1920,
  },
  {
    _id: "svc-8",
    serviceName: "Puppy Socialization Class",
    category: "Training",
    image: "/img/services/walking.jpg",
    price: 75,
    duration: "50 min",
    location: "Gyeongju",
    rating: 4.5,
    reviewCount: 61,
    likes: 89,
    liked: false,
    bookingCount: 294,
  },
  {
    _id: "svc-9",
    serviceName: "Full Day Pet Day Care",
    category: "Day Care",
    image: "/img/services/boarding.png",
    price: 45,
    duration: "8 hrs",
    location: "Busan",
    rating: 4.6,
    reviewCount: 172,
    likes: 143,
    liked: false,
    bookingCount: 765,
  },
  {
    _id: "svc-10",
    serviceName: "Vet Check-Up & Vaccines",
    category: "Veterinary",
    image: "/img/services/grooming.jpg",
    price: 80,
    duration: "30 min",
    location: "Seoul",
    rating: 4.7,
    reviewCount: 304,
    likes: 267,
    liked: false,
    bookingCount: 3210,
  },
];

type SortOption = "new" | "rating" | "likes" | "price-low" | "price-high";

const categories = [
  "Day Care",
  "Walking",
  "Grooming",
  "Boarding",
  "Training",
  "Veterinary",
];

const locations = [
  "Seoul",
  "Busan",
  "Incheon",
  "Daegu",
  "Suwon",
  "Gyeongju",
  "Gwangju",
  "Chonju",
  "Daejon",
  "Jeju",
];

const DEFAULT_PRICE_RANGE = [0, 200];

const Services = () => {
  const device = useDeviceDetect();
  const [services, setServices] = useState(initialServices);
  const [priceRange, setPriceRange] = useState<number[]>(DEFAULT_PRICE_RANGE);
  const [isPriceOpen, setIsPriceOpen] = useState(true);
  const [isCategoryOpen, setIsCategoryOpen] = useState(true);
  const [isLocationOpen, setIsLocationOpen] = useState(true);
  const [isLikedOpen, setIsLikedOpen] = useState(true);
  const [likedSelected, setLikedSelected] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [searchText, setSearchText] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("new");
  const [serviceSearch, setServiceSearch] = useState({ page: 1, limit: 6 });
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const servicesTopRef = useRef<HTMLDivElement | null>(null);
  const activeFilterCount =
    selectedCategories.length +
    selectedLocations.length +
    (likedSelected ? 1 : 0) +
    (priceRange[0] !== DEFAULT_PRICE_RANGE[0] || priceRange[1] !== DEFAULT_PRICE_RANGE[1] ? 1 : 0);

  const toggleServiceLike = (id: string) => {
    setServices((prev) =>
      prev.map((s) =>
        s._id === id
          ? { ...s, liked: !s.liked, likes: Math.max(0, s.likes + (s.liked ? -1 : 1)) }
          : s,
      ),
    );
  };

  const paginationHandler = (_event: ChangeEvent<unknown>, page: number) => {
    setServiceSearch((prev) => ({ ...prev, page }));
    if (!servicesTopRef.current) return;
    const scrollTarget =
      window.scrollY + servicesTopRef.current.getBoundingClientRect().top - 210;
    window.scrollTo({ top: Math.max(0, scrollTarget), behavior: "smooth" });
  };

  const filteredServices = useMemo(() => {
    const [minPrice, maxPrice] = priceRange;
    const normalizedSearch = searchText.trim().toLowerCase();

    return services.filter((s) => {
      const matchesPrice = s.price >= minPrice && s.price <= maxPrice;
      const matchesCategory =
        selectedCategories.length === 0 || selectedCategories.includes(s.category);
      const matchesLocation =
        selectedLocations.length === 0 || selectedLocations.includes(s.location);
      const matchesLiked = !likedSelected || Boolean(s.liked);
      const matchesSearch =
        normalizedSearch.length === 0 ||
        s.serviceName.toLowerCase().includes(normalizedSearch) ||
        s.category.toLowerCase().includes(normalizedSearch) ||
        s.location.toLowerCase().includes(normalizedSearch);

      return matchesPrice && matchesCategory && matchesLocation && matchesLiked && matchesSearch;
    });
  }, [services, priceRange, selectedCategories, selectedLocations, likedSelected, searchText]);

  const sortedServices = useMemo(() => {
    const next = [...filteredServices];
    switch (sortBy) {
      case "rating":
        next.sort((a, b) => b.rating - a.rating);
        break;
      case "likes":
        next.sort((a, b) => b.likes - a.likes);
        break;
      case "price-low":
        next.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        next.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }
    return next;
  }, [filteredServices, sortBy]);

  useEffect(() => {
    setServiceSearch((prev) => ({ ...prev, page: 1 }));
  }, [searchText, selectedCategories, selectedLocations, priceRange, likedSelected, sortBy]);

  const totalPages = Math.max(1, Math.ceil(sortedServices.length / serviceSearch.limit));

  useEffect(() => {
    if (serviceSearch.page > totalPages) {
      setServiceSearch((prev) => ({ ...prev, page: totalPages }));
    }
  }, [serviceSearch.page, totalPages]);

  const startIndex = (serviceSearch.page - 1) * serviceSearch.limit;
  const pagedServices = sortedServices.slice(startIndex, startIndex + serviceSearch.limit);

  const sidebarContent = (
    <>
      <Box className="search-box">
        <Input
          placeholder="Search here"
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
          {categories.map((cat) => (
            <Stack
              key={cat}
              className={`category-option ${selectedCategories.includes(cat) ? "is-selected" : ""}`}
              onClick={() =>
                setSelectedCategories((prev) =>
                  prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
                )
              }
            >
              <Box className="category-checkbox" aria-hidden="true" />
              <Typography className="category-label">{cat}</Typography>
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
          {locations.map((loc) => (
            <Stack
              key={loc}
              className={`category-option ${selectedLocations.includes(loc) ? "is-selected" : ""}`}
              onClick={() =>
                setSelectedLocations((prev) =>
                  prev.includes(loc) ? prev.filter((l) => l !== loc) : [...prev, loc],
                )
              }
            >
              <Box className="category-checkbox" aria-hidden="true" />
              <Typography className="category-label">{loc}</Typography>
            </Stack>
          ))}
        </Stack>
      </Stack>

      <Divider className="divider" />

      <Stack className="liked-agents-section">
        <Stack className="likes-header" onClick={() => setIsLikedOpen((p) => !p)}>
          <Typography className="likes-title">Likes</Typography>
          <Box
            className={`likes-toggle ${isLikedOpen ? "is-open" : ""}`}
            aria-hidden="true"
          />
        </Stack>
        <Stack className={`likes-list ${isLikedOpen ? "is-open" : ""}`}>
          <Stack
            className={`likes-option ${likedSelected ? "is-selected" : ""}`}
            onClick={() => setLikedSelected((p) => !p)}
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
          <Stack className="sorting-agents" ref={servicesTopRef}>
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
                <MenuItem value="new">New</MenuItem>
                <MenuItem value="rating">Highest Rating</MenuItem>
                <MenuItem value="likes">Most Liked</MenuItem>
                <MenuItem value="price-low">Price: Low to High</MenuItem>
                <MenuItem value="price-high">Price: High to Low</MenuItem>
              </Select>
            </Box>

            <Stack className="agents-cards">
              {pagedServices.length !== 0 ? (
                pagedServices.map((service) => (
                  <ServiceCard
                    key={service._id}
                    item={service}
                    onToggleLike={() => toggleServiceLike(service._id)}
                  />
                ))
              ) : (
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
              )}

              <Stack className="pagination-section">
                {pagedServices.length !== 0 ? (
                  <Pagination
                    count={totalPages}
                    page={serviceSearch.page}
                    renderItem={(item) => (
                      <PaginationItem
                        components={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
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
            label: `Show ${sortedServices.length} service${sortedServices.length === 1 ? "" : "s"}`,
            onClick: () => setIsFilterDrawerOpen(false),
          }}
        >
          <Stack className="category mobile-filter-panel">{sidebarContent}</Stack>
        </MobileDrawer>
      )}
    </Stack>
  );
};

export default Services;
