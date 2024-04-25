import { useState } from "react";
import i18n from "@dhis2/d2-i18n";
import { Button } from "@dhis2/ui";
import OrgUnits from "./OrgUnits";
import DataElement from "./DataElement";
import MonthlyPeriodSelect from "./MonthlyPeriodSelect";
import DownloadData from "./DownloadData";
import styles from "./styles/PredictionPage.module.css";

const defaultPeriod = {
  startMonth: "2023-04",
  endMonth: "2024-03",
};

const PredictionPage = () => {
  const [predictionTarget, setPredictionTarget] = useState();
  const [populationData, setPopulationData] = useState();
  const [temperatureData, setTemperatureData] = useState();
  const [precipitationData, setPrecipitationData] = useState();
  const [period, setPeriod] = useState(defaultPeriod);
  const [orgUnits, setOrgUnits] = useState();
  const [startDownload, setStartDownload] = useState(false); // TODO: false

  /*
  const isValid = Boolean(
    predictionTarget &&
      populationData &&
      temperatureData &&
      precipitationData &&
      period &&
      orgUnits
  );
  */

  const isValid = true;

  return (
    <div className={styles.container}>
      <h1>{i18n.t("Make prediction")}</h1>
      <DataElement
        title={i18n.t("Prediction target")}
        label={i18n.t("Select data element")}
        selected={predictionTarget}
        onChange={setPredictionTarget}
      />
      <OrgUnits selected={orgUnits} onChange={setOrgUnits} />
      <DataElement
        title={i18n.t("Population data")}
        label={i18n.t("Select population data element")}
        selected={populationData}
        onChange={setPopulationData}
      />
      <DataElement
        title={i18n.t("Temperature data")}
        label={i18n.t("Select temperature data element")}
        dataElementCode={"ERA5_LAND_TEMPERATURE"}
        selected={temperatureData}
        onChange={setTemperatureData}
      />
      <DataElement
        title={i18n.t("Precipitation data")}
        label={i18n.t("Select precipitation data element")}
        dataElementCode={"ERA5_LAND_PRECIPITATION"}
        selected={precipitationData}
        onChange={setPrecipitationData}
      />
      <MonthlyPeriodSelect period={period} onChange={setPeriod} />
      <Button
        primary
        disabled={!isValid}
        onClick={() => setStartDownload(true)}
      >
        Download prediction data
      </Button>
      {startDownload && isValid && (
        <DownloadData
          predictionTarget={predictionTarget}
          populationData={populationData}
          temperatureData={temperatureData}
          precipitationData={precipitationData}
          period={period}
          orgUnits={orgUnits}
        />
      )}
    </div>
  );
};

export default PredictionPage;
