import i18n from "@dhis2/d2-i18n";
import styles from "./styles/PredictionPage.module.css";

const PredictionPage = () => {
  return (
    <div className={styles.container}>
      <h1>{i18n.t("Make prediction")}</h1>
    </div>
  );
};

export default PredictionPage;
