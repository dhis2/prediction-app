import i18n from "@dhis2/d2-i18n";
import Highcharts from "highcharts";
import accessibility from "highcharts/modules/accessibility";
import highchartsMore from "highcharts/highcharts-more";
import exporting from "highcharts/modules/exporting";
import styles from "./styles/PredictionChart.module.css";
import React from "react";
import { useRef, useLayoutEffect } from 'react';

accessibility(Highcharts);
exporting(Highcharts);
highchartsMore(Highcharts);

const getChart = (data : any, period : string) : Highcharts.Options => {
  console.log(data);

  const toCelcius = (e : any) => {
    console.log(e);
    return e;
  }

  const getDailyPeriod = (data : any) => {
    return "The periode of the data"
  }

  const series = data.filter((d : any) => d.dataElement == "median").map((d : any) => ([
    d.displayName,//new Date(d.id).getTime(),
    d.value//toCelcius(d["temperature_2m"]),
  ]));

  const minMax = data.filter((d : any) => d.dataElement == "quantile_low").map((d : any) => [
    //d.orgUnit,//new Date(d.id).getTime(),
    d.value,
    //get the corresponding max value
    data.filter((o : any) => o.dataElement === "quantile_high" && o.orgUnit === d.orgUnit)[0].value
  ]);

  return {
    title: {
      text: i18n.t(` for periode ${period}`, {
        name,
        period: getDailyPeriod(data),
        nsSeparator: ";",
      }),
    },
    tooltip: {
      //crosshairs: true,
      shared: true,
      valueSuffix: "°C",
    },
    xAxis: {
      //categories : data.map((d : any) => d.displayName),
      type: "category"
      
    },
    yAxis: {
      
      //title: false,
    },
    chart: {
      height: 480,
      marginBottom: 75,
      //zoomType: "x",
    },
    plotOptions: {
      series: {
        //animation,
      },
    },
    series: [
      {
        type: "bar",
        //data : [["2024W14", 4], ["eokver", 6]],
        data: series,
        name: i18n.t("Predicted cases"),
        
        //color: colors.red800,
        //negativeColor: colors.blue800,
        //lineWidth: 1.5,
        zIndex: 0,
      },
      {
        type: "errorbar",
        name: i18n.t("Predication range"),
        data: minMax,
        //color: colors.red200,
        //negativeColor: colors.blue200,

        zIndex: 1,
      },
    ],
  };
};

const PredictionChart = ({ data } : any) => {

  const periode = data.dataValues[0].period || "";

  const config = getChart(data.dataValues, periode);

  const chartRef = useRef();

  useLayoutEffect(() => {
    Highcharts.chart(chartRef.current as any, config as any);
  }, [config, chartRef]);

  return <div ref={chartRef as any} />;
};

export default PredictionChart;
