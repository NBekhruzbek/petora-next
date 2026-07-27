import { Box, Stack } from "@mui/material";
import { useRouter } from "next/router";
import { useQuery } from "@apollo/client";
import ProductsCard from "./ProductsCard";
import { GET_RELATED_PRODUCTS } from "@/apollo/user/query";
import { Product } from "@/libs/types/product/product";

const RelatedProducts = () => {
  const router = useRouter();
  // The product cards navigate to /shop/detail?id=<productId>, so the
  // currently viewed product id comes straight from the query string.
  const productId = router.query.id as string | undefined;

  /** APOLLO REQUESTS **/

  const { data, refetch: getProductsRefetch } = useQuery(GET_RELATED_PRODUCTS, {
    fetchPolicy: "cache-and-network",
    variables: { input: productId },
    skip: !productId,
    notifyOnNetworkStatusChange: true,
  });

  const relatedProducts: Product[] = data?.getRelatedProducts ?? [];

  if (relatedProducts.length === 0) return null;

  return (
    <Stack className="related-products">
      <Stack className="container">
        <Box className={"related-products-title"}>
          Other Products may You Like <img src="/img/logo/Union.svg" alt="" />
        </Box>
        <Stack className="product-cards">
          {relatedProducts.map((product) => (
            <ProductsCard
              key={product._id}
              product={product}
              getProductsRefetch={getProductsRefetch}
            />
          ))}
        </Stack>
      </Stack>
    </Stack>
  );
};

export default RelatedProducts;
