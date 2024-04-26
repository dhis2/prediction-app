import i18n from "@dhis2/d2-i18n";
import styles from "./styles/SettingsPage.module.css";

const SettingsPage = () => {
  return (
    <div className={styles.container}>
      <h1>{i18n.t("App settings")}</h1>
    </div>
  );
};

export default SettingsPage;
