import { Box, Button, Stack } from "@mui/material";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import Link from "next/link";
import { Member } from "@/libs/types/member/member";
import { REACT_APP_API_URL } from "@/libs/config";
import router from "next/router";
import { KeyboardEvent } from "react";
import { useTranslation } from "react-i18next";

type TopServiceAgentsProps = {
  agent: Member;
};

const agentDetailHref = "/agents/detail";

const TopAgentsCard = ({ agent }: TopServiceAgentsProps) => {
  const { t } = useTranslation();
  /** HANDLERS **/

  const handleCardClick = () => {
    void router.push({ pathname: agentDetailHref, query: { id: agent._id } });
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
          {t("actions.readMore")}
        </Button>
      </Stack>
    </Stack>
  );
};

export default TopAgentsCard;
