import { Box, Stack } from "@mui/material";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";

const PetNutrition = () => {
  return (
    <Stack className="pet-nutrition-section">
      <Stack className="container">
        <Box className={"title"}>
          Tailored Nutrition{" "}
          <Box className="green-title">
            for Your Pet's Health{" "}
            <img className="hand-icon" src="/img/logo/Union.svg" alt="" />
          </Box>
        </Box>
        <Stack className="nutrition-main">
          <Stack className="info-card">
            <Box className={"icon-box"}>
              <img src="/img/icons/HandHeart.svg" alt="" />
            </Box>
            <Box className={"main-text"}>Nutrition and Health</Box>
            <Box className={"desc-text"}>
              Proper nutrition is key to your pet's health, supporting growth,
              energy, and overall well-being.
            </Box>
          </Stack>
          <Stack className="info-card">
            <Box className={"icon-box"}>
              <img src="/img/icons/CalendarHeart.svg" alt="" />
            </Box>
            <Box className={"main-text"}>Custom Diets</Box>
            <Box className={"desc-text"}>
              Each pet has unique dietary needs. Tailoring their diet ensures
              they get essential nutrients.
            </Box>
          </Stack>
          <Stack className="info-card">
            <Box className={"icon-box"}>
              <WorkspacePremiumOutlinedIcon className="expert-icon" />
            </Box>
            <Box className={"main-text"}>Expert Guidance</Box>
            <Box className={"desc-text"}>
              Professional advice is crucial for managing your pet’s diet,
              ensuring they stay healthy and thrive.
            </Box>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default PetNutrition;
