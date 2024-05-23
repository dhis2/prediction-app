import { useState } from "react";
import { useDataQuery } from "@dhis2/app-runtime";

export const ORG_UNITS_QUERY = {
    geojson: {
        resource: "organisationUnits.geojson",
        params: ({ level }: { level: number }) => ({
            level,
        }),
    },
};

const parseOrgUnits = (data : any) => {
  return {   
    features : data.geojson.features.map(({ type, id, geometry, properties } : any) => ({
        type,
        id,
        properties: properties,
        geometry
  })),
  ...data,}
}

const useGeoJson = (level : number) => {

    const { data, loading, error } = useDataQuery(ORG_UNITS_QUERY as any, {
      variables: { level }});

    console.log(loading);
  
    return {
      data : data ? parseOrgUnits(data) : data,
      error,
      loading,
    };
}

export default useGeoJson;