import PropTypes from "prop-types";
import { useEffect } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import useOrgUnits from "../../hooks/useOrgUnits";

const DownloadData = ({ dataset, period, orgUnits, dataElement }) => {
  const { parent, level } = orgUnits;
  const { features } = useOrgUnits(parent.id, level);

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
      zip.generateAsync({ type: "blob" }).then((content) => {
        saveAs(content, "chapdata.zip");
      });
    }
  }, [features]);

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
