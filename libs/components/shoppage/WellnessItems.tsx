import { Box, IconButton, Stack } from "@mui/material";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import { useEffect, useMemo, useState, type CSSProperties } from "react";
import WellnessItemsCard, {
  type WellnessItem,
} from "@/libs/components/shoppage/WellnessItemsCard";

const wellnessItems: WellnessItem[] = [
  {
    id: "fillet-o-lakes",
    name: "FILLET O’ LAKES - KITTEN",
    image: "/img/products/fillet.png",
  },
  {
    id: "encore-cat-food",
    name: "ENCORE - CAT FOOD",
    image: "/img/products/encore.png",
  },
  {
    id: "wellness-signature",
    name: "WELLNESS - SIGNATURE",
    image: "/img/products/wellness.png",
  },
  {
    id: "royal-canin-care",
    name: "ROYAL CANIN - CARE",
    image: "/img/products/royal-canin.png",
  },
  {
    id: "ball-dog",
    name: "PLAY BALL - DOG TOY",
    image: "/img/products/ball-dog.png",
  },
  {
    id: "fillet-o-lakes",
    name: "FILLET O’ LAKES - KITTEN",
    image: "/img/products/fillet.png",
  },
  {
    id: "encore-cat-food",
    name: "ENCORE - CAT FOOD",
    image: "/img/products/encore.png",
  },
  {
    id: "wellness-signature",
    name: "WELLNESS - SIGNATURE",
    image: "/img/products/wellness.png",
  },
  {
    id: "royal-canin-care",
    name: "ROYAL CANIN - CARE",
    image: "/img/products/royal-canin.png",
  },
  {
    id: "ball-dog",
    name: "PLAY BALL - DOG TOY",
    image: "/img/products/ball-dog.png",
  },
];

const cardWidth = 220;
const cardGap = 28;
const autoPlayDelay = 1500;
const WellnessItems = () => {
  const totalItems = wellnessItems.length;
  const middleOffset = totalItems;
  const [activeIndex, setActiveIndex] = useState(
    () => middleOffset + Math.min(2, Math.max(0, totalItems - 1)),
  );
  const [isPaused, setIsPaused] = useState(false);
  const [disableTransition, setDisableTransition] = useState(false);

  const loopItems = useMemo(
    () => [...wellnessItems, ...wellnessItems, ...wellnessItems],
    [],
  );

  useEffect(() => {
    if (isPaused || totalItems <= 1) return;
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => prev + 1);
    }, autoPlayDelay);

    return () => window.clearInterval(timer);
  }, [isPaused, totalItems]);

  useEffect(() => {
    if (totalItems === 0) return;
    if (activeIndex < totalItems) {
      setDisableTransition(true);
      setActiveIndex(activeIndex + totalItems);
      return;
    }
    if (activeIndex >= totalItems * 2) {
      setDisableTransition(true);
      setActiveIndex(activeIndex - totalItems);
    }
  }, [activeIndex, totalItems]);

  useEffect(() => {
    if (!disableTransition) return;
    const frame = window.requestAnimationFrame(() =>
      setDisableTransition(false),
    );
    return () => window.cancelAnimationFrame(frame);
  }, [disableTransition]);

  const trackStyle = useMemo<CSSProperties>(
    () => ({
      transform: `translateX(calc(50% - ${cardWidth / 2}px - ${
        (cardWidth + cardGap) * activeIndex
      }px))`,
    }),
    [activeIndex],
  );

  const getCardStyle = (distance: number) => {
    if (distance <= 0) {
      return {
        "--card-scale": 1.05,
        "--card-opacity": 1,
        "--card-shift": "0px",
      } as CSSProperties;
    }
    if (distance === 1) {
      return {
        "--card-scale": 0.95,
        "--card-opacity": 0.7,
        "--card-shift": "8px",
      } as CSSProperties;
    }
    if (distance === 2) {
      return {
        "--card-scale": 0.88,
        "--card-opacity": 0.5,
        "--card-shift": "14px",
      } as CSSProperties;
    }
    return {
      "--card-scale": 0.8,
      "--card-opacity": 0.3,
      "--card-shift": "20px",
    } as CSSProperties;
  };

  const onPrev = () => {
    setActiveIndex((prev) => prev - 1);
  };

  const onNext = () => {
    setActiveIndex((prev) => prev + 1);
  };

  return (
    <Stack className="wellness-section">
      <Stack className="container">
        <Stack className="wellness-header" direction="row">
          <IconButton
            className="header-nav prev"
            onClick={onPrev}
            aria-label="Previous item"
          >
            <ChevronLeftRoundedIcon />
          </IconButton>
          <Box className="title">WELLNESS - SIGNATURE SELECT TM</Box>
          <IconButton
            className="header-nav next"
            onClick={onNext}
            aria-label="Next item"
          >
            <ChevronRightRoundedIcon />
          </IconButton>
        </Stack>

        <Box
          className="wellness-carousel"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <Box
            className={`carousel-track ${
              disableTransition ? "no-transition" : ""
            }`}
            style={trackStyle}
          >
            {loopItems.map((item, index) => {
              const distance = Math.min(Math.abs(index - activeIndex), 3);
              return (
                <WellnessItemsCard
                  key={`${item.id}-${index}`}
                  item={item}
                  active={index === activeIndex}
                  style={getCardStyle(distance)}
                  onSelect={() => setActiveIndex(index)}
                />
              );
            })}
          </Box>
        </Box>
      </Stack>
    </Stack>
  );
};

export default WellnessItems;
