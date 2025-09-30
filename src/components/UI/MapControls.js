import React, { useState } from "react";
import { Card, Form, Row, Col, Badge, Accordion, Button, Offcanvas } from "react-bootstrap";
import StableAccordion from "./StableAccordion";

export const MapControls = ({
  showStations,
  setShowStations,
  showCiclovias,
  setShowCiclovias,
  selectedDays,
  setSelectedDays,
  excludeMonths,
  setExcludeMonths,
  uspFilter,
  setUspFilter,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  daysOfWeek,
  months,
}) => {
  const [showMobileControls, setShowMobileControls] = useState(false);

  const ControlsContent = () => (
    <StableAccordion defaultActiveKey="0">
      {/* Layer Controls */}
      <Accordion.Item eventKey="0">
        <Accordion.Header>
          <i className="fas fa-layer-group me-2"></i>
          Camadas do Mapa
        </Accordion.Header>
        <Accordion.Body 
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          style={{ userSelect: 'none' }}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <Form.Check
              type="switch"
              id="switch-stations"
              label={
                <span>
                  <i className="fas fa-map-marker-alt me-2 text-success"></i>
                  Ciclostations
                  {showStations && <Badge bg="success" className="ms-2">Ativo</Badge>}
                </span>
              }
              checked={showStations}
              onChange={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowStations(e.target.checked);
              }}
              onClick={(e) => e.stopPropagation()}
              className="mb-3"
            />
            
            <Form.Check
              type="switch"
              id="switch-ciclovias"
              label={
                <span>
                  <i className="fas fa-route me-2 text-primary"></i>
                  Ciclovias
                  {showCiclovias && <Badge bg="primary" className="ms-2">Ativo</Badge>}
                </span>
              }
              checked={showCiclovias}
              onChange={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowCiclovias(e.target.checked);
              }}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </Accordion.Body>
      </Accordion.Item>

      {/* Day Filters */}
      <Accordion.Item eventKey="1">
        <Accordion.Header>
          <i className="fas fa-calendar-week me-2"></i>
          Filtrar por Dias
          {selectedDays.length > 0 && (
            <Badge bg="info" className="ms-2">{selectedDays.length} selecionados</Badge>
          )}
        </Accordion.Header>
        <Accordion.Body 
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          style={{ userSelect: 'none' }}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <Row>
              {daysOfWeek.map((day, index) => (
                <Col xs={6} key={index} className="mb-2">
                  <Form.Check
                    type="checkbox"
                    id={`day-${index}`}
                    label={day}
                    checked={selectedDays.includes(index)}
                    onChange={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedDays((prev) =>
                        prev.includes(index) ? prev.filter((d) => d !== index) : [...prev, index]
                      );
                    }}
                    onClick={(e) => e.stopPropagation()}
                  />
                </Col>
              ))}
            </Row>
          </div>
        </Accordion.Body>
      </Accordion.Item>

      {/* Month Filters */}
      <Accordion.Item eventKey="2">
        <Accordion.Header>
          <i className="fas fa-calendar-alt me-2"></i>
          Excluir Meses
          {excludeMonths.length > 0 && (
            <Badge bg="warning" className="ms-2">{excludeMonths.length} excluídos</Badge>
          )}
        </Accordion.Header>
        <Accordion.Body 
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          style={{ userSelect: 'none' }}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <Row>
              {months.map((month, index) => (
                <Col xs={4} key={index} className="mb-2">
                  <Form.Check
                    type="checkbox"
                    id={`month-${index}`}
                    label={month}
                    checked={excludeMonths.includes(index + 1)}
                    onChange={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setExcludeMonths((prev) =>
                        prev.includes(index + 1) ? prev.filter((m) => m !== (index + 1)) : [...prev, index + 1]
                      );
                    }}
                    onClick={(e) => e.stopPropagation()}
                    size="sm"
                  />
                </Col>
              ))}
            </Row>
          </div>
        </Accordion.Body>
      </Accordion.Item>

      {/* Special Filters */}
      <Accordion.Item eventKey="3">
        <Accordion.Header>
          <i className="fas fa-filter me-2"></i>
          Filtros Especiais
        </Accordion.Header>
        <Accordion.Body 
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          style={{ userSelect: 'none' }}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <Form.Check
              type="switch"
              id="switch-usp"
              label={
                <span>
                  <i className="fas fa-university me-2 text-warning"></i>
                  Estações USP (242-260)
                  {uspFilter && <Badge bg="warning" className="ms-2">Ativo</Badge>}
                </span>
              }
              checked={uspFilter}
              onChange={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setUspFilter(e.target.checked);
              }}
              onClick={(e) => e.stopPropagation()}
            />
            <div className="mt-2">
              <small className="text-muted">
                <i className="fas fa-info-circle me-1"></i>
                Filtro ativo por padrão para melhor performance
              </small>
            </div>
          </div>
        </Accordion.Body>
      </Accordion.Item>

      {/* Date Range */}
      <Accordion.Item eventKey="4">
        <Accordion.Header>
          <i className="fas fa-calendar-check me-2"></i>
          Intervalo de Datas
          {(startDate || endDate) && (
            <Badge bg="secondary" className="ms-2">Configurado</Badge>
          )}
        </Accordion.Header>
        <Accordion.Body 
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          style={{ userSelect: 'none' }}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <Form.Group className="mb-3">
              <Form.Label>
                <i className="fas fa-calendar-plus me-2"></i>
                Data Inicial
              </Form.Label>
              <Form.Control
                type="date"
                value={startDate}
                onChange={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setStartDate(e.target.value);
                }}
                onClick={(e) => e.stopPropagation()}
              />
            </Form.Group>
            
            <Form.Group>
              <Form.Label>
                <i className="fas fa-calendar-minus me-2"></i>
                Data Final
              </Form.Label>
              <Form.Control
                type="date"
                value={endDate}
                onChange={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setEndDate(e.target.value);
                }}
                onClick={(e) => e.stopPropagation()}
              />
            </Form.Group>
          </div>
        </Accordion.Body>
      </Accordion.Item>
    </StableAccordion>
  );

  return (
    <>
      {/* Desktop Controls */}
      <Card 
        className="shadow-lg d-none d-lg-block"
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          width: "350px",
          maxHeight: "80vh",
          overflowY: "auto",
          zIndex: 1001,
        }}
      >
        <Card.Header className="bg-primary text-white">
          <h5 className="mb-0">
            <i className="fas fa-map-marked-alt me-2"></i>
            Controles do Mapa
          </h5>
        </Card.Header>
        
        <Card.Body>
          <ControlsContent />
        </Card.Body>
      </Card>

      {/* Mobile Controls Button */}
      <Button
        variant="primary"
        className="d-lg-none shadow-lg"
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          zIndex: 1001,
          borderRadius: "50px",
          width: "60px",
          height: "60px",
        }}
        onClick={() => setShowMobileControls(true)}
      >
        <i className="fas fa-sliders-h"></i>
      </Button>

      {/* Mobile Controls Offcanvas */}
      <Offcanvas
        show={showMobileControls}
        onHide={() => setShowMobileControls(false)}
        placement="end"
        className="d-lg-none"
      >
        <Offcanvas.Header closeButton className="bg-primary text-white">
          <Offcanvas.Title>
            <i className="fas fa-map-marked-alt me-2"></i>
            Controles do Mapa
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <ControlsContent />
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};