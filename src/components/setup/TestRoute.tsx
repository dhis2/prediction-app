import { Button, IconArrowRight24 } from '@dhis2/ui'
import React, { useEffect, useState } from 'react'
import { DefaultService } from '../../httpfunctions'
import { Link, useNavigate } from 'react-router-dom'
import styles from '../styles/TestRoute.module.css'

const TestRoute = () => {

    const [status, setStatus] = useState(undefined)
    const [errorMessage, setErrorMessage] = useState("")

    const [isLoading, setIsLoading] = useState(false)

    const fetchStatus = async () => {
        setErrorMessage("")
        setStatus(undefined)
        setIsLoading(true)
        await DefaultService.getStatusStatusGet().catch((error : any) => {
            setErrorMessage(error)
            setIsLoading(false)
        }).then((status : any) => {
            setStatus(status)
            setIsLoading(false)
        });
    }

    useEffect(() => {
        
        fetchStatus()
    }, [])
    

    const naviagteHome = () => {
        window.location.replace('/')
    }
       
  return (
    <div className={styles.outerContainer}>
        <div className={styles.container}>
            <h2>Test connection to CHAP</h2>

            {isLoading && <p>Loading...</p>}
            
            {status &&
            <div className={styles.status_ok}>
                <h4>Success!</h4>
                {status && <pre >{JSON.stringify(status, null, 2)}</pre>}
                <Button icon={<IconArrowRight24/>} primary color='blue' onClick={naviagteHome}>Continue to CHAP</Button>
            </div>
            }
            {errorMessage &&
                <div>
                    <p className={styles.status_not_ok}>
                        ERROR
                        <pre>{JSON.stringify(errorMessage, null, 2)}</pre>
                    </p>
                    <Button primary onClick={fetchStatus}>Retry</Button>
                </div>
            }

           


        
        </div>  
    </div>
  )
}

export default TestRoute