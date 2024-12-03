import { useEffect, useRef, useState } from 'react';
import i18n from '@dhis2/d2-i18n';
import {
  Button,
  IconError24,
  IconDownload24,
  IconArrowRight24,
  Popover,
  Chip,
  IconInfo16,
  IconInfo24,
  IconQuestion24,
} from '@dhis2/ui';
import OrgUnits from './OrgUnits';
import DataElement from './DataElement';
import MonthlyPeriodSelect from './MonthlyPeriodSelect';
import DownloadData from './DownloadData';
import styles from './styles/PredictionPage.module.css';
import OrgUnitLevel from './OrgUnitLevel';
import { ErrorResponse } from './DownloadData';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DefaultService, Feature, ModelSpec, OpenAPI, PredictionRequest } from '../../httpfunctions';
import { useConfig } from '@dhis2/app-runtime';
import Period from './Periods';
import { PeriodDimension } from '@dhis2/analytics';
import SelectModel from './SelectModel';
import ModelFeatures from './ModelFeatures';
import { ModelFeatureDataElementMap } from '../../interfaces/ModelFeatureDataElement';
import saveAs from 'file-saver';
import PredictEvaluateHelp from './PredictEvaluateHelp';

const defaultPeriod = {
  startMonth: '2023-04',
  endMonth: '2024-03',
};

