import { Box, Stack } from "@mui/material";
import { useRouter } from "next/router";
import { useQuery } from "@apollo/client";
import ServiceCard from "./ServiceCard";
import { GET_RELATED_SERVICES } from "@/apollo/user/query";
import { Service } from "@/libs/types/service/service";

const RelatedServices = () => {
  const router = useRouter();
  // The service cards navigate to /service/booking?id=<serviceId>, so the
  // currently viewed service id comes straight from the query string.
  const serviceId = router.query.id as string | undefined;

  /** APOLLO REQUESTS **/

  const { data, refetch: getServicesRefetch } = useQuery(GET_RELATED_SERVICES, {
    fetchPolicy: "cache-and-network",
    variables: { input: serviceId },
    skip: !serviceId,
    notifyOnNetworkStatusChange: true,
  });

  const relatedServices: Service[] = data?.getRelatedServices ?? [];

  if (relatedServices.length === 0) return null;

  return (
    <Stack className="related-services">
      <Stack className="container">
        <Box className="related-services-title">
          Related Services <img src="/img/logo/Union.svg" alt="" />
        </Box>
        <Stack className="agents-cards">
          {relatedServices.map((service) => (
            <ServiceCard
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

export default RelatedServices;
