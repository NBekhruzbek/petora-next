import { Box, Container, Stack } from "@mui/material";

export default function Home() {
  return (
    <>
      <Stack sx={{ background: "#F2E2FF" }}>Header</Stack>
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
      <Stack sx={{ background: "#F2E2FF" }}>Footer</Stack>
    </>
  );
}
