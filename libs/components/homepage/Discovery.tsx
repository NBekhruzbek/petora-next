import { useTranslation } from "react-i18next";
import { Box, IconButton, Stack } from "@mui/material";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import { useMemo, useState } from "react";
import DiscoveryCard, { type DiscoveryCardItem } from "./DiscoveryCard";
import useDeviceDetect from "@/libs/hooks/useDeviceDetect";

type DiscoveryCategory = "Dogs" | "Cats" | "Hamsters" | "Birds";

type DiscoveryItem = DiscoveryCardItem & {
  category: DiscoveryCategory;
};

const categories: DiscoveryCategory[] = ["Dogs", "Cats", "Hamsters", "Birds"];

const discoveryItems: DiscoveryItem[] = [
  {
    id: "dog-1",
    category: "Dogs",
    name: "CHIHUAHUA DOG",
    country: "Mexico",
    image: "/img/pets/chihuahua-dog.png",
    liked: false,
    stats: { difficulty: 73, ferocious: 91, space: 73, groups: 73 },
    description:
      "Chihuahuas are tiny companion dogs known for their lively and alert character.",
  },
  {
    id: "dog-2",
    category: "Dogs",
    name: "DACHSHUND DOG",
    country: "Germany",
    image: "/img/pets/dachshund-dog.png",
    liked: true,
    stats: { difficulty: 73, ferocious: 91, space: 73, groups: 73 },
    description:
      "Dachshunds are curious, brave dogs with short legs and a playful personality.",
  },
  {
    id: "dog-3",
    category: "Dogs",
    name: "POODLE DOG",
    country: "West India",
    image: "/img/pets/poodle-dog.png",
    liked: true,
    stats: { difficulty: 73, ferocious: 91, space: 73, groups: 73 },
    description:
      "Poodles are intelligent and active dogs, quick to learn and eager to socialize.",
  },
  {
    id: "dog-4",
    category: "Dogs",
    name: "PUG DOG",
    country: "Mexico",
    image: "/img/pets/pug-dog.png",
    liked: false,
    stats: { difficulty: 73, ferocious: 91, space: 73, groups: 73 },
    description:
      "Pugs are affectionate and charming dogs, loved for their friendly nature.",
  },
  {
    id: "dog-3",
    category: "Dogs",
    name: "POODLE DOG",
    country: "West India",
    image: "/img/pets/poodle-dog.png",
    liked: true,
    stats: { difficulty: 73, ferocious: 91, space: 73, groups: 73 },
    description:
      "Poodles are intelligent and active dogs, quick to learn and eager to socialize.",
  },
  {
    id: "dog-4",
    category: "Dogs",
    name: "PUG DOG",
    country: "Mexico",
    image: "/img/pets/pug-dog.png",
    liked: false,
    stats: { difficulty: 73, ferocious: 91, space: 73, groups: 73 },
    description:
      "Pugs are affectionate and charming dogs, loved for their friendly nature.",
  },
  {
    id: "cat-1",
    category: "Cats",
    name: "BRITISH SHORTHAIR",
    country: "United Kingdom",
    image: "/img/headers/cat-image.webp",
    liked: true,
    stats: { difficulty: 70, ferocious: 48, space: 62, groups: 55 },
    description:
      "British Shorthairs are calm cats with balanced temperament and easy care.",
  },
  {
    id: "cat-2",
    category: "Cats",
    name: "SCOTTISH FOLD",
    country: "Scotland",
    image: "/img/headers/cat.png",
    liked: false,
    stats: { difficulty: 66, ferocious: 36, space: 58, groups: 61 },
    description:
      "Scottish Fold cats are social and gentle with a sweet personality.",
  },
  {
    id: "hamster-1",
    category: "Hamsters",
    name: "SYRIAN HAMSTER",
    country: "Syria",
    image: "/img/headers/cat-image.webp",
    liked: false,
    stats: { difficulty: 52, ferocious: 22, space: 44, groups: 30 },
    description:
      "Syrian hamsters are small, curious pets that enjoy a calm habitat and routine.",
  },
  {
    id: "hamster-2",
    category: "Hamsters",
    name: "DWARF HAMSTER",
    country: "Mongolia",
    image: "/img/headers/cat.png",
    liked: true,
    stats: { difficulty: 58, ferocious: 28, space: 38, groups: 62 },
    description:
      "Dwarf hamsters are active and social, best with enough toys and movement.",
  },
  {
    id: "bird-1",
    category: "Birds",
    name: "BUDGERIGAR",
    country: "Australia",
    image: "/img/headers/cat-image.webp",
    liked: false,
    stats: { difficulty: 64, ferocious: 18, space: 52, groups: 71 },
    description:
      "Budgerigars are interactive birds that thrive in clean spaces and regular care.",
  },
  {
    id: "bird-2",
    category: "Birds",
    name: "COCKATIEL",
    country: "Australia",
    image: "/img/headers/cat.png",
    liked: true,
    stats: { difficulty: 68, ferocious: 24, space: 58, groups: 75 },
    description:
      "Cockatiels are affectionate birds, responsive to gentle training and bonding.",
  },
];

