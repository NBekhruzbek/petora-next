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
import ServiceAgentsCard, { AgentItem } from "./ServiceAgentsCard";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const agents: AgentItem[] = [
  {
    _id: "agent-1",
    name: "Kelvin John",
    serviceType: "Grooming",
    image: "/img/agents/topAgent1.jpg",
    price: "$50~$220",
    likes: 121,
    rating: 4.4,
    bookings: 111,
  },
  {
    _id: "agent-2",
    name: "Emma Watson",
    serviceType: "Day Care | Walking | Training",
    image: "/img/agents/topAgent2.png",
    price: "$50~$520",
    likes: 2022,
    rating: 4.2,
    bookings: 111,
  },
  {
    _id: "agent-3",
    name: "Daniel Smith",
    serviceType: "Walking | Training",
    image: "/img/agents/topAgent3.jpg",
    price: "$90~$420",
    likes: 321,
    rating: 4.2,
    bookings: 111,
  },
  {
    _id: "agent-4",
    name: "Sophia Brown",
    serviceType: "Boarding",
    image: "/img/agents/topAgent4.jpg",
    price: "$100~$520",
    likes: 121,
    rating: 4.2,
    bookings: 111,
  },
  {
    _id: "agent-5",
    name: "Liam Wilson",
    serviceType: "Training",
    image: "/img/agents/topAgent5.jpeg",
    price: "$40~$120",
    likes: 121,
    rating: 4.9,
    bookings: 111,
  },
  {
    _id: "agent-6",
    name: "Noah Taylor",
    serviceType: "Day Care | Walking",
    image: "/img/agents/topAgent7.jpeg",
    price: "$90~$320",
    likes: 121,
    rating: 4.2,
    bookings: 111,
  },
  {
    _id: "agent-7",
    name: "Noah Taylor",
    serviceType: "Veterinary",
    image: "/img/agents/topAgent6.jpg",
    price: "$10~$990",
    likes: 121,
    rating: 4.2,
    bookings: 211,
  },
  {
    _id: "agent-8",
    name: "Noah Taylor",
    serviceType: "Training",
    image: "/img/agents/topAgent8.jpeg",
    price: "$20~$320",
    likes: 121,
    rating: 4.2,
    bookings: 111,
  },
];

