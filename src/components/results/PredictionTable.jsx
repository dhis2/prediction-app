import i18n from "@dhis2/d2-i18n";
import styles from "./styles/PredictionChart.module.css";

const getValue = (values, ou, key) => {
  const item = values.find((v) => v.orgUnit === ou && v.dataElement === key);
  return item ? Math.round(item.value) : null;
};

const PredictionTable = ({ data }) => {
  const values = data.dataValues;
  const orgUnits = [...new Set(values.map((v) => v.orgUnit))];

  console.log("orgUnits", orgUnits);

  console.log(values);
  return (
    <table>
      <thead>
        <tr>
          <th>Org unit</th>
          <th>Median</th>
          <th>Quantile low</th>
          <th>Quantile high</th>
        </tr>
      </thead>
      <tbody>
        {orgUnits.map((ou) => (
          <tr key={ou}>
            <td>{ou}</td>
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
