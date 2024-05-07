import React from 'react'
import { Button, IconInfo24, Modal, ModalContent } from "@dhis2/ui";
import i18n from "@dhis2/d2-i18n";
import { useConfig } from '@dhis2/app-runtime';
import styles from './styles/ModalInstruction.module.css'

interface ModalInstructionProps {
  modalOpen : boolean
  setIsModalOpen : (open : boolean) => void,
  disease: string
}

const ModalInstruction = ({setIsModalOpen, modalOpen, disease} : ModalInstructionProps) => {
  const config = useConfig()

  return (modalOpen && <Modal large onClose={() => setIsModalOpen(false)}>
      <ModalContent>

      <h2>Add required Data Elements</h2>

      <p>
          This app needs spesific DHIS2 Data Elements to import data into. If you have not alredy added them, go to
          the <a target='_blank' href={`${config.baseUrl}/dhis-web-maintenance/index.html#/list/dataElementSection/dataElement`}>
          Maintanace</a> and create the Data Elements listed below.
      </p>

      <div className={styles.dataValueTables}>
          <DataValueTable q={'Low'} disease={disease} />
          <DataValueTable q={'Median'} disease={disease} />
          <DataValueTable q={'High'} disease={disease} />
      </div>
      </ModalContent>
  </Modal>);
}

export default ModalInstruction;
  
interface DataValueTableProps {
  disease: string
  q: "Low" | "Median" | "High"
}

const DataValueTable = ({ q, disease }: DataValueTableProps) => {
  return (
    <table>
      <tbody>
        <tr>
          <th>{i18n.t("Name")}</th>
          <td>CHAP{i18n.t(` ${disease} Quantile ${q}`)}</td>
        </tr>
        <tr>
          <th>{i18n.t("Short name")}</th>
          <td>CHAP{i18n.t(` ${disease} Quantile ${q}`)}</td>
        </tr>
        <tr>
          <th>{i18n.t("Code")}</th>
          <td>{`CHAP_${q.toUpperCase()}_${disease.toLocaleUpperCase()}`}</td>
        </tr>
        <tr>
          <th>{i18n.t("Domain type")}</th>
          <td>{i18n.t("Aggregate")}</td>
        </tr>
        <tr>
          <th>{i18n.t("Aggregation type")}</th>
          <td>{i18n.t("Sum")}</td>
        </tr>
        <tr>
          <th>{i18n.t("Aggregation levels")}</th>
          <td>
            <em>{i18n.t("Assign all org unit levels")}</em>
          </td>
        </tr>
      </tbody>
    </table>
  )
}

  