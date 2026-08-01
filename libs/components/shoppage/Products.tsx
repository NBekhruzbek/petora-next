import { useTranslation } from "react-i18next";
import {
  ChangeEvent,
  SyntheticEvent,
  useEffect,
  useRef,
  useState,
} from "react";
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
import ProductsCard from "./ProductsCard";
import useDeviceDetect from "@/libs/hooks/useDeviceDetect";
import MobileDrawer from "../common/MobileDrawer";
import { userVar } from "@/apollo/store";
import { GET_PRODUCTS } from "@/apollo/user/query";
import { ProductsInquiry } from "@/libs/types/product/product.input";
import { Product } from "@/libs/types/product/product";
import { Direction } from "@/libs/enums/common.enum";
import { ProductPetType, ProductType } from "@/libs/enums/product.enum";
import { Messages } from "@/libs/config";
import { sweetMixinErrorAlert } from "@/libs/sweetAlert";

type SortOption =
  "new" | "rating" | "most-liked" | "sold" | "price-low" | "price-high";

// The API only accepts these sort keys (createdAt, productRating, productRank,
// productLikes, productSoldTimes, productPriceAfterDiscount).
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
    labelKey: "sort.rating",
    sort: "productRating",
    direction: Direction.DESC,
  },
  {
    value: "most-liked",
    labelKey: "sort.liked",
    sort: "productLikes",
    direction: Direction.DESC,
  },
  {
    value: "sold",
    labelKey: "sort.bestSelling",
    sort: "productSoldTimes",
    direction: Direction.DESC,
  },
  {
    value: "price-low",
    labelKey: "sort.priceAsc",
    sort: "productPriceAfterDiscount",
    direction: Direction.ASC,
  },
  {
    value: "price-high",
    labelKey: "sort.priceDesc",
    sort: "productPriceAfterDiscount",
    direction: Direction.DESC,
  },
];

const PET_TYPE_OPTIONS: { labelKey: string; value: ProductPetType }[] = [
  { labelKey: "enums.productPetType.DOG", value: ProductPetType.DOG },
  { labelKey: "enums.productPetType.CAT", value: ProductPetType.CAT },
  { labelKey: "enums.productPetType.RABBIT", value: ProductPetType.RABBIT },
  { labelKey: "enums.productPetType.BIRD", value: ProductPetType.BIRD },
  { labelKey: "enums.productPetType.HAMSTER", value: ProductPetType.HAMSTER },
  { labelKey: "enums.productPetType.OTHER", value: ProductPetType.OTHER },
];

const CATEGORY_OPTIONS: { labelKey: string; value: ProductType }[] = [
  { labelKey: "enums.productType.FOOD", value: ProductType.FOOD },
  { labelKey: "enums.productType.TOY", value: ProductType.TOY },
  { labelKey: "enums.productType.CLOTHES", value: ProductType.CLOTHES },
  { labelKey: "enums.productType.HEALTH", value: ProductType.HEALTH },
  { labelKey: "enums.productType.ACCESSORIES", value: ProductType.ACCESSORIES },
  { labelKey: "enums.productType.OTHER", value: ProductType.OTHER },
];

// Prices are stored in won, and priceRange matches against the discounted
// price the card shows.
const PRICE_MIN = 0;
const PRICE_MAX = 200000;
const PRICE_STEP = 1000;
const DEFAULT_PRICE_RANGE: number[] = [PRICE_MIN, PRICE_MAX];

const formatPrice = (value: number) => `₩${value.toLocaleString("ko-KR")}`;

const initialInput: ProductsInquiry = {
  page: 1,
  limit: 12,
  sort: "createdAt",
  direction: Direction.DESC,
  search: {},
};

interface ProductsProps {
  initialInput?: ProductsInquiry;
}

