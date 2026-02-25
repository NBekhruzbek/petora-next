import withLayoutMain from "@/libs/components/layout/LayoutHome";
import { Box, Container, Stack } from "@mui/material";
import { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <>
      <Container>
        <Stack flexDirection={"column"}>
          <Box>Our Company</Box>
          <Box>What we Offer</Box>
          <Box>Discovery</Box>
          <Box>Species</Box>
          <Box>Advertisement</Box>
          <Box>Discount advertisement</Box>
          <Box>Top Pet Foods</Box>
          <Box>Top Pet Toys</Box>
          <Box>Top Agents</Box>
          <Box>Events</Box>
          <Box>Contuct Us</Box>
        </Stack>
      </Container>
    </>
  );
};

export default withLayoutMain(Home);
