import { Box, Button, Rating, Stack, Typography } from "@mui/material";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import WorkHistoryOutlinedIcon from "@mui/icons-material/WorkHistoryOutlined";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import {
  ApolloQueryResult,
  OperationVariables,
  useMutation,
  useReactiveVar,
} from "@apollo/client";
import { useRouter } from "next/router";
import { MouseEvent } from "react";
import { Member } from "@/libs/types/member/member";
import { T } from "@/libs/types/common";
import { userVar } from "@/apollo/store";
import { LIKE_TARGET_MEMBER } from "@/apollo/user/mutation";
import { Messages, REACT_APP_API_URL } from "@/libs/config";
import {
  sweetBottomSmallSuccessAlert,
  sweetMixinErrorAlert,
} from "@/libs/sweetAlert";

type AgentCardProps = {
  agent: Member;
  getAgentsRefetch: (
    variables?: Partial<OperationVariables>,
  ) => Promise<ApolloQueryResult<T>>;
};

const agentDetailHref = "/agents/detail";

/** Enum tokens come back as "DAY_CARE" / "SEOUL" — show them as words. */
const enumLabel = (value: string) =>
  value
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const AgentCard = ({ agent, getAgentsRefetch }: AgentCardProps) => {
  const router = useRouter();
  const user = useReactiveVar(userVar);
  const myFavorite = agent?.meLiked?.[0]?.myFavorite ?? false;

  /** DERIVED **/

  const agentName = agent.memberFullName || agent.memberUserName;
  const agentImage = agent.memberImage
    ? `${REACT_APP_API_URL}/${agent.memberImage}`
    : "/img/profile/defaultUser.png";
  const serviceTypes = agent.memberServiceTypes ?? [];
  const serviceArea = (agent.memberServiceArea ?? []).map(enumLabel).join(", ");
  // Agent profiles are optional server-side, so every secondary line falls back
  // to the next best field and the row is dropped when nothing is filled in.
  const role =
    agent.memberSpecialty ||
    (serviceTypes.length
      ? serviceTypes.map(enumLabel).join(" · ")
      : "Pet Care Agent");
  const location = serviceArea || agent.memberAddress;
  const experienceYears = Number(agent.memberExperience ?? 0);

  /** APOLLO REQUESTS **/

  const [likeTargetMember] = useMutation(LIKE_TARGET_MEMBER);

  /** HANDLERS **/

  const likeAgentHandler = async (
    event: MouseEvent<HTMLDivElement>,
    agentId: string,
  ) => {
    event.stopPropagation();
    try {
      if (!user?._id) throw new Error(Messages.error2);

      await likeTargetMember({ variables: { input: agentId } });

      // Refetch so the local list re-syncs meLiked + memberLikes.
      await getAgentsRefetch();

      await sweetBottomSmallSuccessAlert("Success!", 700);
    } catch (err: any) {
      console.log("ERROR, likeAgentHandler:", err.message);
      await sweetMixinErrorAlert(err.message);
    }
  };

  const viewProfileHandler = () => {
    void router.push({ pathname: agentDetailHref, query: { id: agent._id } });
  };

  return (
    <Stack className="agent-card">
      <Box className="agent-card-img-wrap">
        <img src={agentImage} alt={agentName} className="agent-card-img" />
        {serviceTypes.length > 0 && (
          <Box className="agent-type-badge">{enumLabel(serviceTypes[0])}</Box>
        )}
        <Box className="service-meta-badges">
          <Box
            className={`meta-badge meta-like ${myFavorite ? "is-liked" : ""}`}
            onClick={(event: MouseEvent<HTMLDivElement>) =>
              likeAgentHandler(event, agent._id)
            }
          >
            {myFavorite ? (
              <FavoriteRoundedIcon />
            ) : (
              <FavoriteBorderRoundedIcon />
            )}
            <Box className="meta-count">{agent.memberLikes}</Box>
          </Box>
          <Box className="meta-badge meta-views">
            <VisibilityOutlinedIcon />
            <Box className="meta-count">{agent.memberViews}</Box>
          </Box>
        </Box>
      </Box>

      <Stack className="agent-card-content">
        <Typography className="agent-card-name">{agentName}</Typography>
        <Typography className="agent-card-role">{role}</Typography>

        <Stack
          className="agent-card-rating-row"
          direction="row"
          alignItems="center"
        >
          <Rating
            value={agent.memberRating}
            precision={0.5}
            readOnly
            size="small"
            className="agent-rating-stars"
          />
          <Typography className="agent-rating-value">
            {agent.memberRating.toFixed(1)}
          </Typography>
          <Typography className="agent-rating-sep">·</Typography>
          <Typography className="agent-booking-count">
            {agent.memberReviews.toLocaleString()} review
            {agent.memberReviews === 1 ? "" : "s"}
          </Typography>
        </Stack>

        {experienceYears > 0 && (
          <Stack
            className="agent-card-meta"
            direction="row"
            alignItems="center"
          >
            <WorkHistoryOutlinedIcon className="agent-meta-icon" />
            <Typography className="agent-meta-text">
              {experienceYears} year{experienceYears === 1 ? "" : "s"} experience
            </Typography>
          </Stack>
        )}

        {location && (
          <Stack
            className="agent-card-meta"
            direction="row"
            alignItems="center"
          >
            <LocationOnOutlinedIcon className="agent-meta-icon" />
            <Typography className="agent-meta-text">{location}</Typography>
          </Stack>
        )}

        <Button
          className="service-book-btn"
          onClick={viewProfileHandler}
          fullWidth
        >
          View Profile
        </Button>
      </Stack>
    </Stack>
  );
};

export default AgentCard;
