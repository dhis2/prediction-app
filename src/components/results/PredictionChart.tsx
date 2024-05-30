import i18n from "@dhis2/d2-i18n";
import Highcharts from "highcharts";
import accessibility from "highcharts/modules/accessibility";
import highchartsMore from "highcharts/highcharts-more";
import exporting from "highcharts/modules/exporting";
import React, { useState } from "react";
import HighchartsReact from 'highcharts-react-official';
import styles from '../styles/PredictionChart.module.css'
import {Menu, MenuItem} from '@dhis2/ui'
  
accessibility(Highcharts);
exporting(Highcharts);
highchartsMore(Highcharts);



const getChartOptions = (data : any, period : string, predictionTargetName : string) : Highcharts.Options => {

  const colors : string[] = Highcharts.getOptions().colors as string[];

  const median = data.filter((d : any) => d.dataElement === "median").map((d : any) => ([
    d.periode,
    d.value
  ]));

  const quantile_high = data.filter((d : any) => d.dataElement === "quantile_high").map((d : any) => ([
    d.periode,
    d.value,
    data.filter((x : any) => x.dataElement === "median" && x.period === d.period)[0].value
  ]));

  const quantile_low = data.filter((d : any) => d.dataElement === "quantile_low").map((d : any) => ([
    d.periode,
    data.filter((x : any) => x.dataElement === "median" && x.period === d.period)[0].value,
    d.value,
  ]));


  return {
    title: {
      text: i18n.t(`Prediction for ${predictionTargetName} for periode ${period}`),
    },
    tooltip: {
      shared: true
    },
    xAxis: {
      type: "category"
    },
    credits: {
      text : "CHAP"
    },
    chart: {
      height: 490,
      marginBottom: 125,
    },
    plotOptions: {
      series:{
        lineWidth: 5
    }
    },
    series: [
      //median
      {
        type: "line",
        data: median,
        name: i18n.t("Quantile median"),
        zIndex: 2,   
      },
      //high
      {
        type: "arearange",   
        name: i18n.t("Quantile high"),
        data: quantile_high,
        zIndex: 1,
        lineWidth: 0,
        color : colors[7],
        fillOpacity: 0.4,
      },
      //low
      {
        type: "arearange",   
        name: i18n.t("Quantile low"),
        data: quantile_low,
        zIndex: 1,
        lineWidth: 0,
        color : colors[7],
        fillOpacity: 0.4,
      }
    ],
  };
};

interface PredicationChartProps {
  data : any
  predictionTargetName : string
  periode : string
}

function groupByOrgUnit(data : any) {
  const orgUnits = [...new Set(data.map((item : any) => item.orgUnit))];
  return orgUnits.map(orgUnit => data.filter((item : any) => item.orgUnit === orgUnit));
}

const PredictionChart = ({ data, predictionTargetName, periode } : PredicationChartProps) => {

  const matrix = groupByOrgUnit(data.dataValues);

  const [options, setOptions] = useState<Highcharts.Options | undefined>(getChartOptions(matrix[0], periode, predictionTargetName))

  

  const onSelectOrgUnit = (index : number) => { 
    setOptions(getChartOptions(matrix[index], periode, predictionTargetName))
  }

  
  return (

    <>
      <div className={styles.chartContainer}>
        <div className={styles.menu}>
          <Menu dense>
            {matrix.map((orgUnitData : any, index : number) => (
              <MenuItem key={index} label={orgUnitData[0].orgUnit} onClick={() => onSelectOrgUnit(index)}/>
            ))}
          </Menu>
        </div>
        
      
        <HighchartsReact
          highcharts={Highcharts}
          constructorType={'chart'}
          options={options}
        />
      </div>
    </>
  );

};

export default PredictionChart;