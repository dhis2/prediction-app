import { useEffect, useState } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import useAnalyticRequest from '../../hooks/useAnalyticRequest';
import React from 'react';
import useGeoJson from '../../hooks/useGeoJson';
import styles from './styles/DownloadData.module.css';
import { RequestV1 } from '../../httpfunctions';

interface DownloadDataProps {
  period: any;
  orgUnitLevel: { id: string; level: number };
  orgUnits: any;
  modelSpesificSelectedDataElements : any
  setStartDownload: (option: {
    downloadLocal: boolean;
    startDownlaod: boolean;
  }) => void;
  setErrorMessages(errorMessages: ErrorResponse[]): void;
  startDownload: { downloadLocal: boolean; startDownlaod: boolean };
  setZipResult: (result: any) => void;
  setRequest : (r : RequestV1) => void;
}

export interface ErrorResponse {
  error: any;
  element: string;
}

const DownloadData = ({
  period,
  setStartDownload,
  startDownload,
  setZipResult,
  orgUnitLevel,
  orgUnits,
  modelSpesificSelectedDataElements,
  setRequest,
  setErrorMessages,
}: DownloadDataProps) => {
  //Concat selected orgUnits (either national, a district, chiefdom or facility) with the id of selected levels (districts, chiefdoms, facilities)
  const mergedOrgUnits =
    'LEVEL-' +
    orgUnitLevel.id +
    ';' +
    orgUnits.map((ou: any) => ou.id).join(';');

  //Convert the period selected to a DHIS2-standard list of months
  const fillPeriodesMonths = (period: any) => {
    const currentDate = new Date(period.startMonth);
    const endDate = new Date(period.endMonth);
    const months = [];
    // if not set, endData is one houre more than currentDate
    currentDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);

    while (currentDate <= endDate) {
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const formattedDate = `${year}${month}`;
      months.push(formattedDate);

      currentDate.setMonth(currentDate.getMonth() + 1);
    }
    return months;
  };

  const flatternDhis2Periods = (periods: { id: string; name: string }[]) => {
    return periods.map((period) => period.id);
  };

  const { data: population, error: populationError, loading: populationLoading} = useAnalyticRequest(modelSpesificSelectedDataElements.population.selected_data_element, flatternDhis2Periods(period), mergedOrgUnits);
  const { data: prediction, error: predictionError, loading: predictionLoading } = useAnalyticRequest(modelSpesificSelectedDataElements.diseases.selected_data_element, flatternDhis2Periods(period), mergedOrgUnits);
  const { data: geoJson, error: geoJsonError, loading: geoJsonLoading } = useGeoJson(orgUnitLevel.level);

  const objectToPrettyJson = (object: any) => {
    return JSON.stringify(object, null, 2);
  };

  //Avoid to export all the orgUnits to JSON, only inlcude those returned from one of the analytic requests (precipitation)
  const filterOrgUnits = (geoJson : any) => {
    return {
      type: 'FeatureCollection',
      features: (geoJson as any).features.filter((o: any) => {
        return population.metaData.dimensions.ou.some(
          (id: string) => id === o.id
        );
      }),
    };
  };

  const downloadZip = () => {
    const zip = new JSZip();
    //Add data to zip
    zip.file('orgUnits.geojson', objectToPrettyJson(filterOrgUnits(geoJson)));
    zip.file('population.json', objectToPrettyJson(population));
    zip.file('disease.json', objectToPrettyJson(prediction));

    zip.generateAsync({ type: 'blob' }).then((content) => {
      if (startDownload.downloadLocal) {
        saveAs(content, 'chapdata.zip');
      } else {
        setZipResult(content);
      }
    });
  };

  const convertDhis2AnlyticsToChap = (data: [[string, string, string, string]]) : any[]=> {
    return data.map((row) => {
      return {
        ou: row[1],
        pe: row[2],
        value: parseInt(row[3])
      };
    })
  }

  const fillDummyPopulation = (population : [string, string, string, string]) => {
    return population.map((row) => {
      return {
        ou: row[1],
        pe: row[2],
        value: 1000_0000
      };
    })
  }

  useEffect(() => {
    //if one of the data is still loading, return
    if (
      populationLoading ||
      predictionLoading ||
      geoJsonLoading
    )
      return;
    //All data is fetched
    if (population && prediction && geoJson) {
      setErrorMessages([]);
      downloadZip();
      setRequest({
        features : [
          {
            featureId : "population",
            dhis2Id : "evvc434",
            data : fillDummyPopulation(prediction.rows) as any,
          },
          {
            featureId : "diseases",
            dhis2Id : "Kewpwev",//population.metadata.dimensions.dx[0]
            data : convertDhis2AnlyticsToChap(prediction.rows)//,convertDhis2AnlyticsToChap(prediction.rows) as any,
           
          },
        ],
        orgUnitsGeoJson : geoJson//filterOrgUnits(geoJson),
      })
      setStartDownload({ downloadLocal: true, startDownlaod: false });
    }

    //if an error occured
    if (
      populationError ||
      predictionError ||
      geoJsonError ||
      geoJsonError
    ) {
      const errorMessages: ErrorResponse[] = [];

      populationError &&
        errorMessages.push({ error: populationError, element: 'Population' });
      predictionError &&
        errorMessages.push({ error: predictionError, element: 'Prediction' });
      geoJsonError &&
        errorMessages.push({ error: geoJsonError, element: 'OrgUnits' });
      setErrorMessages(errorMessages);
      setStartDownload({ downloadLocal: true, startDownlaod: false });
    }
  }, [
    populationLoading,
    predictionLoading,
    geoJsonLoading,
  ]);

  return <p className={styles.text}>Downloading data..</p>;
};

export default DownloadData;
