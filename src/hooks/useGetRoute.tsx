import { useState } from "react";
import { useDataQuery } from "@dhis2/app-runtime";

const REQUEST = {
  routes : {
    resource: "routes",
    params: {
      paging : false,
      filter : `code:eq:chap`
    },
  }
}

const useGetRoute = () => {

  const { data : route, loading, error } = useDataQuery(REQUEST);

  return {
    route,
    error,
    loading,
  };
};

export default useGetRoute;
