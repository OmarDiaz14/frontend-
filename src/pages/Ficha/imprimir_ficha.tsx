import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ficha_get } from "../../services/ficha.services";
import Swal from "sweetalert2";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { getUser } from "../../services/auth.service";

interface User {
  first_name: string;
  last_name: string;
  role?: string;
}

interface Ficha {
  id_ficha: string;
  area_resgurdante: string;
  area_intervienen: string;
  descripcion: string;
  soporte_docu: string;
  topologia: string;
  id_seccion: string;
  id_serie: string;
  id_subserie: string;
  created_by?: User;
  created_at?: string;
}

export const ImprimirFicha: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [ficha, setFicha] = useState<Ficha | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const user = getUser();
    if (user) {
      setCurrentUser({
        first_name: user.first_name,
        last_name: user.last_name,
      });
    }
  }, []);

  useEffect(() => {
    const fetchFicha = async () => {
      if (!id) {
        navigate("/Ficha");
        return;
      }

      try {
        setIsLoading(true);

        const response = await ficha_get();

        if (!response || response.length === 0) {
          throw new Error("No se encontraron fichas");
        }

        const item = response.find(
          (port: Ficha) => String(port.id_ficha) === String(id)
        );

        if (!item) {
          await Swal.fire({
            icon: "error",
            title: "Ficha No Encontrada",
            text: `No se encontró la Ficha con ID ${id}`,
            confirmButtonText: "Volver a Fichas",
          });
          navigate("/Ficha");
          return;
        }

        setFicha(item);
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Error desconocido al cargar datos";

        console.error("Error al cargar datos:", error);

        await Swal.fire({
          icon: "error",
          title: "Error de Carga",
          text: errorMessage,
          confirmButtonText: "Volver a Fichas",
        });

        navigate("/Ficha");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFicha();
  }, [id, navigate]);

  const generarPDF = () => {
    if (!ficha || !currentUser) return;

    try {
      const doc = new jsPDF("landscape");

      // Configuración de colores y fuentes
      const primaryColor: [number, number, number] = [41, 128, 185];
      const textColor: [number, number, number] = [0, 0, 0];

      // Título principal
      doc.setFontSize(22);
      doc.setTextColor(...primaryColor);
      doc.text(
        "FICHA TÉCNICA DE VALORACIÓN DOCUMENTAL",
        doc.internal.pageSize.width / 2,
        30,
        { align: "center" }
      );

      // Número de Expediente
      doc.setFontSize(32);
      doc.setTextColor(...textColor);
      doc.text(
        `Ficha: ${ficha.id_ficha}`,
        doc.internal.pageSize.width / 2,
        50,
        { align: "center" }
      );

      // Línea separadora
      doc.setDrawColor(...primaryColor);
      doc.line(15, 60, doc.internal.pageSize.width - 15, 60);

      // Información distribuida
      const startY = 75;
      const leftColumn = 30;
      const rightColumn = doc.internal.pageSize.width / 2 + 30;
      const lineHeight = 10;

      doc.setFontSize(12);
      doc.setTextColor(...textColor);

      // Columna Izquierda
      const leftColumnData = [
        `Área Resguardante: ${ficha.area_resgurdante}`,
        `Áreas que Intervienen: ${ficha.area_intervienen}`,
        `Descripción: ${ficha.descripcion}`,
        `Soporte Documental: ${ficha.soporte_docu}`,
      ];

      // Columna Derecha
      const rightColumnData = [
        `Tipología: ${ficha.topologia}`,
        `Sección: ${ficha.id_seccion}`,
        `Serie: ${ficha.id_serie}`,
        `Subserie: ${ficha.id_subserie}`,
      ];

      // Renderizar columnas
      leftColumnData.forEach((text, index) => {
        doc.text(text, leftColumn, startY + index * lineHeight);
      });

      rightColumnData.forEach((text, index) => {
        doc.text(text, rightColumn, startY + index * lineHeight);
      });

      const signaturesStartY = 150;
      const signatureWidth = 60;

      const signatures = [
        {
          name: "Elaboró",
          person: `${currentUser.first_name} ${currentUser.last_name}`,
          x: 30,
        },
        {
          name: "Revisó",
          person: "Wilson Sánchez",
          x: 120,
        },
        {
          name: "Autorizó",
          person: "",
          x: 210,
        },
      ];

      doc.setDrawColor(0, 0, 0);
      doc.setFontSize(10);

      signatures.forEach((signature) => {
        // Línea de firma
        doc.line(
          signature.x,
          signaturesStartY,
          signature.x + signatureWidth,
          signaturesStartY
        );

        // Nombre del firmante
        doc.text(
          signature.person,
          signature.x + signatureWidth / 2,
          signaturesStartY + 10,
          { align: "center" }
        );

        // Tipo de firma
        doc.setFontSize(9);
        doc.text(
          signature.name,
          signature.x + signatureWidth / 2,
          signaturesStartY + 30,
          { align: "center" }
        );
      });

      // Metadatos y fecha de generación
      const currentDate = new Date().toLocaleString();
      doc.setFontSize(8);
      doc.text(
        `Generado el: ${currentDate}`,
        doc.internal.pageSize.width - 20,
        doc.internal.pageSize.height - 10,
        { align: "right" }
      );

      // Guardar PDF
      doc.save(`Ficha_${ficha.id_ficha || "sin_numero"}.pdf`);
    } catch (error) {
      console.error("Error al generar PDF:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo generar el PDF. Intente nuevamente.",
      });
    }
  };

  if (isLoading) {
    return <div className="p-4 text-center">Cargando...</div>;
  }

  if (!ficha) {
    return (
      <div className="p-4 text-center text-red-500">
        No se encontró el número de ficha
      </div>
    );
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-12">
        Ficha Técnica de Valoración Documental
      </h1>
      <div className="border rounded-lg p-4 shadow-sm bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: "Número de Ficha", value: ficha.id_ficha },
            { label: "Área Resguardante", value: ficha.area_resgurdante },
            { label: "Áreas que Intervienen", value: ficha.area_intervienen },
            { label: "Descripción", value: ficha.descripcion },
            { label: "Soporte Documental", value: ficha.soporte_docu },
            { label: "Tipología", value: ficha.topologia },
            { label: "Sección", value: ficha.id_seccion },
            { label: "Serie", value: ficha.id_serie },
            { label: "Subserie", value: ficha.id_subserie },
          ].map((item, index) => (
            <div key={index} className="border-b pb-2">
              <strong className="text-gray-700">{item.label}:</strong>{" "}
              <span className="text-gray-900">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-6 flex justify-center">
        <button
          onClick={generarPDF}
          className="bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition-colors shadow-md"
        >
          Generar PDF
        </button>
      </div>
    </div>
  );
};

export default ImprimirFicha;
