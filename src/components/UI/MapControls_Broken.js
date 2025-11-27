import React, { useState } from "react";
import { Card, Form, Badge, Accordion, Button, Offcanvas } from "react-bootstrap";
import StableAccordion from "./StableAccordion";

export const MapControls = ({
  showStations,
  setShowStations,
  showCiclovias,
  setShowCiclovias,
  uspMapFilter,
  setUspMapFilter,
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
                  Estações de bicicleta
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

      {/* Station Display Filters */}
      <Accordion.Item eventKey="1">
        <Accordion.Header>
          <i className="fas fa-filter me-2"></i>
          Filtros de Exibição
        </Accordion.Header>
        <Accordion.Body 
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          style={{ userSelect: 'none' }}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <Form.Check
              type="switch"
              id="switch-usp-map"
              label={
                <span>
                  <i className="fas fa-university me-2 text-warning"></i>
                  Mostrar apenas estações USP (242-260)
                  {uspMapFilter && <Badge bg="warning" className="ms-2">Ativo</Badge>}
                </span>
              }
              checked={uspMapFilter}
              onChange={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setUspMapFilter(e.target.checked);
              }}
              onClick={(e) => e.stopPropagation()}
            />
            <div className="mt-2">
              <small className="text-muted">
                <i className="fas fa-info-circle me-1"></i>
                Filtro ativo por padrão para melhor performance. Use a análise detalhada de estações para filtros temporais.
              </small>
            </div>
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