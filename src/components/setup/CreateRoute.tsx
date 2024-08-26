import React, { useState } from 'react'
import { InputField, Button, IconSave24, IconArrowRight16} from '@dhis2/ui'
import styles  from '../styles/CreateRoute.module.css'
import useCreateRoute from '../../hooks/useCreateRoute'
import TestRoute from './TestRoute'
import { useNavigate, useRoutes } from 'react-router-dom'

const Setup = () => {

  const routeDocUrl = "https://docs.dhis2.org/en/develop/using-the-api/dhis-core-version-241/route.html"
  const chapInfoUrl = "https://github.com/dhis2/chap-core"

  const [url, setUrl] = useState("http://chap:8000/v1/**")

  

  const {called, error, loading, mutate} = useCreateRoute(url);

  const save = async () => {
    await mutate()
  }

  let naviagte = useNavigate()
  const naviagteToTestRoute = () => {
    
    window.location.replace('/route/test-route')
  }

  


  return (
    <div className={styles.outerContainer}>
      <div className={styles.container}>
        <h2>Welcome to CHAP</h2>
        <p>CHAP requires that you set up a <a about='_blank' href={routeDocUrl}>route</a> in DHIS2
         to enable communication with the CHAP server. 
        </p>
        <p>
          You also needs to set up the CHAP server itself. Setup guide  
          could be found at <a about='_blank' href={chapInfoUrl}>github.com/dhis2/chap-core</a>.
        </p>
        <p>
          By clicking "Save" you create a new route in DHIS2, with name 'chap' and code 'chap'.
        </p>
       
        <InputField value={url} onChange={(e : any) => setUrl(e.value)} placeholder='http://127.0.0.1:8000' label='URL'/>
        <div className={styles.tips}>This URL does not need to be changed in most cases.</div>
        <div className={styles.sendButton}>
          <Button disabled={called && !error} onClick={save} icon={<IconSave24/>} primary>Save</Button>
        </div>


      <p>
        {loading && "Setting up route..."}
        {error && 
          <p className={styles.error}>
            ERROR
            <pre>{JSON.stringify(error, null, 2)}</pre>
          </p>
        }
        {called && !error && !loading && 
        <>
          <p className={styles.ok}>Route successfully created!</p>
          <div className={styles.sendButton}>
            
            <Button icon={<IconArrowRight16/>} onClick={naviagteToTestRoute}>Test route</Button>
          </div>
        </>
        }
      </p>
      </div>
    </div>
    
  )
}

export default Setup