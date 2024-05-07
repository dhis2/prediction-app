import { useState } from "react";
import { useDataQuery } from "@dhis2/app-runtime";

const REQUEST = (code : string) => {
  return { dataElements : {
    resource: "dataElements",
    params: {
      paging : false,
      filter : `code:ilike:${code}`,
      //fields : ['id','displayName','level','parent']
    }
  }
}
}

const useDataElements = (code : string) => {
  const [dataElements, setDataElements] = useState<any[]>();

  const { loading, error } = useDataQuery(REQUEST(code), {
    
    onComplete: (data : any) => setDataElements(data.dataElements.dataElements),
  });

  return {
    dataElements,
    error,
    loading,
  };
};

export default useDataElements;
