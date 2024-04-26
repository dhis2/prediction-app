import { useEffect } from "react";
import PropTypes from "prop-types";
import i18n from "@dhis2/d2-i18n";
import { useDataQuery } from "@dhis2/app-runtime";
import { SingleSelectField, SingleSelectOption } from "@dhis2/ui";

const dataElementQuery = {
  results: {
    resource: "dataElements",
    params: {
      paging: false,
      filter: "domainType:eq:AGGREGATE",
      fields: "id,code,displayName",
    },
  },
};

const DataElement = ({ title, label, selected, dataElementCode, onChange }) => {
  const { loading, error, data } = useDataQuery(dataElementQuery);
  const dataElements = data?.results?.dataElements;

  useEffect(() => {
    if (!selected && dataElementCode && dataElements) {
      const defaultDataElement = dataElements.find(
        (d) => d.code === dataElementCode
      );

      if (defaultDataElement) {
        onChange(defaultDataElement);
      }
    }
  }, [selected, dataElementCode, dataElements, onChange]);

  return (
    <div>
      <h2>{title}</h2>
      <SingleSelectField
        filterable
        noMatchText={i18n.t("No match found")}
        label={label}
        selected={selected?.id}
        loading={loading}
        error={!!error}
        validationText={error?.message}
        onChange={({ selected }) =>
          onChange(dataElements?.find((d) => d.id === selected))
        }
      >
        {dataElements?.map((d) => (
          <SingleSelectOption key={d.id} value={d.id} label={d.displayName} />
        ))}
      </SingleSelectField>
    </div>
  );
};

DataElement.propTypes = {
  title: PropTypes.string,
  label: PropTypes.string,
  selected: PropTypes.object,
  dataset: PropTypes.object,
  onChange: PropTypes.func.isRequired,
};

export default DataElement;
