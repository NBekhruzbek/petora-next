import { Box, Stack } from "@mui/material";
import TopAgentsCard, { type TopAgentItem } from "./TopAgentsCard";

const agents: TopAgentItem[] = [
  {
    id: "agent-1",
    name: "Kelvin John",
    email: "kelvin.john@gmail.com",
    image: "/img/agents/topAgent1.jpg",
  },
  {
    id: "agent-2",
    name: "Emma Watson",
    email: "emma.watson@gmail.com",
    image: "/img/agents/topAgent2.png",
  },
  {
    id: "agent-3",
    name: "Daniel Smith",
    email: "daniel.smith@gmail.com",
    image: "/img/agents/topAgent3.jpg",
  },
  {
    id: "agent-4",
    name: "Sophia Brown",
    email: "sophia.brown@gmail.com",
    image: "/img/agents/topAgent4.jpg",
  },
  {
    id: "agent-5",
    name: "Liam Wilson",
    email: "liam.wilson@gmail.com",
    image: "/img/agents/topAgent5.jpeg",
  },
  {
    id: "agent-6",
    name: "Noah Taylor",
    email: "noah.taylor@gmail.com",
    image: "/img/agents/topAgent7.jpeg",
  },
  {
    id: "agent-6",
    name: "Noah Taylor",
    email: "noah.taylor@gmail.com",
    image: "/img/agents/topAgent6.jpg",
  },
  {
    id: "agent-6",
    name: "Noah Taylor",
    email: "noah.taylor@gmail.com",
    image: "/img/agents/topAgent8.jpeg",
  },
];

const TopAgents = () => {
  return (
    <Stack className="top-agents">
      <Stack className="container">
        <Box className="section-title">
          TOP AGENTS
          <img className="hand-icon" src="/img/logo/Union.svg" alt="" />
        </Box>

        <Box className="agents-marquee">
          <Stack className="agents-track" direction="row">
            {[0, 1].map((loopIndex) => (
              <Stack key={loopIndex} className="agents-segment" direction="row">
                {agents.map((agent) => (
                  <Box key={`${loopIndex}-${agent.id}`} className="agents-item">
                    <TopAgentsCard item={agent} />
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
