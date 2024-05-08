import i18n from "@dhis2/d2-i18n";
import Highcharts from "highcharts";
import accessibility from "highcharts/modules/accessibility";
import highchartsMore from "highcharts/highcharts-more";
import exporting from "highcharts/modules/exporting";
import React from "react";
import HighchartsReact from 'highcharts-react-official';
  
accessibility(Highcharts);
exporting(Highcharts);
highchartsMore(Highcharts);

const getChartOptions = (data : any, period : string, predictionTargetName : string) : Highcharts.Options => {

  const series = data.filter((d : any) => d.dataElement === "median").map((d : any) => ([
    d.displayName,
    d.value
  ]));

  const minMax = data.filter((d : any) => d.dataElement === "quantile_low").map((d : any) => [
    d.value,
    data.filter((o : any) => o.dataElement === "quantile_high" && o.orgUnit === d.orgUnit)[0].value
  ]);

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
    chart: {
      height: 490,
      marginBottom: 125,
    },
    series: [
      {
        type: "bar",
        data: series,
        name: i18n.t("Predicted cases"),
        zIndex: 0,
      },
      {
        type: "errorbar",   
        name: i18n.t("Predication range"),
        data: minMax,
        zIndex: 1,
      },
    ],
  };
};

interface PredicationChartProps {
  data : any
  predictionTargetName : string
  periode : string
}

const PredictionChart = ({ data, predictionTargetName, periode } : PredicationChartProps) => {
  const options = getChartOptions(data.dataValues, periode, predictionTargetName);

  return <HighchartsReact
      highcharts={Highcharts}
      constructorType={'chart'}
      options={options}
    />
};

export default PredictionChart;