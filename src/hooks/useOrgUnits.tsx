import { useState } from "react";
import { useDataQuery } from "@dhis2/app-runtime";

const parseOrgUnitsRespons = (data: any, orgUnits : string[]) => {
  return orgUnits.map((orgUnit : any) => 
    ({
      id : orgUnit.id,
      features : data[orgUnit.id].features.map(({ type, id, geometry, properties }: any) => ({
        type,
        id,
        properties: { id, name: properties.name },
        geometry,
      }))
    })
  );
}

const createFeatureRequest = (orgUnits : any[]) => {
  let requests : any = {}
  orgUnits.forEach((orgUnit : any) => {

    //Get the parent id and level based on selected orgunits
    const pathArray = orgUnit.path.split("/");
    const level = pathArray.length -1;
    const parent = orgUnit.id//pathArray[pathArray.findIndex((item: string) => item === orgUnit.id) - 1];
    
    //Add request to the requests object
    requests[orgUnit.id] = {
        resource: "organisationUnits.geojson",
        params: {
          parent,
          level,
        },
      }
  });
  return requests;
}

const useOrgUnits = (orgUnits : any[]) => {
  const [geoJsons, setGeoJsons] = useState<any[]>();

  const { loading, error } = useDataQuery(createFeatureRequest(orgUnits), {
    onComplete: (data) => setGeoJsons(parseOrgUnitsRespons(data, orgUnits)),
  });

  return {
    geoJsons,
    error,
    loading,
  };
};

export default useOrgUnits;
