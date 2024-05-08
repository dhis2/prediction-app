import { useState, useEffect } from "react";
import i18n from "@dhis2/d2-i18n";
import StyledDropzone from "./StyledDropzone";
import PredictionTable from "./PredictionTable";
import styles from "./styles/ResultsPage.module.css";
import React from "react";
import PredictionChart from "./PredictionChart";
import useOrgUnits from "../../hooks/useOrgUnits";
import { Button, TabBar, IconArrowRight24, IconVisualizationColumn24, Tab } from "@dhis2/ui";
import PostResult from "./PostResult";
import SelectDataValues from "./SelectDataValues";
import SetupInstruction from './SetupInstruction';
import useDataElements from "../../hooks/useDataElements";
import useDataElement from "../../hooks/useDataElement";
import PredictionTitle from "./PredictionTitle";

const ResultsPage = () => {
  const [prediction, setPrediction] = useState<any>();
  const [selectedTab, setSelectedTab] = useState<"chart" | "table">("chart");

  const [qLowDataElement, setqLowDataElementId] = useState<{displayName : string, id : string} | null>(null);
  const [qMedianDataElement, setqMedianDataElementId] = useState<{displayName : string, id : string}  | null>(null)
  const [qHighDataElement, setqHighDataElementId] = useState<{displayName : string, id : string} | null>(null);

  //Every dataElement that have a code that start with CHAP_LOW would be fetched, same for CHAP_MEDIAN and CHAP_HIGH
  const { dataElements : dataElementsLow } = useDataElements("CHAP_LOW")
  const { dataElements : dataElementsMedian } = useDataElements("CHAP_MEDIAN")
  const { dataElements : dataElementsHigh } = useDataElements("CHAP_HIGH")

  

  //States related to posting the prediction
  const [postStatus, setPostStatus] = useState<"loading" | "finish" | "error" | "initial">("initial");
  const [postHttpError, setPostHttpError] = useState("");

  const [predictionTargetId, setPredictionTarget] = useState<string | null>(null);
  const { displayName : predictionTargetName } = useDataElement(predictionTargetId);

  const {orgUnits, loading : orgUnitLoading} = useOrgUnits();

  const oneOrMoreDataElementMissing = () => {
    if(dataElementsLow?.length === 0 || dataElementsMedian?.length === 0 || dataElementsHigh?.length === 0) {
      return true;
    }
    return false;
  }

  //if user has selcted to import prediction into a data element that not contain the predictionName, give a warning to the user.
  const warnAboutUnequalDiseaseAndDataElement = () => {
    //do not warn when nothing is selected
    if(!qLowDataElement && !qMedianDataElement && !qHighDataElement) {
      return false;
    }
    //show warning if any of the selected data elements do not match the disease
    if (qLowDataElement && !qLowDataElement?.displayName.includes(predictionTargetName)) return true;
    if (qMedianDataElement && !qMedianDataElement?.displayName.includes(predictionTargetName)) return true;
    if (qHighDataElement && !qHighDataElement?.displayName.includes(predictionTargetName)) return true;
    return false;
  }

  const updateFileContent = (data : any) => {
    setPredictionTarget(data.predictionTarget);
    setPostHttpError("");
    setPostStatus("initial");
    setPrediction(fillWithOrgUnit(data))
  }

  //This add the name of the orgUnit, by mapping the id of the orgUnit
  const fillWithOrgUnit = (data: any) => {
    return ({dataValues : data.dataValues.map((d: any) => {  
      return {
        ...d,
        displayName : (orgUnits?.organisationUnits.find((ou: any) => ou.id === d.orgUnit) as any).displayName
        }
      })
    })
  };
  
  const validateData = () => {
    if(qLowDataElement && qMedianDataElement && qHighDataElement) {
      return true;
    }
    return false;
  }

  const getPeriode = () => {
    if(!prediction) return "";
    if(prediction.dataValues.length === 0) return "";
    return prediction.dataValues[0].period;
  }

  return (
    <div className={styles.container}>
      <h1>{i18n.t("Prediction results")}</h1>
      <StyledDropzone disabled={orgUnitLoading} onLoad={updateFileContent} />

      { prediction &&
        <>

        <TabBar scrollable>
          <Tab selected={selectedTab === "chart"} onClick={() => setSelectedTab("chart")}>
            Chart
          </Tab>
          <Tab selected={selectedTab === "table"} onClick={() => setSelectedTab("table")}>
            Table
          </Tab>
        </TabBar>
      
      
        <div className={styles.prediction}>
          {
            {
              'chart': <PredictionChart predictionTargetName={predictionTargetName} data={prediction} periode={getPeriode()}/>,
              'table': <PredictionTable predictionTargetName={predictionTargetName}  data={prediction} periode={getPeriode()}/>
            }[selectedTab]
          }
        </div>
        

        <h3>{i18n.t("Select whiche data element predication should be imported to:")}</h3>
        <SetupInstruction warning={oneOrMoreDataElementMissing()} disease={predictionTargetName} />

        <SelectDataValues label="Select data element for low quantile" dataElements={dataElementsLow} onChange={setqLowDataElementId} value={qLowDataElement} disease={predictionTargetName} />
        <SelectDataValues label="Select data element for medium quantile" dataElements={dataElementsMedian} onChange={setqMedianDataElementId} value={qMedianDataElement} disease={predictionTargetName}/>
        <SelectDataValues label="Select data element for high quantile" dataElements={dataElementsHigh} onChange={setqHighDataElementId} value={qHighDataElement} disease={predictionTargetName}/>

        {warnAboutUnequalDiseaseAndDataElement() && <p className={styles.warning}>{i18n.t("Warning: It seems like selected data elements do not match the disease of prediction.")}</p>}
        
        


        <div className={styles.footer}>
          <Button onClick={() => setPostStatus("loading")} loading={postStatus === "loading"} disabled={postStatus === "finish" || postStatus === "loading"  || !validateData()}  icon={<IconArrowRight24/>} primary>Import prediction</Button>
        </div>

        {postStatus === "loading" && 
          <PostResult setPostHttpError={setPostHttpError} setPostStatus={setPostStatus} prediction={prediction} lowDataValueId={qLowDataElement?.id as string} medianDataValueId={qMedianDataElement?.id  as string} highDataValueId={qHighDataElement?.id  as string}/>}

        <div className={styles.post}>
          {postStatus === "finish" && <p className={styles.greenText}>{i18n.t("Prediction has been imported.")}</p>}
          <p className={styles.redText}>{i18n.t(postHttpError)}</p>
        </div>

        </>
      }
      
      
      
      

    </div>
  );
};

export default ResultsPage;
