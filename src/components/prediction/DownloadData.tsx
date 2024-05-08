 import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import useAnalyticRequest from "../../hooks/useAnalyticRequest";
import useOrgUnits from "../../hooks/useOrgUnits";
import React from "react";

interface DownloadDataProps {
  period: any;
  orgUnitLevels: any[];
  orgUnits: any;
  temperatureData: any;
  precipitationData: any;
  populationData: any;
  predictionData: any;
  setStartDownload: (startDownload : boolean) => void
}

const DownloadData = ({ period, setStartDownload, orgUnitLevels, orgUnits, temperatureData, precipitationData, populationData, predictionData}: DownloadDataProps) => {
  
  //Concat selected orgUnits (either national, a district, chiefdom or facility) with the id of selected levels (districts, chiefdoms, facilities)
  const mergedOrgUnits = orgUnitLevels.map(level => "LEVEL-"+level).join(";")+";"+orgUnits.map((ou : any) => ou.id).join(";")

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

  const {data : precipitation} = useAnalyticRequest(precipitationData.id, fillPeriodesMonths(period), mergedOrgUnits)
  const {data : population} = useAnalyticRequest(populationData.id, fillPeriodesMonths(period), mergedOrgUnits)
  const {data : temperature} = useAnalyticRequest(temperatureData.id, fillPeriodesMonths(period), mergedOrgUnits)
  const {data : prediction} = useAnalyticRequest(predictionData.id, fillPeriodesMonths(period), mergedOrgUnits)
  const { orgUnits: allOrgUnits } = useOrgUnits();

  const downloadZip = ()  => {
    const zip = new JSZip();
    //Add orgUnits to zip
    zip.file("orgUnits.json", JSON.stringify(allOrgUnits))
    zip.file("precipitation.json", JSON.stringify(precipitation))
    zip.file("population.json", JSON.stringify(population))
    zip.file("temperature.json", JSON.stringify(temperature))
    zip.file("disease.json", JSON.stringify(prediction))

    zip.generateAsync({ type: "blob" }).then((content) => {
      saveAs(content, "chapdata.zip");
    });
    
  }

  useEffect(() => {
    //download zip when all data is fetched
    if (allOrgUnits && precipitation && population && temperature) {
      downloadZip();
      setStartDownload(false)
    }
  }, [allOrgUnits, precipitation, population, temperature]);


  return (<p>Downloading data..</p>);

};

export default DownloadData;
