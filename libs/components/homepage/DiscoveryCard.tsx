import { Box, Stack } from "@mui/material";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import PublicRoundedIcon from "@mui/icons-material/PublicRounded";
import { useTranslation } from "react-i18next";
import {
  ApolloQueryResult,
  OperationVariables,
  useMutation,
  useReactiveVar,
} from "@apollo/client";
import { MouseEvent } from "react";
import { userVar } from "@/apollo/store";
import { LIKE_TARGET_DISCOVERY_PET } from "@/apollo/user/mutation";
import { DiscoveryPet } from "@/libs/types/discovery-pet/discovery-pet";
import { T } from "@/libs/types/common";
import { Messages } from "@/libs/config";
import {
  sweetBottomSmallSuccessAlert,
  sweetMixinErrorAlert,
} from "@/libs/sweetAlert";

type DiscoveryCardProps = {
  pet: DiscoveryPet;
  getDiscoveryPetsRefetch: (
    variables?: Partial<OperationVariables>,
  ) => Promise<ApolloQueryResult<T>>;
};

const DiscoveryCard = ({
  pet,
  getDiscoveryPetsRefetch,
}: DiscoveryCardProps) => {
  const { t } = useTranslation();
  const user = useReactiveVar(userVar);
  const myFavorite = Boolean(pet?.meLiked?.[0]?.myFavorite);

  /** APOLLO REQUESTS **/

  const [likeTargetDiscoveryPet] = useMutation(LIKE_TARGET_DISCOVERY_PET);

  const statRows = [
    { key: "difficulty", value: pet.petDifficulty },
    { key: "ferocious", value: pet.petFerocious },
    { key: "space", value: pet.petSpace },
    { key: "groups", value: pet.petGroups },
  ];

  const name = t(`discovery.pets.${pet.petSlug}.name`, {
    defaultValue: pet.petName,
  });
  const description = t(`discovery.pets.${pet.petSlug}.desc`, {
    defaultValue: pet.petDescription,
  });
  const country = t(`discovery.country.${pet.petCountry}`, {
    defaultValue: pet.petCountry,
  });

  /** HANDLERS **/

  const likePetHandler = async (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    try {
      if (!user?._id) throw new Error(Messages.error2);

      await likeTargetDiscoveryPet({ variables: { input: pet._id } });

      // Refetch so the local list re-syncs meLiked + petLikes.
      await getDiscoveryPetsRefetch();

      await sweetBottomSmallSuccessAlert("Success!", 700);
    } catch (err: any) {
      console.log("ERROR, likePetHandler:", err.message);
      await sweetMixinErrorAlert(err.message);
    }
  };

  return (
    <Stack className="discovery-card">
      <Box className="like-icon">
        <Box
          component="button"
          type="button"
          className="like-toggle"
          onClick={likePetHandler}
          aria-label={
            myFavorite
              ? t("discovery.removeFavorite")
              : t("discovery.addFavorite")
          }
        >
          {myFavorite ? (
            <FavoriteRoundedIcon className="liked" />
          ) : (
            <FavoriteBorderRoundedIcon className="unliked" />
          )}
        </Box>
        <Box className="like-count">{pet.petLikes}</Box>
      </Box>

      <Box className="pet-image-box">
        <img className="pet-image" src={pet.petImage} alt={name} />
      </Box>

      <Box className="pet-title">{name}</Box>

      <Stack className="country-row">
        <PublicRoundedIcon className="country-icon" />
        <Box className="country-text">{country}</Box>
      </Stack>

      <Box className="info-title">{t("discovery.info")}</Box>

      <Stack className="stats-list">
        {statRows.map((stat) => (
          <Box key={stat.key} className="stat-item">
            <Box className="stat-label">{t(`discovery.${stat.key}`)}</Box>
            <Box className="stat-track">
              <Box className="stat-fill" style={{ width: `${stat.value}%` }} />
            </Box>
          </Box>
        ))}
      </Stack>

      <Box className="description-title">{t("discovery.description")}</Box>
      <Box className="description-text">{description}</Box>

      {pet.petLink ? (
        <Box
          component="a"
          href={pet.petLink}
          target="_blank"
          rel="noreferrer"
          className="read-more-btn"
        >
          {t("actions.readMore")}
        </Box>
      ) : (
        <Box
          component="button"
          type="button"
          className="read-more-btn disabled"
          disabled
        >
          {t("actions.readMore")}
        </Box>
      )}
    </Stack>
  );
};

export default DiscoveryCard;
