import React from 'react'
import { Feature } from '../../httpfunctions'
import { SingleSelect, SingleSelectField, SingleSelectOption } from '@dhis2/ui'
import { useDataQuery } from '@dhis2/app-runtime'
import styles from './styles/ModelFeature.module.css'
import i18n from "@dhis2/d2-i18n";
import { ModelFeatureDataElementMap } from '../../interfaces/ModelFeatureDataElement'

interface ModelFeaturesProps {
  features : Feature[] | undefined
  setModelSpesificSelectedDataElements : (request : ModelFeatureDataElementMap) => void
  modelSpesificSelectedDataElements : ModelFeatureDataElementMap
}

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


const ModelFeatures = ({features, modelSpesificSelectedDataElements, setModelSpesificSelectedDataElements} : ModelFeaturesProps) => {

  const { loading, error, data } = useDataQuery(dataElementQuery);
  const dataElements = (data?.results as any)?.dataElements;

  if(!features){
    return <></>
  }

  
  const onChangeSelectField = (feature : Feature, e : any) =>{
    const feature_with_selected_data_elements = {selected_data_element : e.selected}
    setModelSpesificSelectedDataElements(new Map(modelSpesificSelectedDataElements.set(feature.id, feature_with_selected_data_elements)));
  }

  return (
    <div>
      {features.map((f : Feature) => (
        <div key={f.id} className={styles.selectField}>
          <SingleSelectField tabIndex='1' filterable noMatchText={i18n.t("No match found")} onChange={(e : any) => onChangeSelectField(f, e)} label={f.name} helpText={f.description} selected={modelSpesificSelectedDataElements.get(f.id)?.selected_data_element}>
              {dataElements?.map((d : any) => (
                <SingleSelectOption key={d.id} value={d.id} label={d.displayName} />
              ))}
          </SingleSelectField>
        </div>
      ))
      }
    </div>
  )
}

export default ModelFeatures