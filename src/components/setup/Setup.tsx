import React from 'react'
import { InputField, Button, IconSave24} from '@dhis2/ui'
import styles  from '../styles/Setup.module.css'

const Setup = () => {

  const routeDocUrl = "https://docs.dhis2.org/en/develop/using-the-api/dhis-core-version-240/route.html"


  return (
    <div className={styles.outerContainer}>
      <div className={styles.container}>
        <h2>Setup CHAP</h2>
        <p>CHAP requires that you set up a <a about='_blank' href={routeDocUrl}>route</a> in DHIS2
         to enable communication with the CHAP server. 
          This could be changed later.</p>
        <InputField placeholder='http://127.0.0.1:8000' label='URL'/>
        <div className={styles.sendButton}>
          <Button icon={<IconSave24/>} primary>Save</Button>
        </div>
        
      </div>
    </div>
    
  )
}

export default Setup