import React, { useEffect, useState } from 'react'
import { DefaultService, EvaluationResponse } from '../../httpfunctions'
import { processDataValues } from '../chap-visual-analytics/src/lib/dataProcessing'
import styles from "./styles/EvaluationResult.module.css"
import { HighChartsData } from '../../../chap_dashboard/src/interfaces/HighChartsData'
import { ResultPlotList } from '../chap-visual-analytics/src/components/EvaluationResultDashboard'

const EvaluationResult = () => {

  const [evaluation, setEvaluation] = useState<Record<string, Record<string, HighChartsData>> | undefined>(undefined)
  const [httpError, setHttpError] = useState<string>("")
  const [splitPeriods, setSplitPeriods] = useState<string[]>([]);

  const fetchEvaluation = async () => {
    await DefaultService.getEvaluationResultsGetEvaluationResultsGet()
      .then(response => {
        const processedData = processDataValues(response.predictions, response.actualCases.data)
        setEvaluation(processedData)
        setSplitPeriods(Object.keys(processedData));
      }
      )
      .catch(    
        err => {
          setHttpError(err.toString())
        } 
      )
  }

  useEffect(() => {
    fetchEvaluation();
  }, [])
  

  return (
    <div>
      <div className={styles.fetchEvaluationError}>
            <p>{httpError}</p>
          </div>
      {evaluation && <>
        {/*<ResultPlotList orgUnitsData={evaluation[splitPeriods[0]]} />*/}
          
          </>
        }
    </div>
  )
}

export default EvaluationResult