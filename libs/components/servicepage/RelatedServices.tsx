import { useState } from "react";
import { Box, Stack } from "@mui/material";
import ServiceCard, { ServiceItem } from "./ServiceCard";

const initialRelatedServices: ServiceItem[] = [
  {
    _id: "rel-1",
    serviceName: "Premium Dog Grooming",
    category: "Grooming",
    image: "/img/services/grooming.jpg",
    price: 50,
    duration: "45 min",
    location: "Seoul",
    rating: 4.4,
    reviewCount: 128,
    likes: 121,
  },
  {
    _id: "rel-2",
    serviceName: "Cat Overnight Boarding",
    category: "Boarding",
    image: "/img/services/boarding.png",
    price: 65,
    duration: "per night",
    location: "Daegu",
    rating: 4.2,
    reviewCount: 73,
    likes: 121,
  },
  {
    _id: "rel-3",
    serviceName: "Full Day Pet Day Care",
    category: "Day Care",
    image: "/img/services/boarding.png",
    price: 45,
    duration: "8 hrs",
    location: "Gyeongju",
    rating: 4.2,
    reviewCount: 58,
    likes: 121,
  },
  {
    _id: "rel-4",
    serviceName: "Vet Check-Up & Vaccines",
    category: "Veterinary",
    image: "/img/services/grooming.jpg",
    price: 80,
    duration: "30 min",
    location: "Jeju",
    rating: 4.2,
    reviewCount: 211,
    likes: 121,
  },
  {
    _id: "rel-5",
    serviceName: "Basic Obedience Training",
    category: "Training",
    image: "/img/services/walking.jpg",
    price: 75,
    duration: "60 min",
    location: "Incheon",
    rating: 4.7,
    reviewCount: 164,
    likes: 138,
  },
];

const RelatedServices = () => {
  const [services, setServices] = useState(initialRelatedServices);

  const toggleLike = (id: string) => {
    setServices((prev) =>
      prev.map((s) =>
        s._id === id
          ? { ...s, liked: !s.liked, likes: Math.max(0, s.likes + (s.liked ? -1 : 1)) }
          : s,
      ),
    );
  };

  return (
    <Stack className="related-services">
      <Stack className="container">
        <Box className="related-services-title">
          Related Services <img src="/img/logo/Union.svg" alt="" />
        </Box>
        <Stack className="agents-cards">
          {services.map((service) => (
            <ServiceCard
              key={service._id}
              item={service}
              onToggleLike={() => toggleLike(service._id)}
            />
          ))}
        </Stack>
      </Stack>
    </Stack>
  );
};

export default RelatedServices;
