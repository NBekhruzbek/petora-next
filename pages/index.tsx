import withLayoutMain from "@/libs/components/layout/LayoutHome";
import { Stack } from "@mui/material";
import { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <>
      <Stack>
        <Stack flexDirection={"column"}>
          <Stack>
            <Stack className="container">Our Company</Stack>
          </Stack>
          <Stack>
            <Stack className="container">What we Offer</Stack>
          </Stack>
          <Stack>
            <Stack className="container">Discovery</Stack>
          </Stack>
          <Stack>
            <Stack className="container">Species</Stack>
          </Stack>
          <Stack>
            <Stack className="container">Advertisement</Stack>
          </Stack>
          <Stack>
            <Stack className="container">Discount advertisement</Stack>
          </Stack>
          <Stack>
            <Stack className="container">Top Pet Foods</Stack>
          </Stack>
          <Stack>
            <Stack className="container">Top Pet Toys</Stack>
          </Stack>
          <Stack>
            <Stack className="container">Top Agents</Stack>
          </Stack>
          <Stack>
            <Stack className="container">Events</Stack>
          </Stack>
          <Stack>
            <Stack className="container">Contuct Us</Stack>
          </Stack>
        </Stack>
      </Stack>
    </>
  );
};

export default withLayoutMain(Home);
