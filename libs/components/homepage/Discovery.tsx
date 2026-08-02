import { useTranslation } from "react-i18next";
import { Box, IconButton, Stack } from "@mui/material";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import { useEffect, useState } from "react";
import { useQuery, useReactiveVar } from "@apollo/client";
import DiscoveryCard from "./DiscoveryCard";
import useDeviceDetect from "@/libs/hooks/useDeviceDetect";
import { userVar } from "@/apollo/store";
import { GET_ALL_DISCOVERY_PETS } from "@/apollo/user/query";
import { DiscoveryPet } from "@/libs/types/discovery-pet/discovery-pet";
import { DiscoveryPetsInquiry } from "@/libs/types/discovery-pet/discovery-pet.input";
import { PetCategory } from "@/libs/enums/discoveryPet.enum";
import { Direction, Message } from "@/libs/enums/common.enum";
import { T } from "@/libs/types/common";

const categories: PetCategory[] = [
  PetCategory.DOG,
  PetCategory.CAT,
  PetCategory.RABBIT,
  PetCategory.BIRD,
  PetCategory.HAMSTER,
];

const categoryLabel: Record<PetCategory, string> = {
  [PetCategory.DOG]: "Dogs",
  [PetCategory.CAT]: "Cats",
  [PetCategory.RABBIT]: "Rabbits",
  [PetCategory.HAMSTER]: "Hamsters",
  [PetCategory.BIRD]: "Birds",
};

const Discovery = () => {
  const { t } = useTranslation();
  const device = useDeviceDetect();
  const cardsPerPage = device === "mobile" ? 1 : 4;
  const user = useReactiveVar(userVar);

  const [searchFilter, setSearchFilter] = useState<DiscoveryPetsInquiry>({
    page: 1,
    limit: cardsPerPage,
    sort: "createdAt",
    direction: Direction.ASC,
    search: { petCategory: [PetCategory.DOG] },
  });
  const [pets, setPets] = useState<DiscoveryPet[]>([]);
  const [total, setTotal] = useState(0);

  /** APOLLO REQUESTS **/

  const { refetch: getDiscoveryPetsRefetch } = useQuery(
    GET_ALL_DISCOVERY_PETS,
    {
      fetchPolicy: "cache-and-network", // cache + => network
      variables: { input: searchFilter },
      notifyOnNetworkStatusChange: true,
      onCompleted: (data: T) => {
        setPets(data?.getAllDiscoveryPets?.list ?? []);
        setTotal(data?.getAllDiscoveryPets?.metaCounter?.[0]?.total ?? 0);
      },
      onError: (error) => {
        if (
          error.graphQLErrors?.some((e) => e.message === Message.NO_DATA_FOUND)
        ) {
          setPets([]);
          setTotal(0);
        }
      },
    },
  );

  /** LIFECYCLES **/

  useEffect(() => {
    getDiscoveryPetsRefetch({ input: searchFilter });
  }, [user?._id]);

  useEffect(() => {
    setSearchFilter((prev) =>
      prev.limit === cardsPerPage
        ? prev
        : { ...prev, page: 1, limit: cardsPerPage },
    );
  }, [cardsPerPage]);

  /** DERIVED **/

  const activeCategory =
    searchFilter.search.petCategory?.[0] ?? PetCategory.DOG;
  const pageCount = Math.max(1, Math.ceil(total / searchFilter.limit));
  const safeActivePage = Math.min(searchFilter.page - 1, pageCount - 1);
  const canGoPrev = safeActivePage > 0;
  const canGoNext = safeActivePage < pageCount - 1;

  /** HANDLERS **/

  const onCategoryChange = (category: PetCategory) => {
    setSearchFilter((prev) => ({
      ...prev,
      page: 1,
      search: { petCategory: [category] },
    }));
  };

  const goToPage = (pageIndex: number) => {
    setSearchFilter((prev) => ({ ...prev, page: pageIndex + 1 }));
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
              {t(`discovery.category.${categoryLabel[category]}`)}
            </Box>
          ))}
        </Stack>

        <Stack className="discovery-slider" direction="row">
          <Stack className="cards-track" direction="row">
            {pets.map((item) => (
              <DiscoveryCard
                key={item._id}
                pet={item}
                getDiscoveryPetsRefetch={getDiscoveryPetsRefetch}
              />
            ))}
          </Stack>
        </Stack>

        <Stack className="discovery-pager" direction="row">
          <IconButton
            className={`pager-arrow prev ${canGoPrev ? "enabled" : "disabled"}`}
            onClick={() => canGoPrev && goToPage(safeActivePage - 1)}
            disabled={!canGoPrev}
          >
            <ChevronLeftRoundedIcon />
          </IconButton>

          <Box className="pager-page">{safeActivePage + 1}</Box>

          <IconButton
            className={`pager-arrow next ${canGoNext ? "enabled" : "disabled"}`}
            onClick={() => canGoNext && goToPage(safeActivePage + 1)}
            disabled={!canGoNext}
          >
            <ChevronRightRoundedIcon />
          </IconButton>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Discovery;
