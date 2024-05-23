import i18n from "@dhis2/d2-i18n";
import { useEffect } from "react";
import { SingleSelect, SingleSelectOption  } from "@dhis2/ui";
import  useOrgUnitLevels from "../../hooks/useOrgUnitLevels";
import React from "react";

interface OrgUnitLevelProps {
  orgUnitLevels : {id : string, level : number},
  onChange : (selected_level : {id : string, level : number}) => void
}

const OrgUnitLevel = ({ orgUnitLevels, onChange } : OrgUnitLevelProps) => {
  const { levels, loading, error } = useOrgUnitLevels();

  const onChangeLevel = (e : any) => {
    const newSelected = {id : e.selected, level : (levels.find((l : any) => l.id === e.selected) as any).level}
    onChange(newSelected)
  }

  // Set second level as default
  useEffect(() => {
    if (levels?.length > 1 && !orgUnitLevels) {
      //onChange([levels[1]]);
    }
  }, [levels, orgUnitLevels, onChange]);

  return levels ? (
    <div>
      <h2>{i18n.t("Organisation unit level")}</h2>
      <span>{i18n.t("Organisation unit level to import data to")}</span>
      <SingleSelect
        selected={orgUnitLevels.id}
        loading={loading}
        error={!!error}
        onChange={onChangeLevel}
      >
        {levels.map((l : any, i : any) => (
          <SingleSelectOption key={l.id} value={l.id} label={l.name} />
        ))}
      </SingleSelect>
    </div>
  ) : null;
};


export default OrgUnitLevel;
