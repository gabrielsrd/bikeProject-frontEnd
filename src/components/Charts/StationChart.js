import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { CHART_COLORS } from "../../constants";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const StationChart = ({ stationId, histogramData, calculationMode = 'mean', options = {} }) => {
  const getStationHistogramChart = (stationId) => {
    // New compact format: histogramData is a list of objects like:
    // { station_id, station, departures: [24], arrivals: [24] }
    // If provided, use them directly. Otherwise, keep the legacy per-record
    // aggregation which returns rows with station_id/day/hour/departures/arrivals.
    const aggregated = histogramData.find((d) => d.station_id === stationId && Array.isArray(d.departures));

    const labels = [];
    const departures = [];
    const arrivals = [];

    if (aggregated) {
      for (let hour = 0; hour < 24; hour++) {
        labels.push(hour);
        const depVal = aggregated.departures[hour] || 0;
        const arrVal = aggregated.arrivals[hour] || 0;
        if (calculationMode === 'total') {
          departures.push(depVal);
          arrivals.push(arrVal);
        } else {
          // aggregated already contains averages per day (backend returns averages)
          departures.push(depVal);
          arrivals.push(arrVal);
        }
      }
    } else {
      // Legacy fallback: build hourly aggregation from per-row records
      const stationData = histogramData.filter((data) => data.station_id === stationId);
      const hourlyData = {};

      stationData.forEach((data) => {
        const hour = data.hour;
        if (hour == null) return;
        if (!hourlyData[hour]) {
          hourlyData[hour] = { departures: 0, arrivals: 0, count: 0 };
        }
        hourlyData[hour].departures += data.departures || 0;
        hourlyData[hour].arrivals += data.arrivals || 0;
        hourlyData[hour].count += 1;
      });

      for (let hour = 0; hour < 24; hour++) {
        labels.push(hour);
        if (hourlyData[hour]) {
          if (calculationMode === 'total') {
            departures.push(hourlyData[hour].departures);
            arrivals.push(hourlyData[hour].arrivals);
          } else {
            departures.push(hourlyData[hour].departures / hourlyData[hour].count);
            arrivals.push(hourlyData[hour].arrivals / hourlyData[hour].count);
          }
        } else {
          departures.push(0);
          arrivals.push(0);
        }
      }
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
      title: { 
        display: true, 
        text: calculationMode === 'total' 
          ? "Total de Partidas e Chegadas por Hora"
          : "Média de Partidas e Chegadas por Hora"
      },
    },
    scales: {
      x: { title: { display: true, text: "Hora do Dia" } },
      y: { 
        title: { 
          display: true, 
          text: calculationMode === 'total' 
            ? "Número Total de Viagens" 
            : "Número Médio de Viagens"
        } 
      },
    },
  };

  const mergedOptions = { ...defaultOptions, ...options };

  return <Bar data={chartData} options={mergedOptions} />;
};