 import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import useAnalyticRequest from "../../hooks/useAnalyticRequest";
import useOrgUnits from "../../hooks/useOrgUnits";
import React from "react";
import useGeoJson from "../../hooks/useGeoJson";

interface DownloadDataProps {
  period: any;
  orgUnitLevel: {id : string, level : number};
  orgUnits: any;
  temperatureData: any;
  precipitationData: any;
  populationData: any;
  predictionData: any;
  setStartDownload: (startDownload : boolean) => void
  setErrorMessages(errorMessages : ErrorResponse[]) : void
}

export interface ErrorResponse {
  error : any,
  element : string
}

const DownloadData = ({ period, setStartDownload, orgUnitLevel, orgUnits, temperatureData, precipitationData, populationData, predictionData, setErrorMessages}: DownloadDataProps) => {
  
  //Concat selected orgUnits (either national, a district, chiefdom or facility) with the id of selected levels (districts, chiefdoms, facilities)
  const mergedOrgUnits = "LEVEL-"+orgUnitLevel.id+";"+orgUnits.map((ou : any) => ou.id).join(";")

  //Convert the period selected to a DHIS2-standard list of months
  const fillPeriodesMonths = (period : any) => {
        const currentDate = new Date(period.startMonth);
        const endDate = new Date(period.endMonth);
        const months = [];
        // if not set, endData is one houre more than currentDate
        currentDate.setHours(0,0,0,0);
        endDate.setHours(0,0,0,0);

        while (currentDate <= endDate) {
          const year = currentDate.getFullYear();
          const month = String(currentDate.getMonth() + 1).padStart(2, "0");
          const formattedDate = `${year}${month}`;
          months.push(formattedDate);

          currentDate.setMonth(currentDate.getMonth() + 1);
        }
        return months;
    };

  const {data : precipitation, error : precipitationError, loading : precipitationLoading} = useAnalyticRequest(precipitationData.id, fillPeriodesMonths(period), mergedOrgUnits)
  const {data : population, error : populationError, loading : populationLoading} = useAnalyticRequest(populationData.id, fillPeriodesMonths(period), mergedOrgUnits)
  const {data : temperature, error : temperatureError, loading : temperatureLoading} = useAnalyticRequest(temperatureData.id, fillPeriodesMonths(period), mergedOrgUnits)
  const {data : prediction, error : predictionError,loading : predictionLoading} = useAnalyticRequest(predictionData.id, fillPeriodesMonths(period), mergedOrgUnits)
  //const {orgUnits: allOrgUnits, error : orgUnitsError, loading : allOrgUnitsLoading } = useOrgUnits();
  const {data : geoJson, error : geoJsonError, loading : geoJsonLoading} = useGeoJson(orgUnitLevel.level);


  const objectToPrettyJson = (object : any) => {
    return JSON.stringify(object, null, 2)
  }

  //Avoid to export all the orgUnits to JSON, only inlcude those returned from one of the analytic requests (precipitation)
  const filterOrgUnits = () => {
    return {
      type : "FeatureCollection",
      features : (geoJson as any).features.filter((o : any) => {
        return precipitation.metaData.dimensions.ou.some((id : string) => id === o.id);
      })
    }
  }


  const downloadZip = ()  => {
    const zip = new JSZip();
    //Add orgUnits to zip
    zip.file("geoJson.json", objectToPrettyJson(filterOrgUnits()))
    zip.file("precipitation.json", objectToPrettyJson(precipitation))
    zip.file("population.json", objectToPrettyJson(population))
    zip.file("temperature.json", objectToPrettyJson(temperature))
    zip.file("disease.json", objectToPrettyJson(prediction))

    zip.generateAsync({ type: "blob" }).then((content) => {
      saveAs(content, "chapdata.zip");
    });
    
  }

  useEffect(() => {
    console.log(precipitationLoading, populationLoading, temperatureLoading, predictionLoading, geoJsonLoading)
    console.log(geoJson, precipitation, population, temperature, prediction)
    if(precipitationLoading || populationLoading || temperatureLoading || predictionLoading || geoJsonLoading) return;
    //All data is fetched
    if (precipitation && population && temperature && prediction && geoJson) {
      setErrorMessages([])
      downloadZip();
      setStartDownload(false)
    }


    //if an error occured
    if(precipitationError || populationError || temperatureError || predictionError || geoJsonError || geoJsonError){
      const errorMessages : ErrorResponse[] = []
      precipitationError && errorMessages.push({error : precipitationError, element : "Precipitation"})
      populationError && errorMessages.push({error : populationError, element : "Population"})
      temperatureError && errorMessages.push({error : temperatureError, element : "Temperature"})
      predictionError && errorMessages.push({error : predictionError, element : "Prediction"})
      geoJsonError && errorMessages.push({error : geoJsonError, element : "OrgUnits"})
      console.log(errorMessages)
      setErrorMessages(errorMessages)
      setStartDownload(false)
    }
    
  }, [precipitationLoading, populationLoading, temperatureLoading, predictionLoading, geoJsonLoading]);


  return (<p>Downloading data..</p>);

};

export default DownloadData;
