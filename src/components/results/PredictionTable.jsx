import i18n from "@dhis2/d2-i18n";
import styles from "./styles/PredictionTable.module.css";

const getValue = (values, ou, key) => {
  const item = values.find((v) => v.orgUnit === ou && v.dataElement === key);
  return item ? Math.round(item.value) : null;
};

const PredictionTable = ({ data }) => {
  const values = data.dataValues;
  const orgUnits = [...new Set(values.map((v) => v.orgUnit))];

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>{i18n.t("Org unit")}</th>
          <th>{i18n.t("Median")}</th>
          <th>{i18n.t("Quantile low")}</th>
          <th>{i18n.t("Quantile high")}</th>
        </tr>
      </thead>
      <tbody>
        {orgUnits.map((ou) => (
          <tr key={ou}>
            <th>{ou}</th>
            <td>{getValue(values, ou, "median")}</td>
            <td>{getValue(values, ou, "quantile_low")}</td>
            <td>{getValue(values, ou, "quantile_high")}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default PredictionTable;
