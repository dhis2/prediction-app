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
import { DefaultService } from '../../httpfunctions';
import { useConfig } from '@dhis2/app-runtime';
import Period from './Periods';
import { PeriodDimension } from '@dhis2/analytics';
import useGetRoute from '../../hooks/useGetRoute';

const defaultPeriod = {
  startMonth: '2023-04',
  endMonth: '2024-03',
};

const PredictionPage = () => {
  const { loading, routeId, error } = useGetRoute();


  const navigate = useNavigate();
  if(!routeId && !loading){
    navigate('/route/create-route')
  }

  //IF NOT SUCCESSFUL STATS, SEND USER TO PAGE WHERE ROUTE IS CONFIGURED, BUT NO CONNECTION TO CHAP

  const { systemInfo = {} } = useConfig();

  const { calendar = 'gregory' } = systemInfo;

  const [predictionTarget, setPredictionTarget] =
    useState(/*{displayName: 'IDSR Malaria', id: 'vq2qO3eTrNi'}*/);
  const [populationData, setPopulationData] =
    useState(/*{"code":"DE_5808","displayName":"Total Population","id":"WUg3MYWQ7pt"}*/);
  const [period, setPeriod] = useState(defaultPeriod);
  const [orgUnits, setOrgUnits] = useState([]);
  const [orgUnitLevel, setOrgUnitLevel] = useState<{
    id: string;
    level: number;
  }>();
  const [errorChapMsg, setErrorChapMsg] = useState('');

  const [errorMessages, setErrorMessages] = useState<ErrorResponse[]>([]);
  const [sendingDataToChap, setSendingDataToChap] = useState<boolean>(false);

  const [zipResult, setZipResult] = useState<any>(undefined);
  const [selectedPeriodItems, setSelectedPeriodItems] = useState();

  const [startDownload, setStartDownload] = useState<{
    downloadLocal: boolean;
    startDownlaod: boolean;
  }>({ downloadLocal: true, startDownlaod: false });

  const isValid = Boolean(
    predictionTarget &&
      populationData &&
      selectedPeriodItems &&
      (orgUnits.length > 0 || orgUnitLevel == undefined)
  );

  const handleSelectedPeriod = (selectedPeriods : any) => {
    setSelectedPeriodItems(selectedPeriods.items);
    console.log('selectedPeriods', selectedPeriods.items);
  };

  const onClickDownloadData = () => {
    setZipResult(undefined);
    setStartDownload({ downloadLocal: true, startDownlaod: true });
  };

  const onClickSendDataToChap = () => {
    setZipResult(undefined);
    setStartDownload({ downloadLocal: false, startDownlaod: true });
    setSendingDataToChap(true);
  };

  const sendToChap = async () => {
    await DefaultService.postZipFileZipFilePost({ file: zipResult })
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

  useEffect(() => {
    if (zipResult) {
      sendToChap();
    }
  }, [zipResult]);

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
      <h1>{i18n.t('Make prediction data')}</h1>
      <DataElement
        title={i18n.t('Select model')} onChange={function (...args: any[]) {
          throw new Error('Function not implemented.');
        } }      ></DataElement>

      <DataElement
        title={i18n.t('Prediction target')}
        label={i18n.t('Select data element')}
        selected={predictionTarget}
        onChange={setPredictionTarget}
      />
      <OrgUnits orgUnits={orgUnits} setOrgUnits={setOrgUnits} />
      {!orgUnitsSelectedIsValid() && (
        <p className={styles.error}>
          Only select organization units that are one the same level.
        </p>
      )}
      <OrgUnitLevel orgUnitLevels={orgUnitLevel} onChange={setOrgUnitLevel} />
      <DataElement
        title={i18n.t('Population data')}
        label={i18n.t('Select population data element')}
        selected={populationData}
        onChange={setPopulationData}
      />

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
            startDownload.startDownlaod ||
            !orgUnitsSelectedIsValid()
          }
          onClick={onClickDownloadData}
        >
          Download data
        </Button>
        <Button
          icon={<IconArrowRight24 />}
          primary
          loading={sendingDataToChap}
          disabled={!isValid || sendingDataToChap || !orgUnitsSelectedIsValid()}
          onClick={onClickSendDataToChap}
        >
          Send data to CHAP
        </Button>
      </div>
      {<p className={styles.errorChap}>{errorChapMsg}</p>}
      {startDownload.startDownlaod && isValid && (
        <DownloadData
          setZipResult={setZipResult}
          startDownload={startDownload}
          setStartDownload={setStartDownload}
          predictionData={predictionTarget}
          populationData={populationData}
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
            {JSON.stringify(error.error, null, 2)}
          </span>
        </div>
      ))}
    </div>
  );
};

export default PredictionPage;
