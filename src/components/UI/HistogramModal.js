import React from "react";
import { Modal, Button, Card, Badge, Row, Col } from "react-bootstrap";
import { StationChart } from "../Charts";

export const HistogramModal = ({
  show,
  onHide,
  selectedStation,
  histogramData,
  onStationIdChange,
}) => {
  const handleClose = () => {
    onHide();
    onStationIdChange(null);
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      size="xl"
      centered
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton className="bg-primary text-white">
        <Modal.Title>
          <i className="fas fa-chart-bar me-2"></i>
          Análise Detalhada - {selectedStation?.name}
          <Badge bg="light" text="dark" className="ms-2">
            ID: {selectedStation?.id}
          </Badge>
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body className="p-4">
        {selectedStation && histogramData.length > 0 ? (
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-light">
              <Row>
                <Col>
                  <h5 className="mb-0">
                    <i className="fas fa-clock me-2 text-primary"></i>
                    Histograma de Utilização por Hora
                  </h5>
                </Col>
                <Col xs="auto">
                  <Badge bg="success" className="me-2">
                    <i className="fas fa-arrow-up me-1"></i>
                    Partidas
                  </Badge>
                  <Badge bg="danger">
                    <i className="fas fa-arrow-down me-1"></i>
                    Chegadas
                  </Badge>
                </Col>
              </Row>
            </Card.Header>
            
            <Card.Body>
              <div style={{ width: "100%", height: "450px" }}>
                <StationChart 
                  stationId={selectedStation.id} 
                  histogramData={histogramData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { 
                        position: "top",
                        labels: {
                          usePointStyle: true,
                          padding: 20
                        }
                      },
                      title: { 
                        display: true, 
                        text: "Média de Partidas e Chegadas por Hora do Dia",
                        font: {
                          size: 16,
                          weight: 'bold'
                        },
                        padding: {
                          top: 10,
                          bottom: 30
                        }
                      },
                      tooltip: {
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        cornerRadius: 6,
                        callbacks: {
                          title: function(context) {
                            return `Hora: ${context[0].label}:00`;
                          },
                          label: function(context) {
                            return `${context.dataset.label}: ${context.parsed.y.toFixed(1)} viagens`;
                          }
                        }
                      }
                    },
                    scales: {
                      x: { 
                        title: { 
                          display: true, 
                          text: "Hora do Dia (0-23)",
                          font: {
                            size: 14,
                            weight: 'bold'
                          }
                        },
                        grid: {
                          color: 'rgba(0,0,0,0.1)'
                        }
                      },
                      y: { 
                        title: { 
                          display: true, 
                          text: "Número Médio de Viagens",
                          font: {
                            size: 14,
                            weight: 'bold'
                          }
                        },
                        beginAtZero: true,
                        grid: {
                          color: 'rgba(0,0,0,0.1)'
                        }
                      },
                    },
                    interaction: {
                      intersect: false,
                      mode: 'index'
                    }
                  }}
                />
              </div>
            </Card.Body>
            
            <Card.Footer className="bg-light text-muted">
              <Row>
                <Col>
                  <small>
                    <i className="fas fa-info-circle me-1"></i>
                    Os dados representam a média de viagens por hora com base nos filtros aplicados.
                  </small>
                </Col>
                <Col xs="auto">
                  <small>
                    <i className="fas fa-map-marker-alt me-1"></i>
                    Estação: {selectedStation?.name}
                  </small>
                </Col>
              </Row>
            </Card.Footer>
          </Card>
        ) : (
          <Card className="border-0 text-center py-5">
            <Card.Body>
              <i className="fas fa-chart-bar fa-3x text-muted mb-3"></i>
              <h5 className="text-muted">Dados não disponíveis</h5>
              <p className="text-muted">
                Não há dados de histograma disponíveis para esta estação com os filtros atuais.
              </p>
            </Card.Body>
          </Card>
        )}
      </Modal.Body>
      
      <Modal.Footer className="bg-light">
        <Button variant="secondary" onClick={handleClose}>
          <i className="fas fa-times me-2"></i>
          Fechar
        </Button>
        {/* <Button variant="primary" onClick={() => window.print()} disabled={!selectedStation || histogramData.length === 0}>
          <i className="fas fa-print me-2"></i>
          Imprimir
        </Button> */}
      </Modal.Footer>
    </Modal>
  );
};