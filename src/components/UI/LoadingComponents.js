import React from "react";
import { Spinner, Alert, Card } from "react-bootstrap";

export const LoadingSpinner = ({ message = "Carregando dados..." }) => (
  <div className="d-flex justify-content-center align-items-center" style={{ height: "200px" }}>
    <Card className="border-0 text-center">
      <Card.Body>
        <Spinner animation="border" variant="primary" className="mb-3" />
        <h6 className="text-muted">{message}</h6>
      </Card.Body>
    </Card>
  </div>
);

export const ErrorAlert = ({ error, onRetry }) => (
  <Alert variant="danger" className="m-3">
    <Alert.Heading>
      <i className="fas fa-exclamation-triangle me-2"></i>
      Erro ao carregar dados
    </Alert.Heading>
    <p className="mb-0">
      {error?.message || "Ocorreu um erro inesperado. Tente novamente."}
    </p>
    {onRetry && (
      <>
        <hr />
        <div className="d-flex justify-content-end">
          <button className="btn btn-outline-danger" onClick={onRetry}>
            <i className="fas fa-redo me-2"></i>
            Tentar novamente
          </button>
        </div>
      </>
    )}
  </Alert>
);

export const MapLoadingOverlay = ({ show, message = "Carregando mapa..." }) => {
  if (!show) return null;
  
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <Card className="shadow-lg">
        <Card.Body className="text-center">
          <Spinner animation="border" variant="primary" size="lg" className="mb-3" />
          <h5 className="text-primary">{message}</h5>
        </Card.Body>
      </Card>
    </div>
  );
};