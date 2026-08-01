import { Box, Stack } from "@mui/material";

const PetYouLike = () => {
  return (
    <Stack className={"pet-you-like-section"}>
      <Stack className="container">
        <Box className={"title"}>
          Find out what kind of pet you like{" "}
          <span>
            <img className="hand-icon" src="/img/logo/Union.svg" alt="" />
          </span>
        </Box>
        <Stack className="images">
          <img className="black-dog" src="/img/pets/black-dog.jpg" alt="" />
          <img className="model-pets" src="/img/pets/model-pets.jpg" alt="" />
          <img className="ghost-dog" src="/img/pets/ghost-dog.jpg" alt="" />
        </Stack>
      </Stack>
    </Stack>
  );
};

export default PetYouLike;
