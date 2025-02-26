import React from "react";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Alfresco from "../../assets/Alfresco.jpeg";
import "bootstrap/dist/css/bootstrap.min.css";

function CardsDashboard() {
  return (
    <div className="mx-4 my-3">
      <Card
        className="border-0"
        style={{ boxShadow: "0 2px 20px rgba(0,0,0,0.08)" }}
      >
        <Card.Header className="bg-dark border-bottom border-light py-2">
          <span className="text-white fs-5">
            Gestión Documental con Alfresco
          </span>
        </Card.Header>
        <Card.Body className="px-3 py-3">
          <div className="d-flex align-items-center gap-3 mb-4">
            <div style={{ width: "52px", height: "52px" }}>
              <img
                src={Alfresco}
                alt="Alfresco"
                className="img-fluid"
                style={{ objectFit: "contain", width: "100%", height: "100%" }}
              />
            </div>
            <Card.Title className="h1 mb-0" style={{ fontWeight: "500" }}>
              ALFRESCO
            </Card.Title>
          </div>
          <Card.Text className="text-muted mb-3" style={{ lineHeight: "1.3" }}>
            Optimiza la administración de documentos con el poder de Alfresco.
            Accede a tus expedientes, organiza información y mejora la
            colaboración de manera eficiente y segura.
          </Card.Text>
          <Link to="http://52.118.255.6:8080/share/page/">
            <Button
              variant="outline-primary"
              className="px-4"
              style={{ borderRadius: "6px" }}
            >
              Ir a Alfresco
            </Button>
          </Link>
        </Card.Body>
      </Card>
    </div>
  );
}

export default CardsDashboard;
