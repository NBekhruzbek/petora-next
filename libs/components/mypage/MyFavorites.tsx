import { useTranslation } from "react-i18next";
import React, { ChangeEvent, useRef, useState } from "react";
import {
  Box,
  Pagination,
  PaginationItem,
  Stack,
  Tab,
  Tabs,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useQuery } from "@apollo/client";
import ProductsCard from "../shoppage/ProductsCard";
import ServiceCard from "../servicepage/ServiceCard";
import {
  GET_FAVORITE_PRODUCTS,
  GET_FAVORITE_SERVICES,
} from "@/apollo/user/query";
import { Product } from "@/libs/types/product/product";
import { Service } from "@/libs/types/service/service";
import { T } from "@/libs/types/common";
import { Message } from "@/libs/enums/common.enum";
import EmptyState from "../common/EmptyState";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import { useRouter } from "next/router";

const PRODUCT_LIMIT = 12;
const SERVICE_LIMIT = 6;

const MyFavorites = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);
  const [productPage, setProductPage] = useState(1);
  const [servicePage, setServicePage] = useState(1);
  const [favProducts, setFavProducts] = useState<Product[]>([]);
  const [productTotal, setProductTotal] = useState(0);
  const [favServices, setFavServices] = useState<Service[]>([]);
  const [serviceTotal, setServiceTotal] = useState(0);

  const productsTopRef = useRef<HTMLDivElement | null>(null);
  const servicesTopRef = useRef<HTMLDivElement | null>(null);

  /** APOLLO REQUESTS **/

  const { refetch: favProductsRefetch } = useQuery(GET_FAVORITE_PRODUCTS, {
    fetchPolicy: "cache-and-network",
    variables: { input: { page: productPage, limit: PRODUCT_LIMIT } },
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: T) => {
      setFavProducts(data?.getFavoriteProducts?.list ?? []);
      setProductTotal(data?.getFavoriteProducts?.metaCounter?.[0]?.total ?? 0);
    },
    // The API throws "No data found!" for an empty list instead of returning
    // an empty array, so clear the state to render the empty grid.
    onError: (error) => {
      if (
        error.graphQLErrors?.some((e) => e.message === Message.NO_DATA_FOUND)
      ) {
        setFavProducts([]);
        setProductTotal(0);
      }
    },
  });

  const { refetch: favServicesRefetch } = useQuery(GET_FAVORITE_SERVICES, {
    fetchPolicy: "cache-and-network",
    variables: { input: { page: servicePage, limit: SERVICE_LIMIT } },
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: T) => {
      setFavServices(data?.getFavoriteServices?.list ?? []);
      setServiceTotal(data?.getFavoriteServices?.metaCounter?.[0]?.total ?? 0);
    },
    // The API throws "No data found!" for an empty list instead of returning
    // an empty array, so clear the state to render the empty grid.
    onError: (error) => {
      if (
        error.graphQLErrors?.some((e) => e.message === Message.NO_DATA_FOUND)
      ) {
        setFavServices([]);
        setServiceTotal(0);
      }
    },
  });

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleProductPageChange = (
    _event: ChangeEvent<unknown>,
    page: number,
  ) => {
    setProductPage(page);
    if (!productsTopRef.current) return;
    const scrollTarget =
      window.scrollY + productsTopRef.current.getBoundingClientRect().top - 210;
    window.scrollTo({ top: Math.max(0, scrollTarget), behavior: "smooth" });
  };

  const handleServicePageChange = (
    _event: ChangeEvent<unknown>,
    page: number,
  ) => {
    setServicePage(page);
    if (!servicesTopRef.current) return;
    const scrollTarget =
      window.scrollY + servicesTopRef.current.getBoundingClientRect().top - 210;
    window.scrollTo({ top: Math.max(0, scrollTarget), behavior: "smooth" });
  };

  const productTotalPages = Math.max(
    1,
    Math.ceil(productTotal / PRODUCT_LIMIT),
  );
  const serviceTotalPages = Math.max(
    1,
    Math.ceil(serviceTotal / SERVICE_LIMIT),
  );

  return (
    <Stack className="my-favorites-container" spacing={3}>
      <Box className="my-favorites-tabs-wrapper">
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="my favorites tabs"
        >
          <Tab label={t("mypage.favorites.products")} />
          <Tab label={t("mypage.favorites.services")} />
        </Tabs>
      </Box>

      <Box className="my-favorites-tab-content">
        {activeTab === 0 && (
          <Stack className="fav-products-wrap" ref={productsTopRef}>
            {favProducts.length === 0 && (
              <EmptyState
                icon={<FavoriteBorderRoundedIcon />}
                title={t("mypage.favorites.emptyProducts")}
                description={t("mypage.favorites.emptyProductsDesc")}
                action={{
                  label: t("mypage.favorites.browseShop"),
                  onClick: () => void router.push("/shop"),
                }}
              />
            )}
            <Stack className="fav-products-grid">
              {favProducts.map((product) => (
                <ProductsCard
                  key={product._id}
                  product={product}
                  getProductsRefetch={favProductsRefetch}
                  defaultFavorite
                />
              ))}
            </Stack>
            {productTotal > PRODUCT_LIMIT && (
              <Stack className="pagination-section">
                <Pagination
                  count={productTotalPages}
                  page={productPage}
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
                  onChange={handleProductPageChange}
                />
              </Stack>
            )}
          </Stack>
        )}

        {activeTab === 1 && (
          <Stack className="fav-services-wrap" ref={servicesTopRef}>
            {favServices.length === 0 && (
              <EmptyState
                icon={<FavoriteBorderRoundedIcon />}
                title={t("mypage.favorites.emptyServices")}
                description={t("mypage.favorites.emptyServicesDesc")}
                action={{
                  label: t("mypage.favorites.findService"),
                  onClick: () => void router.push("/service"),
                }}
              />
            )}
            <Stack className="fav-agents-grid">
              {favServices.map((service) => (
                <ServiceCard
                  key={service._id}
                  service={service}
                  getServicesRefetch={favServicesRefetch}
                  defaultFavorite
                />
              ))}
            </Stack>
            {serviceTotal > SERVICE_LIMIT && (
              <Stack className="pagination-section">
                <Pagination
                  count={serviceTotalPages}
                  page={servicePage}
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
                  onChange={handleServicePageChange}
                />
              </Stack>
            )}
          </Stack>
        )}
      </Box>
    </Stack>
  );
};

export default MyFavorites;
