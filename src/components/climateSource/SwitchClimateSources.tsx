import { Switch } from '@dhis2/ui'
import React from 'react'
import styles from "../styles/SwitchClimateSources.module.css"

const SwitchClimateSources = () => {
  return (
    <div className={styles.switchWrapper}>
      <div>
        <div>Use ERA5-Land as Climate Data Source</div>
        {<div className={styles.smallText}>No other data sources is currently supported by CHAP.</div>}
      </div>
      <div>
        <Switch valid checked={true}/>
      </div>
      
    </div>
  )
}

export default SwitchClimateSources