const Products = ({
  initialInput: propInput = initialInput,
}: ProductsProps) => {
  const { t } = useTranslation();
  const device = useDeviceDetect();
  const user = useReactiveVar(userVar);

  const [searchFilter, setSearchFilter] = useState<ProductsInquiry>(propInput);

  const [searchText, setSearchText] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("new");
  // The slider tracks the drag locally; only the released value reaches the
  // query, so dragging doesn't fire a request per pixel.
  const [priceRange, setPriceRange] = useState<number[]>(DEFAULT_PRICE_RANGE);

  const [isPriceOpen, setIsPriceOpen] = useState(true);
  const [isPetTypeOpen, setIsPetTypeOpen] = useState(true);
  const [isCategoryOpen, setIsCategoryOpen] = useState(true);
  const [isLikedOpen, setIsLikedOpen] = useState(true);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const productsTopRef = useRef<HTMLDivElement | null>(null);

  /** APOLLO REQUESTS **/

  const {
    data: getProductsData,
    previousData: getProductsPreviousData,
    error: getProductsError,
    loading: getProductsLoading,
    refetch: getProductsRefetch,
  } = useQuery(GET_PRODUCTS, {
    fetchPolicy: "cache-and-network", // cache + => network
    variables: { input: searchFilter },
    notifyOnNetworkStatusChange: true,
  });

  /** LIFECYCLES **/

  // meLiked is computed server-side from the auth token, so re-run the query
  // whenever the logged-in member changes (login / logout / reload).
  useEffect(() => {
    getProductsRefetch({ input: searchFilter });
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

  // Keep the previous page of results on screen while the next filter loads,
  // but drop them the moment the query errors — the API answers an empty result
  // set with "No data found!" rather than an empty list, and that has to surface
  // as the no-data empty state.
  const getProductsResult = getProductsError
    ? undefined
    : (getProductsData ?? getProductsPreviousData);
  const products: Product[] = getProductsResult?.getProducts?.list ?? [];
  const total: number =
    getProductsResult?.getProducts?.metaCounter?.[0]?.total ?? 0;

  const selectedPetTypes = searchFilter.search.productPetType ?? [];
  const selectedCategories = searchFilter.search.productType ?? [];
  const likedSelected = Boolean(searchFilter.search.onlyLiked);
  const isDefaultPriceRange =
    priceRange[0] === PRICE_MIN && priceRange[1] === PRICE_MAX;
  const totalPages = Math.max(1, Math.ceil(total / searchFilter.limit));
  const activeFilterCount =
    selectedPetTypes.length +
    selectedCategories.length +
    (likedSelected ? 1 : 0) +
    (isDefaultPriceRange ? 0 : 1);

  /** HANDLERS **/

  const petTypeToggleHandler = (value: ProductPetType) => {
    setSearchFilter((prev) => {
      const current = prev.search.productPetType ?? [];
      const next = current.includes(value)
        ? current.filter((petType) => petType !== value)
        : [...current, value];
      return {
        ...prev,
        page: 1,
        search: {
          ...prev.search,
          productPetType: next.length ? next : undefined,
        },
      };
    });
  };

  const categoryToggleHandler = (value: ProductType) => {
    setSearchFilter((prev) => {
      const current = prev.search.productType ?? [];
      const next = current.includes(value)
        ? current.filter((type) => type !== value)
        : [...current, value];
      return {
        ...prev,
        page: 1,
        search: { ...prev.search, productType: next.length ? next : undefined },
      };
    });
  };

  const petTypeClearHandler = () => {
    setSearchFilter((prev) => ({
      ...prev,
      page: 1,
      search: { ...prev.search, productPetType: undefined },
    }));
  };

  const categoryClearHandler = () => {
    setSearchFilter((prev) => ({
      ...prev,
      page: 1,
      search: { ...prev.search, productType: undefined },
    }));
  };

  const priceChangeHandler = (_event: Event, newValue: number | number[]) => {
    if (Array.isArray(newValue)) setPriceRange(newValue);
  };

  const priceCommitHandler = (
    _event: Event | SyntheticEvent,
    newValue: number | number[],
  ) => {
    if (!Array.isArray(newValue)) return;
    const [min, max] = newValue;
    setSearchFilter((prev) => ({
      ...prev,
      page: 1,
      search: {
        ...prev.search,
        // An untouched slider must not filter anything out — a product priced
        // above the slider maximum should still be listed.
        priceRange:
          min === PRICE_MIN && max === PRICE_MAX ? undefined : { min, max },
      },
    }));
  };

  const likedToggleHandler = async () => {
    // onlyLiked is resolved from the auth token, so it is a silent no-op for
    // guests — ask them to log in instead of showing an unchanged list.
    if (!user?._id) {
      await sweetMixinErrorAlert(Messages.error2);
      return;
    }
    setSearchFilter((prev) => ({
      ...prev,
      page: 1,
      search: {
        ...prev.search,
        onlyLiked: prev.search.onlyLiked ? undefined : true,
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

    if (!productsTopRef.current) return;

    const scrollTarget =
      window.scrollY + productsTopRef.current.getBoundingClientRect().top - 210;

    window.scrollTo({
      top: Math.max(0, scrollTarget),
      behavior: "smooth",
    });
  };

  const sidebarContent = (
    <>
      <Box className="search-box">
        <Input
          placeholder={t("list.searchHere")}
          disableUnderline
          className="text-field"
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              searchApplyHandler();
            }
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
          onClick={() => setIsPriceOpen((prev) => !prev)}
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
              onChange={priceChangeHandler}
              onChangeCommitted={priceCommitHandler}
              min={PRICE_MIN}
              max={PRICE_MAX}
              step={PRICE_STEP}
              valueLabelDisplay="off"
              className="price-line"
            />

            <Typography className="selected-price">
              {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
            </Typography>
          </Box>
        </Stack>
      </Stack>

      <Divider className="divider" />

      <Stack className="category-section">
        <Stack
          className="category-header"
          onClick={() => setIsPetTypeOpen((prev) => !prev)}
        >
          <Typography className="category-title">PetTypes</Typography>
          <Box
            className={`category-toggle ${isPetTypeOpen ? "is-open" : ""}`}
            aria-hidden="true"
          />
        </Stack>
        <Stack className={`category-list ${isPetTypeOpen ? "is-open" : ""}`}>
          <Stack
            className={`category-option ${
              selectedPetTypes.length === 0 ? "is-selected" : ""
            }`}
            onClick={petTypeClearHandler}
          >
            <Box className="category-checkbox" aria-hidden="true" />
            <Typography className="category-label">All</Typography>
          </Stack>
          {PET_TYPE_OPTIONS.map((petType) => (
            <Stack
              key={petType.value}
              className={`category-option ${
                selectedPetTypes.includes(petType.value) ? "is-selected" : ""
              }`}
              onClick={() => petTypeToggleHandler(petType.value)}
            >
              <Box className="category-checkbox" aria-hidden="true" />
              <Typography className="category-label">
                {t(petType.labelKey)}
              </Typography>
            </Stack>
          ))}
        </Stack>
      </Stack>

      <Divider className="divider" />

      <Stack className="category-section">
        <Stack
          className="category-header"
          onClick={() => setIsCategoryOpen((prev) => !prev)}
        >
          <Typography className="category-title">Category</Typography>
          <Box
            className={`category-toggle ${isCategoryOpen ? "is-open" : ""}`}
            aria-hidden="true"
          />
        </Stack>
        <Stack className={`category-list ${isCategoryOpen ? "is-open" : ""}`}>
          <Stack
            className={`category-option ${
              selectedCategories.length === 0 ? "is-selected" : ""
            }`}
            onClick={categoryClearHandler}
          >
            <Box className="category-checkbox" aria-hidden="true" />
            <Typography className="category-label">All</Typography>
          </Stack>
          {CATEGORY_OPTIONS.map((category) => (
            <Stack
              key={category.value}
              className={`category-option ${
                selectedCategories.includes(category.value) ? "is-selected" : ""
              }`}
              onClick={() => categoryToggleHandler(category.value)}
            >
              <Box className="category-checkbox" aria-hidden="true" />
              <Typography className="category-label">
                {t(category.labelKey)}
              </Typography>
            </Stack>
          ))}
        </Stack>
      </Stack>
      <Divider className="divider" />

      <Stack className="liked-products-section">
        <Stack
          className="likes-header"
          onClick={() => setIsLikedOpen((prev) => !prev)}
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
            <Typography className="likes-label">Liked Products</Typography>
          </Stack>
          <Divider className="likes-divider" />
        </Stack>
      </Stack>
    </>
  );

  return (
    <Stack className="products-section">
      <Stack className="container">
        <Box className="title">Products</Box>
        <Stack className="products-main">
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

          <Stack className="sorting-products" ref={productsTopRef}>
            <Box className="filter-section-wrap">
              <Select
                value={sortBy}
                onChange={(event) =>
                  sortHandler(event.target.value as SortOption)
                }
                className="filter-section"
                MenuProps={{
                  disableScrollLock: true,
                  PaperProps: { className: "filter-menu" },
                  MenuListProps: { className: "filter-menu-list" },
                }}
              >
                {SORT_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {t(option.labelKey)}
                  </MenuItem>
                ))}
              </Select>
            </Box>

            <Stack className="products-cards">
              {products.length !== 0 ? (
                products.map((product) => (
                  <ProductsCard
                    key={product._id}
                    product={product}
                    getProductsRefetch={getProductsRefetch}
                  />
                ))
              ) : !getProductsLoading ? (
                <Box className="no-data-wrap">
                  <img
                    className="no-data-img"
                    src="/img/icons/no-data.png"
                    alt="No products found"
                  />
                </Box>
              ) : null}

              <Stack className="pagination-section">
                {products.length !== 0 && (
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
            label: `Show ${total} product${total === 1 ? "" : "s"}`,
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

export default Products;
