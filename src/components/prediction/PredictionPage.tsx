import { useEffect, useState } from 'react';
import i18n from '@dhis2/d2-i18n';
import {
  Button,
  IconError24,
  IconDownload24,
  IconArrowRight24,
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
import SwitchClimateSources from '../climateSource/SwitchClimateSources';
import saveAs from 'file-saver';

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

  const [startDownload, setStartDownload] = useState<{action: "download" | "post", startDownlaod: boolean}>({ action: "download", startDownlaod: false });

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

  const onClickDownloadOrPostData = (action : "download" | "post") => {
    setJsonResult(undefined);
    setStartDownload({ action: action, startDownlaod: true });
  }

  //triggers when chap-content is fetched
  useEffect(() => {
    if (jsonResult) {
      setStartDownload(prev => ({ ...prev, startDownlaod: false }));
      if(startDownload.action === "download") downloadData();
      if(startDownload.action === "post") sendToChap();     
    }
  }, [jsonResult]);

  const downloadData = () => {
    var fileToSave = new Blob([JSON.stringify(jsonResult, null, 2)], {
      type: 'application/json'
    });

    const today = new Date();
    saveAs(fileToSave, "chap_request_data_"+ today.toJSON() + '.json');
  }

  const sendToChap = async () => {

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


  return (
    <div className={styles.container}>
      <h1>{i18n.t('Select training data')}</h1>

      <SelectModel selectedModel={selectedModel} setSelectedModel={onSelectModel}/>
      <ModelFeatures features={selectedModel?.features} setModelSpesificSelectedDataElements={setModelSpesificSelectedDataElements} modelSpesificSelectedDataElements={modelSpesificSelectedDataElements} />

      {selectedModel?.features.length === modelSpesificSelectedDataElements?.size &&
      <>
        <SwitchClimateSources/>
        <OrgUnits orgUnits={orgUnits} setOrgUnits={setOrgUnits} />
        {!orgUnitsSelectedIsValid() && (
          <p className={styles.error}>
            Only select organization units that are one the same level.
          </p>
        )}
        <OrgUnitLevel orgUnitLevels={orgUnitLevel} onChange={setOrgUnitLevel} />


        <div className={styles.container}>
          <h2>{i18n.t('Period')}</h2>

          <div className={styles.pickers}>
            <PeriodDimension
              
              selectedPeriods={selectedPeriodItems}
              onSelect={handleSelectedPeriod}
              excludedPeriodTypes={[]}
            />
          </div>
        </div>

        <div className={styles.buttons}>
          <Button
            icon={<IconDownload24 />}
            loading={startDownload.startDownlaod}
            disabled={
              !isValid ||
              (startDownload.startDownlaod && startDownload.action === "download") ||
              !orgUnitsSelectedIsValid()
            }
            onClick={() =>onClickDownloadOrPostData("download")}
          >
            Download data
          </Button>
          <Button
            icon={<IconArrowRight24 />}
            primary
            loading={sendingDataToChap}
            disabled={!isValid || (startDownload.startDownlaod && startDownload.action === "post") || !orgUnitsSelectedIsValid()}
            onClick={() =>onClickDownloadOrPostData("post")}
          >
            Send data to CHAP
          </Button>
        </div>
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
