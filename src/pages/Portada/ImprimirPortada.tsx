import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { portada_get } from "../../services/portada.services";
import { getUser } from "../../services/auth.service";
import Swal from "sweetalert2";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

interface User {
  first_name: string;
  last_name: string;
  role?: string;
}

interface Portada {
  num_expediente: string;
  asunto: string;
  num_legajos: string;
  num_fojas: string;
  valores_secundarios: string;
  fecha_apertura: string;
  fecha_cierre: string;
  seccion: string;
  serie: string;
  subserie: string;
  ficha: string;
  catalogo: string;
  id_expediente?: string;
}

export const ImprimirPortada: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [portada, setPortada] = useState<Portada | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [User, setUser] = useState<User | null>(null);

  useEffect(() => {
    const user = getUser();
    if (user) {
      setUser({
        first_name: user.first_name,
        last_name: user.last_name,
      });
    }
  }, []);

  useEffect(() => {
    const fetchPortada = async () => {
      if (!id) {
        navigate("/Portada");
        return;
      }

      try {
        setIsLoading(true);

        const storedPortada = localStorage.getItem("ImprimirPortada");
        if (storedPortada) {
          const parsedPortada = JSON.parse(storedPortada);

          if (String(parsedPortada.id_expediente) === String(id)) {
            setPortada(parsedPortada);
            setIsLoading(false);
            return;
          }
        }

        const response = await portada_get();

        if (!response || response.length === 0) {
          throw new Error("No se encontraron portadas");
        }

        const item = response.find(
          (port: Portada) => String(port.id_expediente) === String(id)
        );

        if (!item) {
          await Swal.fire({
            icon: "error",
            title: "Portada No Encontrada",
            text: `No se encontró la portada con ID ${id}`,
            confirmButtonText: "Volver a Portadas",
          });
          navigate("/Portada");
          return;
        }

        setPortada(item);
        localStorage.setItem("ImprimirPortada", JSON.stringify(item));
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
          confirmButtonText: "Volver a Portadas",
        });

        navigate("/Portada");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPortada();
  }, [id, navigate]);

  const generarPDF = () => {
    if (!portada) return;

    try {
      const doc = new jsPDF("landscape");

      const primaryColor: [number, number, number] = [41, 128, 185]; // Azul profesional
      const textColor: [number, number, number] = [0, 0, 0]; // Negro
      const grayColor: [number, number, number] = [128, 128, 128]; // Gris

      doc.setFontSize(22);
      doc.setTextColor(...(primaryColor as [number, number, number]));
      doc.text("MUNICIPIO DE TLAXCALA", doc.internal.pageSize.width / 2, 30, {
        align: "center",
      });

      doc.setFontSize(32);
      doc.setTextColor(...(textColor as [number, number, number]));
      doc.text(
        `Expediente: ${portada.num_expediente}`,
        doc.internal.pageSize.width / 2,
        50,
        { align: "center" }
      );

      doc.setDrawColor(...(primaryColor as [number, number, number]));
      doc.line(15, 60, doc.internal.pageSize.width - 15, 60);

      const startY = 75;
      const leftColumn = 30;
      const rightColumn = doc.internal.pageSize.width / 2 + 30;
      const lineHeight = 10;

      doc.setFontSize(12);
      doc.setTextColor(...(textColor as [number, number, number]));

      const leftColumnData = [
        `Asunto: ${portada.asunto}`,
        `Sección: ${portada.seccion}`,
        `Serie: ${portada.serie}`,
        `Subserie: ${portada.subserie}`,
        `Valores Secundarios: ${portada.valores_secundarios}`,
      ];

      const rightColumnData = [
        `Fecha Apertura: ${portada.fecha_apertura}`,
        `Fecha Cierre: ${portada.fecha_cierre}`,
        `Número de Legajos: ${portada.num_legajos}`,
        `Número de Fojas: ${portada.num_fojas}`,
        `Ficha: ${portada.ficha}`,
        `Catálogo: ${portada.catalogo}`,
      ];

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
          person: `${User?.first_name} ${User?.last_name}`,
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

      signatures.forEach((signature) => {
        doc.line(
          signature.x,
          signaturesStartY,
          signature.x + signatureWidth,
          signaturesStartY
        );

        doc.text(
          signature.person,
          signature.x + signatureWidth / 2,
          signaturesStartY + 10,
          { align: "center" }
        );

        doc.setFontSize(9);
        doc.text(
          signature.name,
          signature.x + signatureWidth / 2,
          signaturesStartY + 30,
          { align: "center" }
        );
      });

      doc.save(`Portada_${portada.num_expediente || "sin_numero"}.pdf`);
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

  if (!portada) {
    return (
      <div className="p-4 text-center text-red-500">
        No se encontró el expediente
      </div>
    );
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-12 ">Portada de Expediente</h1>
      <div className="border rounded-lg p-4 shadow-sm bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: "Número de Expediente", value: portada.num_expediente },
            { label: "Asunto", value: portada.asunto },
            { label: "Número de Legajos", value: portada.num_legajos },
            { label: "Número de Fojas", value: portada.num_fojas },
            {
              label: "Valores Secundarios",
              value: portada.valores_secundarios,
            },
            { label: "Fecha de Apertura", value: portada.fecha_apertura },
            { label: "Fecha de Cierre", value: portada.fecha_cierre },
            { label: "Sección", value: portada.seccion },
            { label: "Serie", value: portada.serie },
            { label: "Subserie", value: portada.subserie },
            { label: "Ficha", value: portada.ficha },
            { label: "Catálogo", value: portada.catalogo },
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

export default ImprimirPortada;