const Agents = () => {
  const [value, setValue] = useState<number[]>([10, 1000]);
  const [isPriceOpen, setIsPriceOpen] = useState(true);
  const [isCategoryOpen, setIsCategoryOpen] = useState(true);
  const [isLikedOpen, setIsLikedOpen] = useState(true);
  const [likedSelected, setLikedSelected] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("new");
  const agentsTopRef = useRef<HTMLDivElement | null>(null);

  const [agentSearch, setAgentSearch] = useState({
    page: 1,
    limit: 6,
    order: "createdAt",
    productCategory: undefined,
    productFlavor: undefined,
    search: "",
  });

  const categories = [
    "Day Care",
    "Walking",
    "Grooming",
    "Boarding",
    "Training",
    "Veterinary",
  ];

  const handleChange = (event: Event, newValue: number | number[]) => {
    setValue(newValue as number[]);
  };

  const toggleCategoryOpen = () => {
    setIsCategoryOpen((prev) => !prev);
  };

  const togglePriceOpen = () => {
    setIsPriceOpen((prev) => !prev);
  };

  const toggleCategory = (name: string) => {
    setSelectedCategories((prev) =>
      prev.includes(name)
        ? prev.filter((item) => item !== name)
        : [...prev, name],
    );
  };

  const toggleLikedOpen = () => {
    setIsLikedOpen((prev) => !prev);
  };

  const toggleLikedSelected = () => {
    setLikedSelected((prev) => !prev);
  };

  const searchAgentHandler = () => {
    setSearchText((prev) => prev.trim());
  };

  const paginationHandler = (_event: ChangeEvent<unknown>, page: number) => {
    setAgentSearch((prev) => ({ ...prev, page }));

    if (!agentsTopRef.current) return;

    const scrollTarget =
      window.scrollY + agentsTopRef.current.getBoundingClientRect().top - 210;

    window.scrollTo({
      top: Math.max(0, scrollTarget),
      behavior: "smooth",
    });
  };

  const filteredAgents = useMemo(() => {
    const [minPrice, maxPrice] = value;
    const normalizedSearch = searchText.trim().toLowerCase();

    const parsePriceRange = (price: string) => {
      const matches = price.match(/\d+(\.\d+)?/g) ?? [];
      const numbers = matches.map((item) => Number(item));
      if (numbers.length === 0) return [0, 0] as const;
      if (numbers.length === 1) return [numbers[0], numbers[0]] as const;
      return [numbers[0], numbers[numbers.length - 1]] as const;
    };

    return agents.filter((agent) => {
      const [agentMin, agentMax] = parsePriceRange(agent.price);
      const matchesPrice = agentMin >= minPrice && agentMax <= maxPrice;

      const agentCategories = agent.serviceType
        .split("|")
        .map((item) => item.trim())
        .filter(Boolean);
      const matchesCategory =
        selectedCategories.length === 0 ||
        agentCategories.some((category) =>
          selectedCategories.includes(category),
        );

      const matchesSearch =
        normalizedSearch.length === 0 ||
        agent.name.toLowerCase().includes(normalizedSearch) ||
        agent.serviceType.toLowerCase().includes(normalizedSearch);

      return matchesPrice && matchesCategory && matchesSearch;
    });
  }, [searchText, selectedCategories, value]);

  const sortedAgents = useMemo(() => {
    if (sortBy === "new") return filteredAgents;
    const next = [...filteredAgents];
    switch (sortBy) {
      case "rating":
        next.sort((a, b) => b.rating - a.rating);
        break;
      case "bookings":
        next.sort((a, b) => b.bookings - a.bookings);
        break;
      case "likes":
        next.sort((a, b) => b.likes - a.likes);
        break;
      default:
        break;
    }
    return next;
  }, [filteredAgents, sortBy]);

  useEffect(() => {
    setAgentSearch((prev) => ({ ...prev, page: 1 }));
  }, [searchText, selectedCategories, value, sortBy]);

  const totalPages = Math.max(
    1,
    Math.ceil(sortedAgents.length / agentSearch.limit),
  );

  useEffect(() => {
    if (agentSearch.page > totalPages) {
      setAgentSearch((prev) => ({ ...prev, page: totalPages }));
    }
  }, [agentSearch.page, totalPages]);

  const startIndex = (agentSearch.page - 1) * agentSearch.limit;
  const pagedAgents = sortedAgents.slice(
    startIndex,
    startIndex + agentSearch.limit,
  );

  return (
    <Stack className="services-agents-page">
      <Stack className="container">
        <Box className={"title"}>Find Pet Care</Box>
        <Stack className="services-main">
          <Stack className="category">
            <Box className="search-box">
              <Input
                placeholder="Search here"
                disableUnderline
                className="text-field"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key == "Enter") searchAgentHandler();
                }}
              />
              <Button className="search-button" onClick={searchAgentHandler}>
                <SearchIcon />
              </Button>
            </Box>
            <Divider className="divider"></Divider>

            <Stack className="price-section category-section">
              <Stack className="category-header" onClick={togglePriceOpen}>
                <Typography className="category-title">Price range</Typography>
                <Box
                  className={`category-toggle ${isPriceOpen ? "is-open" : ""}`}
                  aria-hidden="true"
                />
              </Stack>
              <Stack
                className={`category-list ${isPriceOpen ? "is-open" : ""}`}
              >
                <Box className="price-range">
                  <Slider
                    value={value}
                    onChange={handleChange}
                    min={0}
                    max={1000}
                    valueLabelDisplay="off"
                    className="price-line"
                  />

                  <Typography className="selected-price">
                    ${value[0].toFixed(2)} - ${value[1].toFixed(2)}
                  </Typography>
                </Box>
              </Stack>
            </Stack>

            <Divider className="divider"></Divider>

            <Stack className="category-section">
              <Stack className="category-header" onClick={toggleCategoryOpen}>
                <Typography className="category-title">Category</Typography>
                <Box
                  className={`category-toggle ${
                    isCategoryOpen ? "is-open" : ""
                  }`}
                  aria-hidden="true"
                />
              </Stack>
              <Stack
                className={`category-list ${isCategoryOpen ? "is-open" : ""}`}
              >
                {categories.map((category) => {
                  const isSelected = selectedCategories.includes(category);
                  return (
                    <Stack
                      key={category}
                      className={`category-option ${
                        isSelected ? "is-selected" : ""
                      }`}
                      onClick={() => toggleCategory(category)}
                    >
                      <Box className="category-checkbox" aria-hidden="true" />
                      <Typography className="category-label">
                        {category}
                      </Typography>
                    </Stack>
                  );
                })}
              </Stack>
            </Stack>
            <Divider className="divider"></Divider>

            <Stack className="liked-agents-section">
              <Stack className="likes-header" onClick={toggleLikedOpen}>
                <Typography className="likes-title">Likes</Typography>
                <Box
                  className={`likes-toggle ${isLikedOpen ? "is-open" : ""}`}
                  aria-hidden="true"
                />
              </Stack>
              <Stack className={`likes-list ${isLikedOpen ? "is-open" : ""}`}>
                <Stack
                  className={`likes-option ${
                    likedSelected ? "is-selected" : ""
                  }`}
                  onClick={toggleLikedSelected}
                >
                  <Box className="likes-checkbox" aria-hidden="true" />
                  <Typography className="likes-label">My Favorites</Typography>
                </Stack>
                <Divider className={"likes-divider"} />
              </Stack>
            </Stack>
          </Stack>
          <Stack className="sorting-agents" ref={agentsTopRef}>
            <Box className="filter-section-wrap">
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={"filter-section"}
                MenuProps={{
                  disableScrollLock: true,
                  PaperProps: { className: "filter-menu" },
                  MenuListProps: { className: "filter-menu-list" },
                }}
              >
                <MenuItem value="new">New</MenuItem>
                <MenuItem value="rating">Highest rating</MenuItem>
                <MenuItem value="bookings">Most Booked</MenuItem>
                <MenuItem value="likes">Likes</MenuItem>
              </Select>
            </Box>
            <Stack className="agents-cards">
              {pagedAgents.length !== 0 ? (
                pagedAgents.map((agent) => {
                  return <ServiceAgentsCard key={agent._id} item={agent} />;
                })
              ) : (
                <Box
                  sx={{
                    width: "800px",
                    height: "800px",
                    display: "flex",
                    flexDirection: "row",
                    alignContent: "center",
                    justifyContent: "center",
                  }}
                >
                  <img
                    src="/img/icons/no-data.png"
                    style={{ width: 450, height: 450, marginTop: "120px" }}
                  />
                </Box>
              )}
              <Stack className="pagination-section">
                {pagedAgents.length !== 0 ? (
                  <Pagination
                    count={totalPages}
                    page={agentSearch.page}
                    renderItem={(item) => (
                      <PaginationItem
                        components={{
                          previous: ArrowBackIcon,
                          next: ArrowForwardIcon,
                        }}
                        {...item}
                        color={"primary"}
                      />
                    )}
                    onChange={paginationHandler}
                  />
                ) : null}
              </Stack>
            </Stack>
          </Stack>
        </Stack>
        <Stack className=""></Stack>
      </Stack>
    </Stack>
  );
};

export default Agents;
