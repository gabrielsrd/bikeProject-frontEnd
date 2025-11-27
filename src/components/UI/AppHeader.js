import React from "react";
import { Navbar, Nav, Container, Badge } from "react-bootstrap";

export const AppHeader = ({ stationsCount, cicloviasCount, hotzonesCount }) => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="shadow-sm">
      <Container>
        <Navbar.Brand href="#home" className="fw-bold">
          <i className="fas fa-bicycle me-2 text-success"></i>
          CicloAnalytics USP
          <Badge bg="success" className="ms-2">Dashboard</Badge>
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#map" className="d-flex align-items-center">
              <i className="fas fa-map me-2"></i>
              Mapa Interativo
            </Nav.Link>
            {/* <Nav.Link href="#analytics" className="d-flex align-items-center">
              <i className="fas fa-chart-line me-2"></i>
              Análises
            </Nav.Link> */}
          </Nav>
          
          <Nav>
            <Nav.Item className="d-flex align-items-center text-light me-3">
              <small>
                <i className="fas fa-map-marker-alt me-1 text-success"></i>
                {stationsCount || 0} Estações
              </small>
            </Nav.Item>
            <Nav.Item className="d-flex align-items-center text-light me-3">
              <small>
                <i className="fas fa-route me-1 text-primary"></i>
                {cicloviasCount || 0} Ciclovias
              </small>
            </Nav.Item>
            {/* <Nav.Item className="d-flex align-items-center text-light">
              <small>
                <i className="fas fa-fire me-1 text-warning"></i>
                {hotzonesCount || 0} Zonas Quentes
              </small>
            </Nav.Item> */}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};