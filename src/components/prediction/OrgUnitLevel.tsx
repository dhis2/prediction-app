import PropTypes from "prop-types";
import i18n from "@dhis2/d2-i18n";
import { useEffect } from "react";
import { MultiSelectField, MultiSelectOption  } from "@dhis2/ui";
import  useOrgUnitLevels from "../../hooks/useOrgUnitLevels";

import React from "react";

interface OrgUnitLevelProps {
  orgUnitLevels : any[],
  onChange : (selected_levels : any) => void
}

const OrgUnitLevel = ({ orgUnitLevels, onChange } : OrgUnitLevelProps) => {
  const { levels, loading, error } = useOrgUnitLevels();

  // Set second level as default
  useEffect(() => {
    if (levels?.length > 1 && !orgUnitLevels) {
      onChange([levels[1]]);
    }
  }, [levels, orgUnitLevels, onChange]);

  return levels ? (
    <div>
      <h2>{i18n.t("Organisation unit level")}</h2>
      <MultiSelectField
        label={i18n.t("Organisation unit level to import data to")}
        selected={orgUnitLevels}
        loading={loading}
        error={!!error}
        validationText={error?.message}
        onChange={onChange}
      >
        {levels.map((l : any, i : any) => (
          <MultiSelectOption  key={l.id} value={l.id} label={l.name} />
        ))}
      </MultiSelectField>
    </div>
  ) : null;
};


export default OrgUnitLevel;
