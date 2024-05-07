import React, { useState } from 'react'
import styles from './styles/SetupInstruction.module.css'
import { Button, IconAdd24, Modal, ModalContent } from "@dhis2/ui";
import { useConfig } from '@dhis2/app-runtime';
import i18n from "@dhis2/d2-i18n";
import ModalInstruction from './ModalInstruction';


interface SetupInstructionProps {
  disease: string
  warning: boolean
}



const SetupInstruction = ({ disease, warning }: SetupInstructionProps) => {

  
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <div className={warning ? styles.wrapperWarning : styles.wrapper}>
        <div className={styles.textWarning}>
          {warning && 
          <> 
            <p>
              It seems like you missing CHAP predication Data Elements for "{disease}".
            </p>
          </>}
        </div>
        <div>
          <Button icon={<IconAdd24 />} onClick={() => setIsModalOpen(true)}>Add data elements</Button>
        </div>
      </div>
      <ModalInstruction modalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} disease={disease}/>
    </>
  )
}

export default SetupInstruction