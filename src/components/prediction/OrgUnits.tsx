import PropTypes from "prop-types";
import i18n from "@dhis2/d2-i18n";
import OrgUnitTree from "./OrgUnitTree";
import OrgUnitLevel from "./OrgUnitLevel";
import React from "react";


interface OrgUnitsProps {
  orgUnits : any[],
  setOrgUnits : (orgUnits : any) => void
  orgUnitLevels : any[],
  setOrgUnitLevels : (orgUnitLevels : any) => void
}

const OrgUnits = ({ orgUnits, setOrgUnits, orgUnitLevels, setOrgUnitLevels } : OrgUnitsProps) => {

  const onChangeOrgUnitTree = (selected : any) => {
    if(selected.checked){
      setOrgUnits([...orgUnits, selected])
    }
    else{
      setOrgUnits(orgUnits.filter((e : any) => e.path !== selected.path))
    }
  }


  return (
    <>
    
      <OrgUnitTree
        selectedOrgUnits={orgUnits}
        onChange={(selected : any) => {onChangeOrgUnitTree(selected)}}
      />
      <OrgUnitLevel
        orgUnitLevels={orgUnitLevels}
        onChange={(levels) => setOrgUnitLevels(levels.selected)}
          />
    </>
  );
};

export default OrgUnits;
