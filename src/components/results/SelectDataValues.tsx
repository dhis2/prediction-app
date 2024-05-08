import React, { useState } from 'react'
import { SingleSelect, IconAdd24, SingleSelectOption, Button }  from "@dhis2/ui";
import styles from "./styles/SelectDataValues.module.css";
import useDataElements from '../../hooks/useDataElements';
import ModalInstruction from './ModalInstruction';


interface SelectDataValuesProps {
    label : string,
    dataElements : any[] | undefined,
    value : {displayName : string, id : string} | null,
    disease : string,
    onChange : (v : {displayName : string, id : string}) => void
}

const SelectDataValues = ({value, onChange, label, disease, dataElements} : SelectDataValuesProps) => {
 
  const [modalOpen, setModalOpen] = useState(false);

  const onChangeSelect = (e : any) => {
    onChange({displayName : dataElements?.find((d : any) => d.id === e.selected).displayName, id : e.selected})
  }

  const noDataElements = dataElements?.length === 0 && dataElements != undefined;

  return (
    <div>
    <div  >
      <div className={styles.select}>
        <div className={styles.selectWrapper}>   
          <span>{label}</span>
          <SingleSelect placeholder='Select data element' disabled={noDataElements} selected={value ? value.id : ""} warning={noDataElements} onChange={onChangeSelect}>
            {dataElements?.map((de : any) => (
              <SingleSelectOption key={de.id} label={de.displayName} value={de.id} />
            ))}
          </SingleSelect>
        </div>

      </div>
      
      
    </div>
   

    </div>
  )
}

export default SelectDataValues