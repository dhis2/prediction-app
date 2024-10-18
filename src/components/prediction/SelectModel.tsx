import React, { useEffect, useState } from 'react'
import { DefaultService, Feature, ModelSpec } from '../../httpfunctions';
import { SingleSelectField, SingleSelectOption } from '@dhis2/ui';
import i18n from "@dhis2/d2-i18n";

interface SelectModelProps {
  selectedModel : ModelSpec | undefined
  setSelectedModel : (m : ModelSpec) => void
}

const offlineModel : ModelSpec = {
  name : "EWARS - monthly data (offline)",
  parameters : [],
  features : [
  {
    id : "population",
    description : "Select the data element for population",
    name : "Population"
  },
  {
    id : "disease",
    description : "Select the data element for disease cases",
    name : "Disease cases"
  }
]
}

const filterOutOptionalFeatures = (features : Feature[]) : Feature[] => {
  return features.filter((d : Feature) => d.optional == false)
}

const createTargetAsFeature = (target_name : string) : Feature => {
  return {
    id : target_name,
    description : "",
    optional : false,
    name : target_name.replaceAll("_", " ")
  }

}

const SelectModel = ({selectedModel, setSelectedModel} : SelectModelProps) => {

  const [models, setModels] = useState<ModelSpec[]>([])
  const [isLoadingModels, setIsLoadingModels] = useState(true)
  
    
  const getModels = async () => {
    await DefaultService.listModelsListModelsGet()
      .then((response : ModelSpec[]) => {

        //turn target_name into a feature
        let models : ModelSpec[] = response.map((d : ModelSpec) => {
          d.features = d.features.concat(d.targets ? [createTargetAsFeature(d.targets)] : [])
          return d
        })

        //filter out optional features
        models = models.map((d : ModelSpec) => {
          d.features = filterOutOptionalFeatures(d.features)
          return d
        })

        setIsLoadingModels(false)
        setModels(models)
      }).catch((error : any) => {
        //route probarly not set up, warning should be shown
        setModels([offlineModel])
        setSelectedModel(offlineModel)
        setIsLoadingModels(false)
      })
  }

  const onChangeModel = (event : any) => {
    const selcted = models?.find((d : ModelSpec) => d.name === event.selected) as ModelSpec
    setSelectedModel(selcted)
  }

  useEffect(() => {
    getModels()
  }, [])
  
  
  return (
    <div>
      <SingleSelectField label={i18n.t('Select a model')} loading={isLoadingModels} placeholder='Select the model to use in prediction' onChange={onChangeModel} selected={selectedModel?.name}>
        {models?.map((d : ModelSpec) => (
          <SingleSelectOption key={d.name} value={d.name} label={d.name}  />
        ))}
      </SingleSelectField>
    </div>
  )
}

export default SelectModel