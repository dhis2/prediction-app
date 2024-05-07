import React, { useEffect, useState } from 'react'
import { Button, IconArrowRight24 } from "@dhis2/ui";
import styles from "./styles/PostResult.module.css";
import { useDataMutation } from '@dhis2/app-runtime'

interface PostResultProps {
  prediction : any,
  lowDataValueId : string
  medianDataValueId : string
  highDataValueId : string
}




const PostResult = ({prediction, lowDataValueId, medianDataValueId, highDataValueId} : PostResultProps) => {

  //const [body, setBody] = useState<any>(createBodyRequest(prediction));

  const mapQuantiesToDataElement = (quantile : string) : string => {
    let retrunValue = "";
    if(quantile === "quantile_low") retrunValue = lowDataValueId;
    if(quantile === "median") retrunValue = medianDataValueId;
    if(quantile === "quantile_high") retrunValue = highDataValueId;
    return retrunValue

  }

  const createBodyRequest = (prediction : any) => {
    const dataValues = prediction.dataValues.map((d : any) => {
      const de = mapQuantiesToDataElement(d.dataElement);
      console.log(de);
      return {
        dataElement: "de",
        period: d.period,
        orgUnit: d.orgUnit,
        value: d.value
      };
    });
    console.log(dataValues);
    return dataValues;
  }
  
  const myMutation = (data : any) => {
    return {
      resource: 'dataValueSets',
      type: 'create',
      data: {
        "dataValues" : data
      }   
    }
  }

  const [mutate, { loading }] = useDataMutation(myMutation(createBodyRequest(prediction)))

  const sendPrediction = async () => {

    await mutate();


  }
  

  return (
    <>  
 
    <div className={styles.footer}>
        <Button onClick={() => sendPrediction()} disabled={loading} loading={loading} icon={<IconArrowRight24/>} primary>Send prediction</Button>
    </div>

    </>
  )
}

export default PostResult