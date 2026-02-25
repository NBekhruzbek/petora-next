import { useRouter } from "next/router";

const Shop = () => {
  const router = useRouter();
  const { productId } = router.query;
  return <div>PRODUCT DETAIL {productId}</div>;
};

export default Shop;
