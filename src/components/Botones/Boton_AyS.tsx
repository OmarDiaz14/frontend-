import React from "react";
import "../../styles/Styles.css";

interface Boton_AySProps {
  handleClick: (direction: "Atrás" | "Adelante") => void;
  currentStep: number;
  steps: string[];
}

export const Boton_AyS: React.FC<Boton_AySProps> = ({
  handleClick,
  currentStep,
  steps,
}) => {
  return (
    <div className="Contenedor_Botones_AyS">
      {/* Botón atrás */}
      <button
        onClick={() => handleClick("Atrás")}
        className={`Atrás ${
          currentStep === 1
            ? "Boton_Atrás_Seleccionado"
            : "II_Boton_Atrás_Seleccionado"
        }`}
        disabled={currentStep === 1}
      >
        Atrás
      </button>

      {/* Botón Adelante */}
      <button
        onClick={() => handleClick("Adelante")}
        className="Adelante"
        disabled={currentStep === steps.length}
      >
        {currentStep === steps.length - 1 ? "Confirmar" : "Siguiente"}
      </button>
    </div>
  );
};
