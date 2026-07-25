import { Box, Button, Stack } from "@mui/material";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import Link from "next/link";
import { Member } from "@/libs/types/member/member";
import { REACT_APP_API_URL } from "@/libs/config";
import router from "next/router";
import { KeyboardEvent } from "react";

type TopServiceAgentsProps = {
  agent: Member;
};

const agentDetailHref = "/agents/detail";

const TopAgentsCard = ({ agent }: TopServiceAgentsProps) => {
  /** HANDLERS **/

  const handleCardClick = () => {
    void router.push(agentDetailHref);
  };

  const handleCardKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleCardClick();
    }
  };

  return (
    <Stack className="top-agents-card">
      <Box className="agent-image-wrap">
        <img
          className="agent-image"
          src={`${REACT_APP_API_URL}/${agent?.memberImage}`}
          alt={agent.memberUserName}
        />
      </Box>

      <Stack className="agent-content">
        <Box className="agent-name">{agent.memberUserName}</Box>
        <Box className="agent-email">{agent.memberEmail}</Box>

        <Button
          className="message-btn"
          variant="outlined"
          onClick={handleCardClick}
          onKeyDown={handleCardKeyDown}
          startIcon={<ChatBubbleOutlineRoundedIcon />}
        >
          Read More
        </Button>
      </Stack>
    </Stack>
  );
};

export default TopAgentsCard;
