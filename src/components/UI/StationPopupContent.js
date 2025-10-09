import React, { useState, useCallback } from "react";
import { Spinner } from "react-bootstrap";
import { stationService } from "../../services";

export const StationPopupContent = ({ station, onHistogramClick, histogramData, StationChart }) => {
  const [showChart, setShowChart] = useState(false);
  const [chartLoading, setChartLoading] = useState(false);
  const [previewData, setPreviewData] = useState(null);

  const handleShowChart = useCallback(async () => {
    if (!showChart) {
      // If we don't have histogram data for this station yet, fetch it on demand
      if (!histogramData || histogramData.length === 0) {
        setChartLoading(true);
        try {
          const data = await stationService.getStationHistogram({ selectedStationId: station.id });
          setPreviewData(data);
          setShowChart(true);
        } catch (err) {
          console.error("Erro ao buscar preview do histograma:", err);
        } finally {
          setChartLoading(false);
        }
      } else {
        setShowChart(true);
      }
    } else {
      setShowChart(false);
    }
  }, [showChart, histogramData, station.id]);

  return (
    <div style={{ minWidth: "320px" }}>
      {/* Header */}
      <div className="d-flex align-items-center mb-3 pb-2 border-bottom">
        <div className="me-3">
          <div 
            className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
            style={{ width: "40px", height: "40px" }}
          >
            <i className="fas fa-bicycle"></i>
          </div>
        </div>
        <div>
          <h6 className="mb-1 fw-bold text-primary">{station.name}</h6>
          <small className="text-muted">
            <i className="fas fa-map-marker-alt me-1"></i>
            ID: {station.id}
          </small>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-3">
        <div className="d-grid gap-2">
          <button
            className="btn btn-primary btn-sm"
            onClick={() => onHistogramClick(station)}
            style={{ 
              background: "linear-gradient(45deg, #007bff, #0056b3)",
              border: "none"
            }}
          >
            <i className="fas fa-chart-bar me-2"></i>
            Ver Análise Completa
          </button>
          
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={handleShowChart}
          >
            <i className={`fas ${showChart ? 'fa-eye-slash' : 'fa-eye'} me-2`}></i>
            {showChart ? 'Ocultar' : 'Mostrar'} Prévia
          </button>
        </div>
      </div>

      {/* Chart Preview */}
  {((previewData && previewData.length > 0) || (histogramData && histogramData.length > 0)) && (showChart || chartLoading) && (
        <div>
          <div className="d-flex align-items-center mb-2">
            <small className="text-muted fw-bold">
              <i className="fas fa-chart-line me-1"></i>
              Prévia dos Dados
            </small>
          </div>
          
            {chartLoading ? (
            <div 
              className="border rounded p-2 d-flex align-items-center justify-content-center"
              style={{ 
                width: "300px", 
                height: "180px", 
                backgroundColor: "#f8f9fa"
              }}
            >
              <div className="text-center">
                <Spinner animation="border" size="sm" className="mb-2" />
                <div>
                  <small className="text-muted">Carregando gráfico...</small>
                </div>
              </div>
            </div>
            ) : (
            <div 
              className="border rounded p-2"
              style={{ 
                width: "300px", 
                height: "180px", 
                backgroundColor: "#f8f9fa"
              }}
            >
              <StationChart 
                stationId={station.id} 
                histogramData={previewData && previewData.length > 0 ? previewData : histogramData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  animation: {
                    duration: 800,
                    easing: 'easeInOutQuart'
                  },
                  plugins: { 
                    legend: { 
                      position: "top",
                      labels: {
                        boxWidth: 12,
                        font: {
                          size: 10
                        }
                      }
                    }, 
                    title: { display: false }
                  },
                  scales: {
                    x: {
                      ticks: {
                        font: {
                          size: 9
                        },
                        maxTicksLimit: 12
                      }
                    },
                    y: {
                      ticks: {
                        font: {
                          size: 9
                        },
                        maxTicksLimit: 6
                      }
                    }
                  },
                  elements: {
                    bar: {
                      borderRadius: 2
                    }
                  }
                }}
              />
            </div>
          )}
          
          {/* <div className="mt-2">
            <small className="text-muted">
              <i className="fas fa-info-circle me-1"></i>
              Clique em "Ver Análise Completa" para detalhes
            </small>
          </div> */}
        </div>
      )}

      {/* No data message */}
      {(!previewData || previewData.length === 0) && (!histogramData || histogramData.length === 0) && (
        <div className="text-center text-muted py-3">
          <i className="fas fa-chart-bar fa-2x mb-2 opacity-50"></i>
          <div>
            <small>Dados não disponíveis</small><br />
            <small>com os filtros atuais</small>
          </div>
        </div>
      )}
    </div>
  );
};