import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { CHART_COLORS } from "../../constants";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const StationChart = ({ stationId, histogramData, options = {} }) => {
  const getStationHistogramChart = (stationId) => {
    const stationData = histogramData.filter((data) => data.station_id === stationId);
    const hourlyData = {};

    stationData.forEach((data) => {
      const hour = data.hour;
      if (!hourlyData[hour]) {
        hourlyData[hour] = { departures: 0, arrivals: 0, count: 0 };
      }
      hourlyData[hour].departures += data.departures;
      hourlyData[hour].arrivals += data.arrivals;
      hourlyData[hour].count += 1;
    });

    const labels = [];
    const departures = [];
    const arrivals = [];
    for (let hour = 0; hour < 24; hour++) {
      labels.push(hour);
      departures.push(hourlyData[hour] ? hourlyData[hour].departures / hourlyData[hour].count : 0);
      arrivals.push(hourlyData[hour] ? hourlyData[hour].arrivals / hourlyData[hour].count : 0);
    }

    return {
      labels,
      datasets: [
        { label: "Partidas", data: departures, backgroundColor: CHART_COLORS.DEPARTURES },
        { label: "Chegadas", data: arrivals, backgroundColor: CHART_COLORS.ARRIVALS },
      ],
    };
  };

  const chartData = getStationHistogramChart(stationId);

  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Média de Partidas e Chegadas por Hora" },
    },
    scales: {
      x: { title: { display: true, text: "Hora do Dia" } },
      y: { title: { display: true, text: "Quantidade" } },
    },
  };

  const mergedOptions = { ...defaultOptions, ...options };

  return <Bar data={chartData} options={mergedOptions} />;
};