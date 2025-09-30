import React, { useState, useEffect } from "react";
import { Modal, Button, Card, Badge, Row, Col, Form } from "react-bootstrap";
import { StationChart } from "../Charts";

export const HistogramModal = ({
  show,
  onHide,
  selectedStation,
  histogramData,
  onStationIdChange,
  filters,
  onFiltersChange,
}) => {
  const [localFilters, setLocalFilters] = useState(filters || {});

  useEffect(() => {
    setLocalFilters(filters || {});
  }, [filters]);

  const handleClose = () => {
    onHide();
    onStationIdChange(null);
  };

  const handleFilterChange = (filterType, value) => {
    const updatedFilters = { ...localFilters, [filterType]: value };
    setLocalFilters(updatedFilters);
    onFiltersChange && onFiltersChange(updatedFilters);
  };

  const resetFilters = () => {
    const defaultFilters = {
      selectedDays: [0, 1, 2, 3, 4], // Weekdays only
      excludeMonths: [],
      uspFilter: false,
      startDate: "",
      endDate: ""
    };
    setLocalFilters(defaultFilters);
    onFiltersChange && onFiltersChange(defaultFilters);
  };

  const applyBrazilianRecess = () => {
    const recessFilters = {
      ...localFilters,
      excludeMonths: [0, 6, 11], // January (0), July (6), December (11)
    };
    setLocalFilters(recessFilters);
    onFiltersChange && onFiltersChange(recessFilters);
  };

  const dayNames = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
  const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

  const getActiveFiltersDescription = () => {
    const descriptions = [];
    
    if (localFilters.selectedDays?.length > 0 && localFilters.selectedDays.length < 7) {
      const selectedDayNames = localFilters.selectedDays.map(day => dayNames[day]);
      descriptions.push(`Dias: ${selectedDayNames.join(', ')}`);
    }
    
    if (localFilters.excludeMonths?.length > 0) {
      const excludedMonthNames = localFilters.excludeMonths.map(month => monthNames[month]);
      descriptions.push(`Excluindo meses: ${excludedMonthNames.join(', ')}`);
    }
    
    if (localFilters.uspFilter) {
      descriptions.push('Apenas estações USP (242-260)');
    }
    
    if (localFilters.startDate || localFilters.endDate) {
      const dateRange = `${localFilters.startDate || 'início'} até ${localFilters.endDate || 'fim'}`;
      descriptions.push(`Período: ${dateRange}`);
    }
    
    return descriptions.length > 0 ? descriptions.join(' • ') : 'Todos os dados disponíveis';
  };

  const getTotalDataPoints = () => {
    // If histogramData is an array of hourly data, sum up the values
    if (Array.isArray(histogramData) && histogramData.length > 0) {
      if (histogramData[0].departures !== undefined) {
        return histogramData.reduce((total, hour) => total + (hour.departures || 0) + (hour.arrivals || 0), 0);
      }
      return histogramData.length;
    }
    return 0;
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
        {/* Filter Controls */}
        <Card className="mb-3 border-info">
          <Card.Header className="bg-info text-white d-flex justify-content-between align-items-center">
            <div>
              <i className="fas fa-filter me-2"></i>
              Filtros de Análise
            </div>
            <div>
              <Button 
                variant="outline-light" 
                size="sm" 
                className="me-2"
                onClick={resetFilters}
              >
                <i className="fas fa-undo me-1"></i>
                Limpar
              </Button>
              <Button 
                variant="outline-light" 
                size="sm"
                onClick={applyBrazilianRecess}
                title="Exclui Janeiro, Julho e Dezembro"
              >
                <i className="fas fa-calendar-times me-1"></i>
                Períodos Letivos
              </Button>
            </div>
          </Card.Header>
          
          <Card.Body>
            <Row className="g-3">
              {/* Days of Week Filter */}
              <Col md={6}>
                <Form.Label className="fw-bold">
                  <i className="fas fa-calendar-week me-2 text-primary"></i>
                  Dias da Semana
                </Form.Label>
                <div className="d-flex flex-wrap gap-1">
                  {dayNames.map((day, index) => (
                    <Form.Check
                      key={index}
                      type="checkbox"
                      id={`day-${index}`}
                      label={day}
                      checked={localFilters.selectedDays?.includes(index) || false}
                      onChange={(e) => {
                        const currentDays = localFilters.selectedDays || [];
                        const newDays = e.target.checked 
                          ? [...currentDays, index]
                          : currentDays.filter(d => d !== index);
                        handleFilterChange('selectedDays', newDays);
                      }}
                      className="me-2"
                    />
                  ))}
                </div>
                <Form.Text className="text-muted">
                  Selecione os dias da semana para análise
                </Form.Text>
              </Col>

              {/* Months Filter */}
              <Col md={6}>
                <Form.Label className="fw-bold">
                  <i className="fas fa-calendar-alt me-2 text-primary"></i>
                  Excluir Meses
                </Form.Label>
                <div className="d-flex flex-wrap gap-1">
                  {monthNames.map((month, index) => (
                    <Form.Check
                      key={index}
                      type="checkbox"
                      id={`month-${index}`}
                      label={month}
                      checked={localFilters.excludeMonths?.includes(index) || false}
                      onChange={(e) => {
                        const currentMonths = localFilters.excludeMonths || [];
                        const newMonths = e.target.checked 
                          ? [...currentMonths, index]
                          : currentMonths.filter(m => m !== index);
                        handleFilterChange('excludeMonths', newMonths);
                      }}
                      className="me-2"
                    />
                  ))}
                </div>
                <Form.Text className="text-muted">
                  Meses excluídos da análise (ex: férias, recessos)
                </Form.Text>
              </Col>

              {/* USP Filter */}
              {/* <Col md={6}>
                <Form.Label className="fw-bold">
                  <i className="fas fa-university me-2 text-primary"></i>
                  Filtro USP
                </Form.Label>
                <Form.Check
                  type="switch"
                  id="usp-filter"
                  label="Apenas estações USP (IDs 242-260)"
                  checked={localFilters.uspFilter || false}
                  onChange={(e) => handleFilterChange('uspFilter', e.target.checked)}
                />
              </Col> */}

              {/* Date Range */}
              <Col md={6}>
                <Form.Label className="fw-bold">
                  <i className="fas fa-calendar-day me-2 text-primary"></i>
                  Período
                </Form.Label>
                <Row>
                  <Col>
                    <Form.Control
                      type="date"
                      size="sm"
                      value={localFilters.startDate || ""}
                      onChange={(e) => handleFilterChange('startDate', e.target.value)}
                      placeholder="Data início"
                    />
                  </Col>
                  <Col>
                    <Form.Control
                      type="date"
                      size="sm"
                      value={localFilters.endDate || ""}
                      onChange={(e) => handleFilterChange('endDate', e.target.value)}
                      placeholder="Data fim"
                    />
                  </Col>
                </Row>
              </Col>
            </Row>

            {/* Active Filters Display */}
            <Row className="mt-3">
              <Col>
                <Card className="bg-light border-0">
                  <Card.Body className="py-2">
                    <small className="text-muted">
                      <i className="fas fa-info-circle me-2"></i>
                      <strong>Filtros aplicados:</strong> {getActiveFiltersDescription()}
                    </small>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Card.Body>
        </Card>
        
        {/* Chart Section */}
        {selectedStation && histogramData.length > 0 ? (
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-light">
              <Row>
                <Col>
                  <h5 className="mb-0">
                    <i className="fas fa-clock me-2 text-primary"></i>
                    Histograma de Utilização por Hora
                  </h5>
                  <small className="text-muted">
                    <i className="fas fa-database me-1"></i>
                    {getTotalDataPoints()} viagens registradas com os filtros aplicados
                  </small>
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
              <div className="mt-3">
                <small className="text-muted">
                  <i className="fas fa-lightbulb me-1"></i>
                  Tente ajustar os filtros acima para incluir mais dados na análise.
                </small>
              </div>
            </Card.Body>
          </Card>
        )}
      </Modal.Body>
      
      <Modal.Footer className="bg-light">
        <Button variant="secondary" onClick={handleClose}>
          <i className="fas fa-times me-2"></i>
          Fechar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};