const Discovery = () => {
  const { t } = useTranslation();
  const device = useDeviceDetect();
  const cardsPerPage = device === "mobile" ? 1 : 4;
  const [activeCategory, setActiveCategory] =
    useState<DiscoveryCategory>("Dogs");
  const [activePage, setActivePage] = useState(0);
  const [likedById, setLikedById] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(
      discoveryItems.map((item) => [item.id, Boolean(item.liked)]),
    ),
  );

  const filteredItems = useMemo(
    () => discoveryItems.filter((item) => item.category === activeCategory),
    [activeCategory],
  );

  const pageCount = Math.max(1, Math.ceil(filteredItems.length / cardsPerPage));
  const safeActivePage = Math.min(activePage, pageCount - 1);

  const visibleItems = useMemo(() => {
    const start = safeActivePage * cardsPerPage;
    return filteredItems.slice(start, start + cardsPerPage).map((item) => ({
      ...item,
      liked: likedById[item.id] ?? false,
    }));
  }, [filteredItems, safeActivePage, likedById, cardsPerPage]);

  const onCategoryChange = (category: DiscoveryCategory) => {
    setActiveCategory(category);
    setActivePage(0);
  };

  const canGoPrev = safeActivePage > 0;
  const canGoNext = safeActivePage < pageCount - 1;
  const onToggleLike = (id: string) => {
    setLikedById((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <Stack className="discovery">
      <Stack className="container">
        <Box className="discovery-title">{t("discovery.title")}</Box>

        <Stack className="category-tabs" direction="row">
          {categories.map((category) => (
            <Box
              key={category}
              component="button"
              type="button"
              className={`category-tab ${
                activeCategory === category ? "active" : ""
              }`}
              onClick={() => onCategoryChange(category)}
            >
              {t(`discovery.category.${category}`)}
            </Box>
          ))}
        </Stack>

        <Stack className="discovery-slider" direction="row">
          <IconButton
            className={`slider-nav prev ${canGoPrev ? "enabled" : "disabled"}`}
            onClick={() => canGoPrev && setActivePage((prev) => prev - 1)}
            disabled={!canGoPrev}
          >
            <ChevronLeftRoundedIcon />
          </IconButton>

          <Stack className="cards-track" direction="row">
            {visibleItems.map((item) => (
              <DiscoveryCard
                key={item.id}
                item={item}
                onToggleLike={() => onToggleLike(item.id)}
              />
            ))}
          </Stack>

          <IconButton
            className={`slider-nav next ${canGoNext ? "enabled" : "disabled"}`}
            onClick={() => canGoNext && setActivePage((prev) => prev + 1)}
            disabled={!canGoNext}
          >
            <ChevronRightRoundedIcon />
          </IconButton>
        </Stack>

        <Stack className="pagination-dots" direction="row">
          {Array.from({ length: pageCount }).map((_, index) => (
            <Box
              key={index}
              className={`dot ${index === safeActivePage ? "active" : ""}`}
              onClick={() => setActivePage(index)}
            />
          ))}
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Discovery;
