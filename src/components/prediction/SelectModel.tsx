import React, { useEffect, useState } from 'react'
import { DefaultService, ModelSpec } from '../../httpfunctions';
import { SingleSelectField, SingleSelectOption } from '@dhis2/ui';
import i18n from "@dhis2/d2-i18n";

interface SelectModelProps {
  selectedModel : ModelSpec | undefined
  setSelectedModel : (m : ModelSpec) => void
}

const SelectModel = ({selectedModel, setSelectedModel} : SelectModelProps) => {

  const [models, setModels] = useState<ModelSpec[]>([])
    
  const getModels = async () => {
    await DefaultService.listModelsListModelsGet()
      .then((response : ModelSpec[]) => {
        setModels(response)
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
      <SingleSelectField label={i18n.t('Select a model')} onChange={onChangeModel} selected={selectedModel?.name}>
        {models?.map((d : ModelSpec) => (
          <SingleSelectOption key={d.name} value={d.name} label={d.name}  />
        ))}
      </SingleSelectField>
    </div>
  )
}

export default SelectModel