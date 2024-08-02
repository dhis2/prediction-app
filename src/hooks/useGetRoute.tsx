import { useState } from "react";
import { useDataQuery } from "@dhis2/app-runtime";

const REQUEST = {
  routes : {
    resource: "routes",
    params: {
      paging : false,
      filter : `code:eq:chaps`
    },
  }
}

const useGetRoute = () => {

  const { data : route, loading, error } = useDataQuery(REQUEST);


  return {
    routeId : (route as any)?.routes?.routes[0]?.id,
    error,
    loading,
  };
};

export default useGetRoute;
