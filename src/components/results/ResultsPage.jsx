import { useState } from "react";
import i18n from "@dhis2/d2-i18n";
import StyledDropzone from "./StyledDropzone";
import PredictionTable from "./PredictionTable";
import styles from "./styles/ResultsPage.module.css";

const ResultsPage = () => {
  const [prediction, setPrediction] = useState();

  return (
    <div className={styles.container}>
      <h1>{i18n.t("Prediction results")}</h1>
      <StyledDropzone onLoad={setPrediction} />
      {prediction && <PredictionTable data={prediction} />}
    </div>
  );
};

export default ResultsPage;
