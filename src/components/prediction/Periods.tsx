import PropTypes from "prop-types";
import i18n from "@dhis2/d2-i18n";
import { CalendarInput } from "@dhis2/ui";
import styles from "./styles/Period.module.css";
import { DataProvider } from "@dhis2/app-runtime";
import { PeriodDimension } from "@dhis2/analytics";

const Period = ({ calendar, period, onChange }) => {
  const handleStartDateChange = (selectedDate) => {
    period.startDate = selectedDate?.calendarDateString;
    onChange({ ...period, selectedDate });
  };

  let selectedItems = [];

  const handleSelectedPeriod = (selectedPeriods) => {
    console.log("selected periods:  ", selectedPeriods);
  };

  const handleEndDateChange = (selectedDate) => {
    period.endDate = selectedDate?.calendarDateString;
    onChange({ ...period, selectedDate });
  };

  return (
    <div className={styles.container}>
      <h2>{i18n.t("Period")}</h2>

      <div className={styles.pickers}>
        <CalendarInput
          onDateSelect={handleStartDateChange}
          date={period.startDate}
          calendar={calendar}
          label={i18n.t("Start date")}
        />

        <CalendarInput
          onDateSelect={handleEndDateChange}
          date={period.endDate}
          calendar={calendar}
          label={i18n.t("End date")}
        />

        {/*
        <PeriodDimension
          selectedPeriods={selectedItems}
          onSelect={handleSelectedPeriod}
          excludedPeriodTypes={[]}
          // TODO: infoBoxMessage should ideally be implemented for all dimensions
  />*/}
      </div>
    </div>
  );
};

Period.propTypes = {
  period: PropTypes.object,
  onChange: PropTypes.func.isRequired,
};

export default Period;
