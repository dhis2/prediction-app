import PropTypes from "prop-types";
// import i18n from "@dhis2/d2-i18n";
import useOrgUnits from "../../hooks/useOrgUnits";
// import useEarthEngineData from "../../hooks/useEarthEngineData";
// import ErrorMessage from "../shared/ErrorMessage";
// import styles from "./styles/ExtractData.module.css";

const DownloadData = ({ dataset, period, orgUnits, dataElement }) => {
  const { parent, level } = orgUnits;
  const { features } = useOrgUnits(parent.id, level);

  console.log("features", features);

  return null;
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
