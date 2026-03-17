import { Box, Stack } from "@mui/material";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";

const UnderstandingYourPet = () => {
  return (
    <Stack className="understanding-your-pet-section">
      <Stack className="container">
        <Box>
          {" "}
          <img className={"pets-image"} src="./img/pets/dog-cat.png" alt="" />
        </Box>
        <Stack className="text-area">
          <Box className={"title"}>
            What Do You Understand{" "}
            <span className="green-title">
              About Your Pet? <img src="./img/logo/Union.svg" alt="" />
            </span>
          </Box>
          <Stack className={"desc-text"}>
            <Box>
              <span>
                <CircleOutlinedIcon className="icon" />
              </span>
              Understanding your pet goes beyond knowing their breed and feeding
              them daily. It involves recognizing their unique behaviors, needs,
              and preferences.
            </Box>
            <Box>
              <span>
                <CircleOutlinedIcon className="icon" />
              </span>
              Each pet has its own personality and ways of communicating,
              whether it's a dog wagging its tail, a cat purring, or a bird
              singing.
            </Box>
            <Box>
              <span>
                <CircleOutlinedIcon className="icon" />
              </span>
              By paying attention to these signals, you can better meet their
              emotional and physical needs. Understanding your pet also means
              being aware of their health, knowing the signs of illness, and
              providing proper veterinary care.
            </Box>
            <Box>
              <span>
                <CircleOutlinedIcon className="icon" />
              </span>
              Building a strong bond through play, training, and affection will
              ensure a happy, healthy, and fulfilling life for both you and your
              pet.
            </Box>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default UnderstandingYourPet;
