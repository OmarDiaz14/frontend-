import { useEffect, useState } from "react";
import { GiCheckMark } from "react-icons/gi";

interface PasosProps {
  steps: string[];
  currentStep: number;
}

interface Step {
  description: string;
  completed: boolean;
  highlighted: boolean;
  selected: boolean;
}

export const Pasos = ({ steps, currentStep }: PasosProps) => {
  const [newStep, setNewStep] = useState<Step[]>([]);

  const updateStep = (stepNumber: number, steps: Step[]): Step[] => {
    return steps.map((step, index) => {
      if (index === stepNumber) {
        return { ...step, highlighted: true, selected: true, completed: false };
      }
      if (index < stepNumber) {
        return { ...step, highlighted: false, selected: true, completed: true };
      }
      return { ...step, highlighted: false, selected: false, completed: false };
    });
  };

  useEffect(() => {
    const stepsState: Step[] = steps.map((step, index) => ({
      description: step,
      completed: false,
      highlighted: index === 0,
      selected: index === 0,
    }));

    const current = updateStep(currentStep - 1, stepsState);
    setNewStep(current);
  }, [steps, currentStep]);

  const displaySteps = newStep.map((step, index) => (
    <div
      key={index}
      className={
        index !== newStep.length - 1 ? "Pasos_Display" : "II_Pasos_Display"
      }
    >
      <div
        className={`C_Pasos_Pasos ${step.selected ? "Paso_Seleccionado" : ""}`}
      >
        <div className="Número_Display">
          {step.completed ? (
            <span className="Número_Seleccionado">
              {" "}
              <GiCheckMark />{" "}
            </span>
          ) : (
            index + 1
          )}
        </div>

        <div
          className={`Descripción_Display ${
            step.highlighted ? "texto_seleccionado" : "II_texto_seleccioando"
          }`}
        >
          {step.description}
        </div>
      </div>

      {index !== newStep.length - 1 && (
        <div
          className={`Linea_Display ${
            step.completed ? "Linea_Seleccionada" : "II_Linea_Seleccionada"
          }`}
        ></div>
      )}
    </div>
  ));

  return <div className="Pasos">{displaySteps}</div>;
};