const PredictionPage = () => {
  
  const config = useConfig()

  const navigate = useNavigate();

  //IF NOT SUCCESSFUL STATS, SEND USER TO PAGE WHERE ROUTE IS CONFIGURED, BUT NO CONNECTION TO CHAP

  const { systemInfo = {} } = useConfig();

  //const { calendar = 'gregory' } = systemInfo;

  const [selectedModel, setSelectedModel] = useState<ModelSpec | undefined>(undefined)
  const [modelSpesificSelectedDataElements, setModelSpesificSelectedDataElements] = useState<ModelFeatureDataElementMap>(new Map())
  const [request, setRequest] = useState<PredictionRequest | undefined>(undefined)
  const [geoJson, setGeoJson] = useState<any>(undefined)

  const [period, setPeriod] = useState(defaultPeriod);
  const [orgUnits, setOrgUnits] = useState([]);
  const [orgUnitLevel, setOrgUnitLevel] = useState<{
    id: string;
    level: number;
  }>();
  const [errorChapMsg, setErrorChapMsg] = useState('');

  const [errorMessages, setErrorMessages] = useState<ErrorResponse[]>([]);
  const [sendingDataToChap, setSendingDataToChap] = useState<boolean>(false);

  const [jsonResult, setJsonResult] = useState<PredictionRequest | undefined>(undefined);
  const [selectedPeriodItems, setSelectedPeriodItems] = useState();

  const [startDownload, setStartDownload] = useState<{action: "download" | "predict" | "evaluate", startDownlaod: boolean}>({ action: "download", startDownlaod: false });
  const [renderOptionalField, setRenderOptionalField] = useState<boolean | undefined>(false)

  const isValid = Boolean(
      selectedPeriodItems &&
      (orgUnits.length > 0 || orgUnitLevel == undefined)
  );

  const handleSelectedPeriod = (selectedPeriods : any) => {
    setSelectedPeriodItems(selectedPeriods.items);
    console.log('selectedPeriods', selectedPeriods.items);
  };

  const onSelectModel = (selected : ModelSpec) => {
    setModelSpesificSelectedDataElements(new Map())
    setSelectedModel(selected)
  }

  const onClickDownloadOrPostData = (action : "download" | "predict" | "evaluate") => {
    setJsonResult(undefined);
    setStartDownload({ action: action, startDownlaod: true });
  }

  //triggers when anayltics content is fetched
  useEffect(() => {
    console.log(jsonResult)
    if (jsonResult) {
      setStartDownload(prev => ({ ...prev, startDownlaod: false }));
      if(startDownload.action === "download") downloadData();
      if(startDownload.action === "predict") predict();     
      if(startDownload.action === "evaluate") evaluate();
    }
  }, [jsonResult]);

  const downloadData = () => {
    var fileToSave = new Blob([JSON.stringify(jsonResult, null, 2)], {
      type: 'application/json'
    });

    const today = new Date();
    saveAs(fileToSave, "chap_request_data_"+ today.toJSON() + '.json');
  }

  const evaluate = async () => {
    let request : PredictionRequest = jsonResult as PredictionRequest
    request.n_periods = 3

    await DefaultService.evaluateEvaluatePost(request)
      .then((response: any) => {
        setErrorChapMsg('');
        setSendingDataToChap(false);
        return navigate('/status');
      })
      .catch((error: any) => {
        setSendingDataToChap(false);
        console.log(error?.body?.detail);
        setErrorChapMsg(error?.body?.detail);
      });
  }

  const predict = async () => {
    let request : PredictionRequest = jsonResult as PredictionRequest
    request.n_periods = 3

    await DefaultService.predictPredictPost(request)
      .then((response: any) => {
        setErrorChapMsg('');
        setSendingDataToChap(false);
        return navigate('/status');
      })
      .catch((error: any) => {
        setSendingDataToChap(false);
        console.log(error?.body?.detail);
        setErrorChapMsg(error?.body?.detail);
      });
  };

  //checks that all selected orgUnits are on the same level
  function orgUnitsSelectedIsValid() {
    if (orgUnits.length === 0) {
      return true;
    }

    const firstElement = (orgUnits[0] as any).path.split('/').length;
    return orgUnits.every(
      (innerArray) =>
        (innerArray as any).path.split('/').length === firstElement
    );
  }

  const renderMainForm = () => {
    //if select to use ERA5-Land, and all required fields are selected
    if (selectedModel?.features.filter(f => !f.optional).length == [...modelSpesificSelectedDataElements].filter(([k, v]) => !v.optional).length && !renderOptionalField) {
      return true
    }
    //if select to use climate data source from DHIS2, and all required fields are selected
    if (modelSpesificSelectedDataElements?.size == selectedModel?.features.length) {
      return true
    }
    return false
  }



  return (
    <div className={styles.container}>

      <h1>{i18n.t('Select training data and create prediction')}</h1>

      <SelectModel selectedModel={selectedModel} setSelectedModel={onSelectModel}/>


      <ModelFeatures setRenderOptionalField={setRenderOptionalField} renderOptionalField={renderOptionalField} features={selectedModel?.features} setModelSpesificSelectedDataElements={setModelSpesificSelectedDataElements} modelSpesificSelectedDataElements={modelSpesificSelectedDataElements} />

      {renderMainForm() &&
      <>
        
        <OrgUnits orgUnits={orgUnits} setOrgUnits={setOrgUnits} />
        {!orgUnitsSelectedIsValid() && (
          <p className={styles.error}>
            Only select organization units that are one the same level.
          </p>
        )}
        <OrgUnitLevel orgUnitLevels={orgUnitLevel} onChange={setOrgUnitLevel} />

        <div className={styles.container}>
          <h3>{i18n.t('Training period')}</h3>

          <div className={styles.pickers}>
            <PeriodDimension     
              selectedPeriods={selectedPeriodItems}
              onSelect={handleSelectedPeriod}
              excludedPeriodTypes={[]}
            />
          </div>
        </div>
        <div className={styles.buttons} >
          <Button
            icon={<IconDownload24 />}
            loading={startDownload.startDownlaod}
            disabled={
              !isValid ||
              (startDownload.startDownlaod && startDownload.action === "download") ||
              !orgUnitsSelectedIsValid()
            }
            onClick={() => onClickDownloadOrPostData("download")}
          >
            Download data
          </Button>
          <Button
            icon={<IconArrowRight24 />}
            primary
            loading={sendingDataToChap}
            disabled={!isValid || (startDownload.startDownlaod) || !orgUnitsSelectedIsValid()}
            onClick={() =>onClickDownloadOrPostData("predict")}
          >
            Predict
          </Button>
          <Button
            icon={<IconArrowRight24 />}
            primary
            loading={sendingDataToChap}
            disabled={!isValid || (startDownload.startDownlaod) || !orgUnitsSelectedIsValid()}
            onClick={() =>onClickDownloadOrPostData("evaluate")}
          >
            Evaluate
          </Button>
        </div>
        <PredictEvaluateHelp/>

        {<p className={styles.errorChap}>{errorChapMsg}</p>}
        {startDownload.startDownlaod && isValid && (
          <DownloadData
            model_id={selectedModel?.name}
            setJsonResult={setJsonResult}
            modelSpesificSelectedDataElements={modelSpesificSelectedDataElements}
            startDownload={startDownload}
            setStartDownload={setStartDownload}
            period={selectedPeriodItems}
            setErrorMessages={setErrorMessages}
            orgUnits={orgUnits}
            orgUnitLevel={orgUnitLevel as { id: string; level: number }}
          />
        )}
        {errorMessages.map((error: ErrorResponse, index) => (
          <div key={index} className={styles.errorBar}>
            <div className={styles.errorHeader}>
              <IconError24 />
              <span>{error.element} request failed</span>
            </div>
            <span className={styles.detailedError}>

            </span>
          </div>
        ))}        
      </>}
    </div>
  );
};

export default PredictionPage
