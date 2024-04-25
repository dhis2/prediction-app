import { useState, useEffect } from "react";
import i18n from "@dhis2/d2-i18n";
import DataElement from "./DataElement";
import OrgUnits from "./OrgUnits";
import styles from "./styles/PredictionPage.module.css";

const PredictionPage = () => {
  const [dataElement, setDataElement] = useState();
  const [orgUnits, setOrgUnits] = useState();

  return (
    <div className={styles.container}>
      <h1>{i18n.t("Make prediction")}</h1>
      <DataElement
        selected={dataElement}
        // dataset={dataset}
        onChange={setDataElement}
      />
      <OrgUnits selected={orgUnits} onChange={setOrgUnits} />
    </div>
  );
};

export default PredictionPage;
