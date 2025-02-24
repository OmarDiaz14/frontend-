import React from "react";
import { CardGrid } from "./CardGrid";
import Ficha from "../../assets/Ficha.png";
import Catálogo from "../../assets/Catálogo.png";
import Portada from "../../assets/Portada.png";

const cards = [
  {
    imageSrc: Ficha,
    redirectUrl: "/Crear_Ficha",
    title: "Ficha Técnica de Valoración Documental ",
    subtitle:
      "La Ficha Técnica de Valoración Documental (FTVD) es un instrumento que permite identificar, analizar y establecer el contexto y valoración de series documentales",
  },
  {
    imageSrc: Catálogo,
    redirectUrl: "/Crear_Catálogo",
    title: "Catálogo de Disposición Documental Funciones Comunes ",
    subtitle:
      "El CADIDO es el registro general, sistemático y normalizado de los valores de disposición de todos los documentos existentes, ya sea producidos o recibidos en la unidades administrativas u órganos administrativos desconcentrados de la Secretaría.",
  },
  {
    imageSrc: Portada,
    redirectUrl: "/Crear_Portada",
    title: "Portada",
    subtitle:
      "Portada de expediente. Contiene toda la información escencial sobre los expedientes creados por las unidades adminstrativas u órganos administrativos desconcentrados de la Secretaría ",
  },
];

const Cards_IA: React.FC = () => {
  return <CardGrid cards={cards} columns={3} />;
};

export default Cards_IA;
