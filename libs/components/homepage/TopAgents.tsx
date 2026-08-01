import { Box, Stack } from "@mui/material";
import TopAgentsCard from "./TopAgentsCard";
import { AgentsInquiry } from "@/libs/types/member/member.input";
import { useState } from "react";
import { Member } from "@/libs/types/member/member";
import { useQuery, useReactiveVar } from "@apollo/client";
import { userVar } from "@/apollo/store";
import { GET_AGENTS } from "@/apollo/user/query";
import { T } from "@/libs/types/common";
import { useTranslation } from "react-i18next";

interface TopServiceAgentsProps {
  initialInput?: AgentsInquiry;
}

const defaultInput: AgentsInquiry = {
  page: 1,
  limit: 4,
  sort: "memberRank",
  search: {},
};

const TopAgents = ({ initialInput = defaultInput }: TopServiceAgentsProps) => {
  const { t } = useTranslation();
  const [topAgents, setTopAgents] = useState<Member[]>([]);
  const user = useReactiveVar(userVar);

  /** APOLLO REQUESTS **/

  const {
    loading: getAgentsLoading,
    data: getAgentsData,
    error: getAgentsError,
    refetch: getAgentsRefetch,
  } = useQuery(GET_AGENTS, {
    fetchPolicy: "cache-and-network", // cache + => network
    variables: { input: initialInput },
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: T) => {
      setTopAgents(data?.getAgents?.list);
    },
  });

  return (
    <Stack className="top-agents">
      <Stack className="container">
        <Box className="section-title">
          {t("home.topAgents.title")}
          <img className="hand-icon" src="/img/logo/Union.svg" alt="" />
        </Box>

        <Box className="agents-marquee">
          <Stack className="agents-track" direction="row">
            {[0, 1].map((loopIndex) => (
              <Stack key={loopIndex} className="agents-segment" direction="row">
                {topAgents.map((agent: Member) => (
                  <Box
                    key={`${loopIndex}-${agent._id}`}
                    className="agents-item"
                  >
                    <TopAgentsCard agent={agent} />
                  </Box>
                ))}
              </Stack>
            ))}
          </Stack>
        </Box>
      </Stack>
    </Stack>
  );
};

export default TopAgents;
