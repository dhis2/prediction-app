import PropTypes from "prop-types";
import { useEffect } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import useAnalyticRequest from "../../hooks/useAnalyticRequest";

const DownloadData = ({ dataset, period, orgUnits, temperatureData, precipitationData, populationData }) => {
  
  const fillPeriodesMonths = () => {
    //TODO fill with months
    return ["LAST_12_MONTHS"];
  }

  const {data : precipitation} = useAnalyticRequest(precipitationData.id, fillPeriodesMonths(period), orgUnits.parent.id)
  const {data : population} = useAnalyticRequest(populationData.id, fillPeriodesMonths(period), orgUnits.parent.id)
  const {data : temperature} = useAnalyticRequest(temperatureData.id, fillPeriodesMonths(period), orgUnits.parent.id)

  const { parent, level } = orgUnits;
  const { features } = useOrgUnits(parent.id, level);
 
  
  const createDHIS2AnalyticFile = (content, name) => {
    return $`${name}.json`,
      JSON.stringify({
        content
      })
  }


  useEffect(() => {
    if (features) {
      const zip = new JSZip();
      zip.file(
        "orgunits.geojson",
        JSON.stringify({
          type: "FeatureCollection",
          features,
        })
      );
      /*zip.file(createDHIS2AnalyticFile(precipitation, "precipitation"))
      zip.file(createDHIS2AnalyticFile(population, "population"))
      zip.file(createDHIS2AnalyticFile(temperature, "temperature"))*/
      zip.generateAsync({ type: "blob" }).then((content) => {
        saveAs(content, "chapdata.zip");
      });
    }
  }, [features]);

  


  return <>{JSON.stringify(features)}</>;
};

DownloadData.propTypes = {
  predictionTarget: PropTypes.object.isRequired,
  populationData: PropTypes.object.isRequired,
  temperatureData: PropTypes.object.isRequired,
  precipitationData: PropTypes.object.isRequired,
  period: PropTypes.object.isRequired,
  orgUnits: PropTypes.object.isRequired,
};

export default DownloadData;
