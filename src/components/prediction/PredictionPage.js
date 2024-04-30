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
  const [predictionTarget, setPredictionTarget] = useState({displayName: 'IDSR Malaria', id: 'vq2qO3eTrNi'});
  const [populationData, setPopulationData] = useState({"code":"DE_5808","displayName":"Total Population","id":"WUg3MYWQ7pt"});
  const [temperatureData, setTemperatureData] = useState();
  const [precipitationData, setPrecipitationData] = useState();
  const [period, setPeriod] = useState(defaultPeriod);
  const [orgUnits, setOrgUnits] = useState([]);
  const [orgUnitLevels, setOrgUnitLevels] = useState(["wjP19dkFeIk"]);

  const [startDownload, setStartDownload] = useState(false);

  const isValid = Boolean(
    predictionTarget &&
      populationData &&
      temperatureData &&
      precipitationData &&
      period &&
      (orgUnits.length > 0 || orgUnitLevels.length > 0)
  );

  return (
    <div className={styles.container}>
      <h1>{i18n.t("Make prediction")}</h1>
      <DataElement
        title={i18n.t("Prediction target")}
        label={i18n.t("Select data element")}
        selected={predictionTarget}
        onChange={setPredictionTarget}
      />
      <OrgUnits orgUnits={orgUnits} setOrgUnits={setOrgUnits} setOrgUnitLevels={setOrgUnitLevels} orgUnitLevels={orgUnitLevels} />
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
        loading={startDownload}
        disabled={!isValid || startDownload}
        onClick={() => setStartDownload(true)}
      >
        Download prediction data
      </Button>
      {startDownload && isValid && (
        <DownloadData
          setStartDownload={setStartDownload}
          predictionTarget={predictionTarget}
          populationData={populationData}
          temperatureData={temperatureData}
          precipitationData={precipitationData}
          period={period}
          orgUnits={orgUnits}
          orgUnitLevels={orgUnitLevels}
        />
      )}
    </div>
  );
};

export default PredictionPage;
