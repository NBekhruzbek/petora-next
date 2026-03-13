import { ChangeEvent, useState } from "react";
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
    desc: "Most popular agent in the South Korea",
    likes: 121,
    rating: 4.2,
    bookings: 111,
  },
  {
    _id: "agent-2",
    name: "Emma Watson",
    serviceType: "Day Care | Walking | Training",
    image: "/img/agents/topAgent2.png",
    desc: "Most popular agent in the South Korea ",
    likes: 121,
    rating: 4.2,
    bookings: 111,
  },
  {
    _id: "agent-3",
    name: "Daniel Smith",
    serviceType: "Walking | Training",
    image: "/img/agents/topAgent3.jpg",
    desc: "Most popular agent in the South Korea",
    likes: 121,
    rating: 4.2,
    bookings: 111,
  },
  {
    _id: "agent-4",
    name: "Sophia Brown",
    serviceType: "Boarding",
    image: "/img/agents/topAgent4.jpg",
    desc: "Most popular agent in the South Korea",
    likes: 121,
    rating: 4.2,
    bookings: 111,
  },
  {
    _id: "agent-5",
    name: "Liam Wilson",
    serviceType: "Training",
    image: "/img/agents/topAgent5.jpeg",
    desc: "Most popular agent in the South Korea",
    likes: 121,
    rating: 4.2,
    bookings: 111,
  },
  {
    _id: "agent-6",
    name: "Noah Taylor",
    serviceType: "Day Care | Walking",
    image: "/img/agents/topAgent7.jpeg",
    desc: "Most popular agent in the South Korea",
    likes: 121,
    rating: 4.2,
    bookings: 111,
  },
  {
    _id: "agent-6",
    name: "Noah Taylor",
    serviceType: "Veterinary",
    image: "/img/agents/topAgent6.jpg",
    desc: "Most popular agent in the South Korea",
    likes: 121,
    rating: 4.2,
    bookings: 111,
  },
  {
    _id: "agent-6",
    name: "Noah Taylor",
    serviceType: "Training",
    image: "/img/agents/topAgent8.jpeg",
    desc: "Most popular agent in the South Korea",
    likes: 121,
    rating: 4.2,
    bookings: 111,
  },
];

const Agents = () => {
  const [value, setValue] = useState<number[]>([10, 600]);
  const [isPriceOpen, setIsPriceOpen] = useState(true);
  const [isCategoryOpen, setIsCategoryOpen] = useState(true);
  const [isLikedOpen, setIsLikedOpen] = useState(true);
  const [likedSelected, setLikedSelected] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([""]);
  const [searchText, setSearchText] = useState<string>("");

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

  const paginationHandler = (e: ChangeEvent<any>, value: number) => {
    setAgentSearch((prev) => ({ ...prev, page: value }));
  };

  const totalPages = Math.max(1, Math.ceil(agents.length / agentSearch.limit));
  const startIndex = (agentSearch.page - 1) * agentSearch.limit;
  const pagedAgents = agents.slice(startIndex, startIndex + agentSearch.limit);

  return (
    <Stack className="services-agents-page">
      <Stack className="container">
        <Box className={"title"}>Services</Box>
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
                  <Typography className="likes-label">Liked Agents</Typography>
                </Stack>
                <Divider className={"likes-divider"} />
              </Stack>
            </Stack>
          </Stack>
          <Stack className="sorting-agents">
            <Box>
              <Select
                defaultValue="default"
                className={"filter-section"}
                MenuProps={{
                  disableScrollLock: true,
                  PaperProps: { className: "filter-menu" },
                  MenuListProps: { className: "filter-menu-list" },
                }}
              >
                <MenuItem value="default">Default</MenuItem>
                <MenuItem value="rating">Highest rating</MenuItem>
                <MenuItem value="bookings">Most Booked</MenuItem>
                <MenuItem value="likes">Likes</MenuItem>
              </Select>
            </Box>
            <Stack className="agents-cards">
              {pagedAgents.length !== 0 ? (
                pagedAgents.map((agent) => {
                  return <ServiceAgentsCard item={agent} />;
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
                    src="/icons/no-data.png"
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
