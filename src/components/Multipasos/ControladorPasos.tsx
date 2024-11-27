import React from "react";
import "../../styles/Styles.css";
import { Boton_AyS } from "../Botones/Boton_AyS";

interface ControladorPasosProps {
  handleClick: (direction: "Atrás" | "Adelante") => void;
  currentStep: number;
  steps: string[];
}

export const ControladorPasos: React.FC<ControladorPasosProps> = ({
  handleClick,
  currentStep,
  steps,
}) => {
  return (
    <div>
      <Boton_AyS
        handleClick={handleClick}
        currentStep={currentStep}
        steps={steps}
      />
    </div>
  );
};
