import PropTypes from "prop-types";
import i18n from "@dhis2/d2-i18n";
import OrgUnitTree from "./OrgUnitTree";
import OrgUnitLevel from "./OrgUnitLevel";
import styles from "../styles/OrgUnits.module.css";
import React from "react";


interface OrgUnitsProps {
  orgUnits : any[],
  setOrgUnits : (orgUnits : any) => void
  orgUnitLevels : any[],
  setOrgUnitLevels : (orgUnitLevels : any) => void
}

const OrgUnits = ({ orgUnits, setOrgUnits, orgUnitLevels, setOrgUnitLevels } : OrgUnitsProps) => {

  const parentIsBelowLevel = false//parent && parent.path.split("/").length - 1 > Number(level);

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
      {parentIsBelowLevel && (
        <div className={styles.warning}>
          {i18n.t(
            "Org unit parent needs to be above or equal to the org unit level"
          )}
          
        </div>
       
      )}
      <OrgUnitLevel
        orgUnitLevels={orgUnitLevels}
        onChange={(levels) => setOrgUnitLevels(levels.selected)}
          />
    </>
  );
};

export default OrgUnits;
