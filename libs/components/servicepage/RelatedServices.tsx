import { Box, Stack } from "@mui/material";
import ServiceAgentsCard, { AgentItem } from "./ServiceAgentsCard";

const agents: AgentItem[] = [
  {
    _id: "agent-1",
    name: "Kelvin John",
    serviceType: "Grooming",
    image: "/img/agents/topAgent1.jpg",
    price: "$50~$220",
    likes: 121,
    rating: 4.4,
    bookings: 111,
  },
  {
    _id: "agent-4",
    name: "Sophia Brown",
    serviceType: "Boarding",
    image: "/img/agents/topAgent4.jpg",
    price: "$100~$520",
    likes: 121,
    rating: 4.2,
    bookings: 111,
  },
  {
    _id: "agent-6",
    name: "Noah Taylor",
    serviceType: "Day Care | Walking",
    image: "/img/agents/topAgent7.jpeg",
    price: "$90~$320",
    likes: 121,
    rating: 4.2,
    bookings: 111,
  },
  {
    _id: "agent-7",
    name: "Noah Taylor",
    serviceType: "Veterinary",
    image: "/img/agents/topAgent6.jpg",
    price: "$10~$990",
    likes: 121,
    rating: 4.2,
    bookings: 211,
  },
  {
    _id: "agent-8",
    name: "Emma Wilson",
    serviceType: "Training | Walking",
    image: "/img/agents/topAgent3.jpg",
    price: "$45~$180",
    likes: 138,
    rating: 4.7,
    bookings: 164,
  },
];

const RelatedServices = () => {
  return (
    <Stack className="related-services">
      <Stack className="container">
        <Box className={"related-services-title"}>
          Related Services from TOP AGENTS{" "}
          <img src="/img/logo/Union.svg" alt="" />
        </Box>
        <Stack className="agents-cards">
          {agents.map((agent) => {
            return <ServiceAgentsCard key={agent._id} item={agent} />;
          })}
        </Stack>
      </Stack>
    </Stack>
  );
};

export default RelatedServices;
