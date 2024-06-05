import { useEffect, useState } from "react";
import i18n from "@dhis2/d2-i18n";
import { Button, IconError24, IconDownload24, IconArrowRight24 } from "@dhis2/ui";
import OrgUnits from "./OrgUnits";
import DataElement from "./DataElement";
import MonthlyPeriodSelect from "./MonthlyPeriodSelect";
import DownloadData from "./DownloadData";
import styles from "./styles/PredictionPage.module.css";
import OrgUnitLevel from "./OrgUnitLevel";
import { ErrorResponse } from "./DownloadData"
import React from "react";
import { useNavigate } from "react-router-dom";
import { DefaultService } from "../../httpfunctions";

const defaultPeriod = {
  startMonth: "2023-04",
  endMonth: "2024-03",
};

const PredictionPage = () => {

  const [predictionTarget, setPredictionTarget] = useState(/*{displayName: 'IDSR Malaria', id: 'vq2qO3eTrNi'}*/);
  const [populationData, setPopulationData] = useState(/*{"code":"DE_5808","displayName":"Total Population","id":"WUg3MYWQ7pt"}*/);
  const [temperatureData, setTemperatureData] = useState();
  const [precipitationData, setPrecipitationData] = useState();
  const [period, setPeriod] = useState(defaultPeriod);
  const [orgUnits, setOrgUnits] = useState([]);
  const [orgUnitLevel, setOrgUnitLevel] = useState<{id : string, level : number}>();
  const [errorChapMsg, setErrorChapMsg] = useState("")
  
  const [errorMessages, setErrorMessages] = useState<ErrorResponse[]>([])
  const [sendingDataToChap, setSendingDataToChap] = useState<boolean>(false)

  const [zipResult, setZipResult] = useState<any>(undefined);

  const [startDownload, setStartDownload] = useState<{downloadLocal : boolean, startDownlaod : boolean}>({downloadLocal : true, startDownlaod : false});

  const isValid = Boolean(
    predictionTarget &&
      populationData &&
      temperatureData &&
      precipitationData &&
      period &&
      (orgUnits.length > 0 || orgUnitLevel == undefined)
  );

  const onClickDownloadData = () => {
    setZipResult(undefined);
    setStartDownload({downloadLocal : true, startDownlaod : true});
  }

  const onClickSendDataToChap = () => {
    setZipResult(undefined);
    setStartDownload({downloadLocal : false, startDownlaod : true});
    setSendingDataToChap(true);
  }
  let navigate = useNavigate();
  const sendToChap = async () => {
    await DefaultService.postZipFilePostZipFilePost({file : zipResult}).then((response : any) => {
      setErrorChapMsg("");
      setSendingDataToChap(false);
      return navigate("/status");
    }).catch((error : any) => {
        setSendingDataToChap(false) 
        console.log(error?.body?.detail);
        setErrorChapMsg(error?.body?.detail);
      }) 
    };

  
  useEffect(() => {
    if(zipResult){
      sendToChap();
    }
  }, [zipResult])
  

  //checks that all selected orgUnits are on the same level
  function orgUnitsSelectedIsValid() {
    if (orgUnits.length === 0) {
      return true;
    }
  
    const firstElement = (orgUnits[0] as any).path.split("/").length;
    return orgUnits.every(innerArray => (innerArray as any).path.split("/").length === firstElement);
  }

  return (
    <div className={styles.container}>
      <h1>{i18n.t("Make prediction data")}</h1>
      <DataElement
        title={i18n.t("Prediction target")}
        label={i18n.t("Select data element")}
        selected={predictionTarget}
        onChange={setPredictionTarget}
      />
      <OrgUnits orgUnits={orgUnits} setOrgUnits={setOrgUnits}  />
      {!orgUnitsSelectedIsValid() && <p className={styles.error}>Only select organization units that are one the same level.</p>}
      <OrgUnitLevel
        orgUnitLevels={orgUnitLevel}
        onChange={setOrgUnitLevel}
          />
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
      <div className={styles.buttons}>
        <Button
          icon={<IconDownload24/>}
          loading={startDownload.startDownlaod}
          disabled={!isValid || startDownload.startDownlaod || !orgUnitsSelectedIsValid()}
          onClick={onClickDownloadData}
        >
          Download data
        </Button>
        <Button
          icon={<IconArrowRight24/>}
          primary
          loading={sendingDataToChap}
          disabled={!isValid || sendingDataToChap || !orgUnitsSelectedIsValid()}
          onClick={onClickSendDataToChap}
        >
          Send data to CHAP
      </Button>
      </div>

      {<p className={styles.errorChap}>{errorChapMsg}</p>}

      {startDownload.startDownlaod && isValid && (
        <DownloadData
          setZipResult={setZipResult}
          startDownload={startDownload}
          setStartDownload={setStartDownload}
          predictionData={predictionTarget}
          populationData={populationData}
          temperatureData={temperatureData}
          precipitationData={precipitationData}
          period={period}
          setErrorMessages={setErrorMessages}
          orgUnits={orgUnits}
          orgUnitLevel={orgUnitLevel as {id : string, level : number}}
        />
      )}
      {errorMessages.map((error : ErrorResponse, index) => (
        <div key={index} className={styles.errorBar}>
          <div className={styles.errorHeader}>
            <IconError24/>
            <span>{error.element} request failed</span>
          </div>
            <span className={styles.detailedError}>{JSON.stringify(error.error, null, 2)}</span>
        </div>
      ))}
    </div>
  );
};

export default PredictionPage;
