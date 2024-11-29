import React from "react";
import { Pie } from "react-chartjs-2";
import { Card, CardBody, CardTitle } from "reactstrap";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import "../../styles/Styles.css";

Chart.register(ArcElement, Tooltip, Legend);

interface ExpedientesProps {
  nuevos: number;
  enProceso: number;
  finalizados: number;
}

export const GraficoExpedientes: React.FC<ExpedientesProps> = ({
  nuevos,
  enProceso,
  finalizados,
}) => {
  const data = {
    labels: ["Nuevos", "En Proceso", "Finalizados"],
    datasets: [
      {
        data: [nuevos, enProceso, finalizados],
        backgroundColor: ["#65257b", "#065fa8", "#ff9a02"],
        hoverBackgroundColor: ["#d2a4f8", "#91bdff", "#ffdf74"],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
  };

  return (
    <div className="chart-container">
      <Card className="card-custom">
        <CardTitle className="Titulo">Estado de los Expedientes</CardTitle>
        <CardBody>
          <div className="chart-body">
            <Pie data={data} options={options} />
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
