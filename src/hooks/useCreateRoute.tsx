import { useState } from "react";
import { useDataMutation, useDataQuery } from "@dhis2/app-runtime";
import { CreateMutation } from "@dhis2/app-service-data/build/types/engine/types/Mutation";

const REQUEST = (url : string) => {
  return {
    resource: "routes",
    type: "create" as any,
    data: {
      name: "chap",
      code: "chap",
      disabled: false,
      url: url
    }
  }
};

const useCreateRoute = (url : string) => {
  const [mutate, { error, loading, called }] = useDataMutation(REQUEST(url));

  //await mutate();

  return {
    error,
    loading,
    called,
    mutate
  };
};

export default useCreateRoute;
