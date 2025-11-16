import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// grafico de efeito mare - saldo de partidas - chegadas por hora
// verde = mais saidas, vermelho = mais entradas
export const TideEffectChart = ({ tideData, options }) => {
  if (!tideData || !tideData.data || tideData.data.length === 0) {
    return (
      <div className="text-center text-muted py-5">
        <i className="fas fa-water fa-2x mb-3"></i>
        <p>Sem dados disponíveis para visualizar o efeito maré</p>
      </div>
    );
  }

  const hours = tideData.data.map(d => d.hour);
  const balances = tideData.data.map(d => d.balance);
  
  // Cor baseada no saldo: verde para positivo, vermelho para negativo
  const backgroundColors = balances.map(balance => 
    balance > 0 ? 'rgba(6, 167, 125, 0.7)' : 'rgba(230, 57, 70, 0.7)'
  );
  
  const borderColors = balances.map(balance => 
    balance > 0 ? 'rgba(6, 167, 125, 1)' : 'rgba(230, 57, 70, 1)'
  );

  const chartData = {
    labels: hours.map(h => `${h}h`),
    datasets: [
      {
        label: 'Saldo (Partidas - Chegadas)',
        data: balances,
        backgroundColor: backgroundColors,
        borderColor: borderColors,
        borderWidth: 2,
      },
    ],
  };

  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            weight: 'bold'
          }
        }
      },
      title: {
        display: true,
        text: `Efeito Maré - ${tideData.station_name}`,
        font: {
          size: 16,
          weight: 'bold'
        },
        padding: {
          top: 10,
          bottom: 20
        }
      },
      subtitle: {
        display: true,
        text: 'Verde: entrada no campus | Vermelho: saída do campus',
        font: {
          size: 11,
          style: 'italic'
        },
        padding: {
          bottom: 15
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        cornerRadius: 6,
        callbacks: {
          title: function(context) {
            return `Hora: ${context[0].label}`;
          },
          label: function(context) {
            const value = context.parsed.y;
            const absValue = Math.abs(value);
            const data = tideData.data[context.dataIndex];
            
           
            
            return [
              `Saldo: ${value >= 0 ? '+' : ''}${value}`,
              `Partidas: ${data.departures}`,
              `Chegadas: ${data.arrivals}`
            ];
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Hora do Dia',
          font: {
            size: 14,
            weight: 'bold'
          }
        },
        grid: {
          display: false
        }
      },
      y: {
        title: {
          display: true,
          text: 'Saldo de Viagens (Partidas - Chegadas)',
          font: {
            size: 14,
            weight: 'bold'
          }
        },
        grid: {
          color: 'rgba(0,0,0,0.1)'
        },
        // Linha zero destacada
        ticks: {
          callback: function(value) {
            return value >= 0 ? '+' + value : value;
          }
        }
      }
    },
    // Linha horizontal no zero
    annotation: {
      annotations: {
        line1: {
          type: 'line',
          yMin: 0,
          yMax: 0,
          borderColor: 'rgb(0, 0, 0)',
          borderWidth: 2,
        }
      }
    }
  };

  const mergedOptions = { ...defaultOptions, ...options };

  return <Bar data={chartData} options={mergedOptions} />;
};

export default TideEffectChart;
