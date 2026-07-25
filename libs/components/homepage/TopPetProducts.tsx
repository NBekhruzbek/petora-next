import { Box, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import TopPetProductsCard from "./TopPetProductsCard";
import { ProductsInquiry } from "@/libs/types/product/product.input";
import { Product } from "@/libs/types/product/product";
import { useQuery, useReactiveVar } from "@apollo/client";
import { GET_PRODUCTS } from "@/apollo/user/query";
import { userVar } from "@/apollo/store";
import { T } from "@/libs/types/common";
import { Direction } from "@/libs/enums/common.enum";

interface TopPetProductsProps {
  initialInput?: ProductsInquiry;
}

const defaultInput: ProductsInquiry = {
  page: 1,
  limit: 4,
  sort: "productRank",
  search: {},
};

const TopPetProducts = ({
  initialInput = defaultInput,
}: TopPetProductsProps) => {
  const [topProducts, setTopProducts] = useState<Product[]>([]);
  const user = useReactiveVar(userVar);

  /** APOLLO REQUESTS **/

  const {
    loading: getProductsLoading,
    data: getProductsData,
    error: getProductsError,
    refetch: getProductsRefetch,
  } = useQuery(GET_PRODUCTS, {
    fetchPolicy: "cache-and-network", // cache + => network
    variables: { input: initialInput },
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: T) => {
      setTopProducts(data?.getProducts?.list);
    },
  });

  /** LIFECYCLES **/

  // meLiked is computed server-side from the auth token, so re-run the
  // query whenever the logged-in member changes (login / logout / reload).
  useEffect(() => {
    getProductsRefetch({ input: initialInput });
  }, [user?._id]);

  /** HANDLERS **/

  return (
    <Stack className="top-pet-products">
      <Stack className="container">
        <Box className="section-title">
          top pet products
          <img className="hand-icon" src="/img/logo/Union.svg" alt="" />
        </Box>
        <Box className={"desc-text"}>
          Top Products are based on Rating, Sold Times, Likes and Views.
        </Box>

        <Stack className="top-pet-products-grid">
          {topProducts.map((product: Product) => {
            return (
              <TopPetProductsCard
                key={product._id}
                product={product}
                getProductsRefetch={getProductsRefetch}
              />
            );
          })}
        </Stack>
      </Stack>
    </Stack>
  );
};

export default TopPetProducts;
