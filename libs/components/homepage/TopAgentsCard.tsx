import { Box, Button, Stack } from "@mui/material";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import Link from "next/link";

export type TopAgentItem = {
  id: string;
  name: string;
  email: string;
  image: string;
};

type TopAgentsCardProps = {
  item: TopAgentItem;
};

const TopAgentsCard = ({ item }: TopAgentsCardProps) => {
  return (
    <Stack className="top-agents-card">
      <Box className="agent-image-wrap">
        <img className="agent-image" src={item.image} alt={item.name} />
      </Box>

      <Stack className="agent-content">
        <Box className="agent-name">{item.name}</Box>
        <Box className="agent-email">{item.email}</Box>

        <Button
          className="message-btn"
          variant="outlined"
          component={Link}
          href="/service/booking"
          startIcon={<ChatBubbleOutlineRoundedIcon />}
        >
          Read More
        </Button>
      </Stack>
    </Stack>
  );
};

export default TopAgentsCard;
