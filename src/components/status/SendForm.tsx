import React, { useEffect } from 'react'
import { Body_post_zip_file_zip_file__post, DefaultService, RequestV1 } from '../../httpfunctions';
import styles from '../styles/SendForm.module.css';

interface SendFormProps {
    request : RequestV1
    setErrorMessage : (message : string) => void
    setUpload : (uploaded : boolean) => void
}


export const SendForm = ({request, setErrorMessage, setUpload} : SendFormProps) => {


  const sendFile = async () => {
    
    setErrorMessage("")
    await DefaultService.predictFromJsonPredictFromJsonPost(request).catch((error : any) => {
      setErrorMessage(error?.body?.detail)
      setUpload(false) 
    }).then(() => {
      setUpload(false) 
    });
  }

  useEffect(() => {
    sendFile()
  }, [])
  
    
  return (
    <div className={styles.loading}>
     <>Loading..</>
    </div>
  )
}
