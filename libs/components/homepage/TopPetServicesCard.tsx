import { Box, Button, Rating, Stack, Typography } from "@mui/material";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import Link from "next/link";
import { Service } from "@/libs/types/service/service";
import {
  ApolloQueryResult,
  OperationVariables,
  useMutation,
  useReactiveVar,
} from "@apollo/client";
import { T } from "@/libs/types/common";
import { useRouter } from "next/router";
import { userVar } from "@/apollo/store";
import { LIKE_TARGET_SERVICE } from "@/apollo/user/mutation";
import { KeyboardEvent, MouseEvent } from "react";
import { Messages, REACT_APP_API_URL } from "@/libs/config";
import {
  sweetBottomSmallSuccessAlert,
  sweetMixinErrorAlert,
} from "@/libs/sweetAlert";

interface TopPetServicesProps {
  service: Service;
  getServicesRefetch: (
    variavles?: Partial<OperationVariables>,
  ) => Promise<ApolloQueryResult<T>>;
}

const serviceDetailHref = "/service/booking";

const TopPetServicesCard = (props: TopPetServicesProps) => {
  const { service, getServicesRefetch } = props;
  const router = useRouter();
  const user = useReactiveVar(userVar);
  const myFavorite = Boolean(service?.meLiked?.[0]?.myFavorite);

  /** APOLLO REQUESTS **/

  const [likeTargetService] = useMutation(LIKE_TARGET_SERVICE);

  /** HANDLERS **/

  const likeServiceHandler = async (
    event: MouseEvent<HTMLDivElement>,
    serviceId: string,
  ) => {
    // The whole card is a link to the detail page, so keep the like
    // interaction from bubbling up and triggering navigation.
    event.stopPropagation();
    try {
      if (!user?._id) throw new Error(Messages.error2);

      await likeTargetService({ variables: { input: serviceId } });

      // Refetch so the local list re-syncs meLiked + serviceLikes.
      await getServicesRefetch();

      await sweetBottomSmallSuccessAlert("Success!", 700);
    } catch (err: any) {
      console.log("ERROR, likeServiceHandler:", err.message);
      await sweetMixinErrorAlert(err.message);
    }
  };

  const handleCardClick = () => {
    void router.push({
      pathname: serviceDetailHref,
      query: { id: service._id },
    });
  };

  const handleCardKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleCardClick();
    }
  };

  return (
    <Stack
      className="service-card"
      onKeyDown={handleCardKeyDown}
      onClick={handleCardClick}
    >
      <Box className="service-card-image-wrap">
        <Box className="service-category-badge">{service.serviceType}</Box>
        <Box
          className={`service-like-btn ${myFavorite ? "is-liked" : ""}`}
          onClick={(event: MouseEvent<HTMLDivElement>) =>
            likeServiceHandler(event, service._id)
          }
        >
          {myFavorite ? <FavoriteRoundedIcon /> : <FavoriteBorderRoundedIcon />}
          <Box className="like-count">{service.serviceLikes}</Box>
        </Box>
        <img
          className="service-card-image"
          src={`${REACT_APP_API_URL}/${service?.serviceImages[0]}`}
          alt={service.serviceTitle}
        />
      </Box>

      <Stack className="service-card-content">
        <Typography className="service-card-name">
          {service.serviceTitle}
        </Typography>

        <Stack
          className="service-price-row"
          direction="row"
          alignItems="center"
        >
          <Typography className="service-price">
            ₩{service.servicePrice}
          </Typography>
          <Typography className="service-price-sep">·</Typography>
          <AccessTimeOutlinedIcon className="duration-icon" />
          <Typography className="service-duration">
            {service.serviceDurationMinutes}
          </Typography>
        </Stack>

        <Stack
          className="service-location-row"
          direction="row"
          alignItems="center"
        >
          <LocationOnOutlinedIcon className="location-icon" />
          <Typography className="service-location">
            {service.serviceLocation}
          </Typography>
        </Stack>

        <Stack
          className="service-rating-row"
          direction="row"
          alignItems="center"
        >
          <Rating
            value={service.serviceRating}
            precision={0.5}
            readOnly
            size="small"
            className="rating-stars"
          />
          <Typography className="rating-value">
            {service.serviceRating.toFixed(1)}
          </Typography>
          <Typography className="review-count">
            ({service.serviceReviews.toLocaleString()})
          </Typography>
          {service.serviceBookings !== undefined && (
            <>
              <Typography className="service-price-sep">·</Typography>
              <Typography className="service-booking-count">
                {service.serviceBookings >= 1000
                  ? `${(service.serviceBookings / 1000).toFixed(1)}k`
                  : service.serviceBookings}{" "}
                booked
              </Typography>
            </>
          )}
        </Stack>

        <Button
          className="service-book-btn"
          onClick={handleCardClick}
          fullWidth
        >
          Book Now
        </Button>
      </Stack>
    </Stack>
  );
};

export default TopPetServicesCard;
