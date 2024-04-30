 import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import useAnalyticRequest from "../../hooks/useAnalyticRequest";
import useOrgUnits from "../../hooks/useOrgUnits";
import React from "react";

interface DownloadDataProps {
  dataset: any;
  period: any;
  orgUnitLevels: any[];
  orgUnits: any;
  temperatureData: any;
  precipitationData: any;
  populationData: any;
  setStartDownload: (startDownload : boolean) => void
}

const DownloadData = ({ period, setStartDownload, orgUnitLevels, orgUnits, temperatureData, precipitationData, populationData}: DownloadDataProps) => {
  
  //Concat selected orgUnits (district, chiefdoms, facililities..) with the id of selected levels
  const mergedOrgUnits = orgUnitLevels.map(level => "LEVEL-"+level).join(";")+";"+orgUnits.map((ou : any) => ou.id).join(";")

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
  const { geoJsons } = useOrgUnits(orgUnits);


  const downloadZip = ()  => {
    const zip = new JSZip();
    //Add all geojsons to the zip
    (geoJsons as any[]).forEach((f : any) => {
      zip.file(
        f.id+".geojson", JSON.stringify({type: "FeatureCollection", features: f.features})
      );
    })
    zip.file("precipitation.json", JSON.stringify(precipitation))
    zip.file("population.json", JSON.stringify(population))
    zip.file("temperature.json", JSON.stringify(temperature))

    zip.generateAsync({ type: "blob" }).then((content) => {
      saveAs(content, "chapdata.zip");
    });
    
  }

  useEffect(() => {
    //download zip when all data is fetched
    if (geoJsons && precipitation && population && temperature) {
      downloadZip();
      setStartDownload(false)
    }
  }, [geoJsons, precipitation, population, temperature]);


  return (<p>Downloading data..</p>);

};

DownloadData.propTypes = {
  predictionTarget: PropTypes.object.isRequired,
  populationData: PropTypes.object.isRequired,
  temperatureData: PropTypes.object.isRequired,
  precipitationData: PropTypes.object.isRequired,
  period: PropTypes.object.isRequired,
  orgUnits: PropTypes.array.isRequired,
};

export default DownloadData;
