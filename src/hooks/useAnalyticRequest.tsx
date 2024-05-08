import { useDataQuery } from "@dhis2/app-runtime";

const ORG_UNIT_LEVELS_QUERY = ({ dataElements = [], periodes = [], orgUnit = {} } = {}) => {
  return {
    request: {
      resource: "analytics",
      params: {
        paging: false,
        dimension: `dx:${dataElements},ou:${orgUnit},pe:${periodes.join(";")}`
      },
    },
  };
};


const useAnalyticRequest = (dataElements: any, periodes: any, orgUnit: any) => {
  const { loading, error, data } = useDataQuery(ORG_UNIT_LEVELS_QUERY({ dataElements, periodes, orgUnit }));

  return {
    data : data ? (data as any).request : data,
    error,
    loading,
  };
};

export default useAnalyticRequest;
