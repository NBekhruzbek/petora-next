import { Box, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import TopPetServicesCard from "./TopPetServicesCard";
import { ServicesInquiry } from "@/libs/types/service/service.input";
import { Service } from "@/libs/types/service/service";
import { useQuery, useReactiveVar } from "@apollo/client";
import { userVar } from "@/apollo/store";
import { GET_ALL_SERVICES } from "@/apollo/user/query";
import { T } from "@/libs/types/common";
import { useTranslation } from "react-i18next";

interface TopPetServicesProps {
  initialInput?: ServicesInquiry;
}

const defaultInput: ServicesInquiry = {
  page: 1,
  limit: 4,
  sort: "serviceRank",
  search: {
    onlyLiked: false,
  },
};

const TopPetServices = ({
  initialInput = defaultInput,
}: TopPetServicesProps) => {
  const { t } = useTranslation();
  const [topServices, setTopServices] = useState<Service[]>([]);
  const user = useReactiveVar(userVar);

  /** APOLLO REQUESTS **/

  const {
    loading: getServicesLoading,
    data: getServicesData,
    error: getServicesError,
    refetch: getServicesRefetch,
  } = useQuery(GET_ALL_SERVICES, {
    fetchPolicy: "cache-and-network", // cache + => network
    variables: { input: initialInput },
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: T) => {
      setTopServices(data?.getAllServices?.list);
    },
  });

  /** LIFECYCLES **/

  // meLiked is computed server-side from the auth token, so re-run the
  // query whenever the logged-in member changes (login / logout / reload).
  useEffect(() => {
    getServicesRefetch({ input: initialInput });
  }, [user?._id]);

  return (
    <Stack className="top-pet-services">
      <Stack className="container">
        <Box className="section-title">
          {t("home.topServices.title")}
          <img className="hand-icon" src="/img/logo/Union.svg" alt="" />
        </Box>
        <Box className={"desc-text"}>{t("home.topServices.desc")}</Box>

        <Stack className="top-pet-services-grid">
          {topServices.map((service: Service) => (
            <TopPetServicesCard
              key={service._id}
              service={service}
              getServicesRefetch={getServicesRefetch}
            />
          ))}
        </Stack>
      </Stack>
    </Stack>
  );
};

export default TopPetServices;
