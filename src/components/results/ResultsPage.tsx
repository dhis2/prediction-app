import { useState, useEffect } from "react";
import i18n from "@dhis2/d2-i18n";
import StyledDropzone from "./StyledDropzone";
import PredictionTable from "./PredictionTable";
import styles from "./styles/ResultsPage.module.css";
import React from "react";
import PredictionChart from "./PredictionChart";
import useOrgUnits from "../../hooks/useOrgUnits";
import { Button, TabBar, Tab } from "@dhis2/ui";
import PostResult from "./PostResult";
import SelectDataValues from "./SelectDataValues";
import SetupInstruction from './SetupInstruction';
import useDataElements from "../../hooks/useDataElements";

const ResultsPage = () => {
  const [prediction, setPrediction] = useState<any>();
  const [selectedTab, setSelectedTab] = useState<"chart" | "table">("chart");

  const [qLowDataElement, setqLowDataElementId] = useState<{displayName : string, id : string} | null>(null);
  const [qMedianDataElement, setqMedianDataElementId] = useState<{displayName : string, id : string}  | null>(null)
  const [qHighDataElement, setqHighDataElementId] = useState<{displayName : string, id : string} | null>(null);

  const { dataElements : dataElementsLow } = useDataElements("CHAP_LOW")
  const { dataElements : dataElementsMedian } = useDataElements("CHAP_MEDIAN")
  const { dataElements : dataElementsHigh } = useDataElements("CHAP_HIGH")

  const [disease, setDisease] = useState("Dengue")

  const {orgUnits, loading, error} = useOrgUnits();

  const showInstructions = true;

  const oneOrMoreDataElementMissing = () => {
    if(dataElementsLow?.length === 0 || dataElementsMedian?.length === 0 || dataElementsHigh?.length === 0) {
      return true;
    }
    return false;
  }

  const warnAboutUnequalDiseaseAndDataElement = () => {
    //do not warn when nothing is selected
    if(!qLowDataElement && !qMedianDataElement && !qHighDataElement) {
      return false;
    }
    //show warning if any of the selected data elements do not match the disease
    if (qLowDataElement && !qLowDataElement?.displayName.includes(disease)) return true;
    if (qMedianDataElement && !qMedianDataElement?.displayName.includes(disease)) return true;
    if (qHighDataElement && !qHighDataElement?.displayName.includes(disease)) return true;
    return false;
  }

  const fillWithOrgUnit = (data: any) => {
    setPrediction({dataValues : data.dataValues.map((d: any) => {  
      return {
        ...d,
        displayName : (orgUnits?.organisationUnits.find((ou: any) => ou.id === d.orgUnit) as any).displayName
        }
      })
    })
  };


  return (
    <div className={styles.container}>
      <h1>{i18n.t("Prediction results")}</h1>
      <StyledDropzone onLoad={fillWithOrgUnit} />

      <TabBar scrollable>
        <Tab selected={selectedTab === "chart"} onClick={() => setSelectedTab("chart")}>
          Chart
        </Tab>
        <Tab selected={selectedTab === "table"} onClick={() => setSelectedTab("table")}>
          Table
        </Tab>
      </TabBar>

      <div className={styles.prediction}>
        { prediction &&
          {
            'chart': <PredictionChart data={prediction}/>,
            'table': <PredictionTable data={prediction}/>
          }[selectedTab]
        }
      </div>

      <h3>{i18n.t("Select whiche data element predication should be imported to:")}</h3>
      {showInstructions && <SetupInstruction warning={oneOrMoreDataElementMissing()} disease={disease} />}

      <SelectDataValues label="Select data element for low quantile" dataElements={dataElementsLow} onChange={setqLowDataElementId} value={qLowDataElement} disease={disease} />
      <SelectDataValues label="Select data element for medium quantile" dataElements={dataElementsMedian} onChange={setqMedianDataElementId} value={qMedianDataElement} disease={disease}/>
      <SelectDataValues label="Select data element for high quantile" dataElements={dataElementsHigh} onChange={setqHighDataElementId} value={qHighDataElement} disease={disease}/>

      {warnAboutUnequalDiseaseAndDataElement() && <p className={styles.warning}>{i18n.t("Warning: It seems like selected data elements do not match the disease of prediction.")}</p>}

      {prediction && <PostResult prediction={prediction} lowDataValueId={qLowDataElement?.id} medianDataValueId={qMedianDataElement?.id} highDataValueId={qHighDataElement?.id}/>}

    </div>
  );
};

export default ResultsPage;
