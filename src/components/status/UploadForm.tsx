import React, { useState } from 'react'
import { SendForm } from './SendForm'
import { error } from 'console'
import { Button, FileInput, IconArrowRight24 } from "@dhis2/ui";
import styles from '../styles/UploadForm.module.css'

interface UploadFormProps { 
  isReady : boolean
  setUpload : (e : boolean) => void
  upload : boolean
}

const UploadForm = ({isReady, setUpload ,upload} : UploadFormProps) => {
  //const [file, setFile] = useState<any>(null)
  const [file, setFile] = useState<any>(undefined)
  const [errorMessage, setErrorMessage] = useState<string>("")
  
  const handleFileSelect = (event : any) => {
    console.log(event)
    setFile(event.files[0])
  }

  const handleUpload = async () => {
    setUpload(true)
  }

  return (
    <div>
      <div className={styles.container}>   
        <div>
          <FileInput buttonLabel='Upload file (.zip)' disabled={!isReady} onChange={handleFileSelect}/>
          <div className={styles.selectedFile}><i>{file?.name}</i></div>
        </div>
        <div>
          <Button icon={<IconArrowRight24/>} disabled={file == undefined || !isReady} onClick={() => handleUpload()}>Send to CHAP</Button>          
        </div>
      
      </div>
      {upload && file && <SendForm formData={{file : file} as any} setErrorMessage={setErrorMessage} setUpload={setUpload}/>}
      <p className={styles.error}>{errorMessage}</p>
      
    </div>
  )
}

export default UploadForm