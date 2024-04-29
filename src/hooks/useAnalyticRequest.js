import { useDataQuery } from "@dhis2/app-runtime";

const ORG_UNIT_LEVELS_QUERY = ({ dataElements, periodes, orgUnit } = {}) => {
  return {
    levels: {
      resource: "analytics",
      params: {
        level : 2,
        paging: false,
        dimension: `dx:${dataElements},ou:LEVEL-2-${orgUnit},pe:${periodes.join(";")}`
      },
    },
  };
};

const useAnalyticRequest = (dataElements, periodes, orgUnit) => {
  const { loading, error, data } = useDataQuery(ORG_UNIT_LEVELS_QUERY({ dataElements, periodes, orgUnit }));

  return {
    data,
    error,
    loading,
  };
};

export default useAnalyticRequest;
