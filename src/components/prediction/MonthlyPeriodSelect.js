import PropTypes from "prop-types";
import i18n from "@dhis2/d2-i18n";
import MonthPicker from "./MonthPicker";
import styles from "./styles/Period.module.css";

const MonthlyPeriodSelect = ({ period, onChange }) => {
  console.log("MonthlyPeriodSelect", period);
  const { startMonth, endMonth } = period;

  return (
    <div className={styles.container}>
      <h2>{i18n.t("Period")}</h2>
      <div className={styles.pickers}>
        <MonthPicker
          label={i18n.t("Start month")}
          defaultVal={startMonth}
          onChange={(startMonth) => onChange({ ...period, startMonth })}
        />
        <MonthPicker
          label={i18n.t("End month")}
          defaultVal={endMonth}
          onChange={(endMonth) => onChange({ ...period, endMonth })}
        />
      </div>
    </div>
  );
};

MonthlyPeriodSelect.propTypes = {
  currentPeriod: PropTypes.object.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default MonthlyPeriodSelect;
