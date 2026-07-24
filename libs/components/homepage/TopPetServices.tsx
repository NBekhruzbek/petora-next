import { Box, Stack } from "@mui/material";
import { useState } from "react";
import ServiceCard, { ServiceItem } from "../servicepage/ServiceCard";

const topPetServiceItems: ServiceItem[] = [
  {
    _id: "top-svc-1",
    serviceName: "Vet Check-Up & Vaccines",
    category: "Veterinary",
    image: "/img/services/grooming.jpg",
    price: 80,
    duration: "30 min",
    location: "Seoul",
    rating: 4.7,
    reviewCount: 304,
    likes: 267,
    liked: false,
    bookingCount: 3210,
  },
  {
    _id: "top-svc-2",
    serviceName: "Daily Dog Walk – 1 hr",
    category: "Walking",
    image: "/img/services/walking.jpg",
    price: 25,
    duration: "60 min",
    location: "Seoul",
    rating: 4.7,
    reviewCount: 256,
    likes: 201,
    liked: true,
    bookingCount: 2140,
  },
  {
    _id: "top-svc-3",
    serviceName: "Basic Obedience Training",
    category: "Training",
    image: "/img/services/training.jpg",
    price: 90,
    duration: "60 min",
    location: "Seoul",
    rating: 4.8,
    reviewCount: 211,
    likes: 321,
    liked: true,
    bookingCount: 1920,
  },
  {
    _id: "top-svc-4",
    serviceName: "Cat Overnight Boarding",
    category: "Boarding",
    image: "/img/services/boarding.png",
    price: 65,
    duration: "per night",
    location: "Daegu",
    rating: 4.9,
    reviewCount: 89,
    likes: 312,
    liked: true,
    bookingCount: 527,
  },
];

const TopPetServices = () => {
  const [items, setItems] = useState(topPetServiceItems);

  const onToggleLike = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item._id === id
          ? {
              ...item,
              liked: !item.liked,
              likes: Math.max(0, item.likes + (item.liked ? -1 : 1)),
            }
          : item,
      ),
    );
  };

  return (
    <Stack className="top-pet-services">
      <Stack className="container">
        <Box className="section-title">
          top pet services
          <img className="hand-icon" src="/img/logo/Union.svg" alt="" />
        </Box>
        <Box className={"desc-text"}>Top Services are based on Bookings</Box>

        <Stack className="top-pet-services-grid">
          {items.map((item) => (
            <ServiceCard
              key={item._id}
              item={item}
              onToggleLike={() => onToggleLike(item._id)}
            />
          ))}
        </Stack>
      </Stack>
    </Stack>
  );
};

export default TopPetServices;
