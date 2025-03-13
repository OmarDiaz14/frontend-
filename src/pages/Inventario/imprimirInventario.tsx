import { useState, useEffect } from "react";
import { inventario_get } from "../../services/inventario.services";
import { getUser } from "../../services/auth.service";
import Swal from "sweetalert2";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

interface User {
  first_name: string;
  last_name: string;
  role?: string;
}

interface Inventario {
  acceso: string;
  descripcion: string;
  destino: string;
  expediente: string;
  fecha_fin: string;
  fecha_inicio: string;
  fojas: string;
  legajos: string;
  num_consecutivo: string;
  num_expediente: string;
  observaciones: string;
  serie: string;
  soporte: string;
  valores_primarios: string;
}

const ImprimirInventario = () => {
  const [filteredInventory, setFilteredInventory] = useState<Inventario[]>([]);
  const [Inventario, setInventario] = useState<Inventario[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [User, setUser] = useState<User | null>(null);

  const fetchInventario = async () => {
    setIsLoading(true);
    try {
      const items = await inventario_get();
      setInventario(items);
      setFilteredInventory(items);
    } catch (error) {
      console.error("Error fetching inventory:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron cargar los datos del inventario",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInventario();
  }, []);

  useEffect(() => {
    const user = getUser();
    if (user) {
      setUser({
        first_name: user.first_name,
        last_name: user.last_name,
      });
    }
  }, []);

  const generarPDF = () => {
    const doc = new jsPDF("landscape");

    doc.setFontSize(18);
    doc.text("Inventario General", 14, 22);

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

    const tableData = Inventario.map((inventario) => [
      inventario.num_consecutivo,
      inventario.expediente,
      inventario.serie,
      inventario.fecha_inicio,
      inventario.fecha_fin,
      inventario.legajos,
      inventario.fojas,
      inventario.valores_primarios,
      inventario.soporte,
      inventario.destino,
      inventario.acceso,
      inventario.descripcion,
      inventario.observaciones,
    ]);

    const columns = [
      "Número consecutivo",
      "Número de Expediente",
      "Número de serie",
      "Fecha de Inicio",
      "Fecha de Cierre",
      "Número de Legajos",
      "Número de Fojas",
      "Valores Primarios",
      "Soporte Documental",
      "Destino del Expediente",
      "Acceso",
      "Descripción",
      "Observaciones",
    ];

    (doc as any).autoTable({
      head: [columns],
      body: tableData,
      startY: 30,
      theme: "striped",
      styles: { fontSize: 8 },
      headStyles: { fillColor: [22, 160, 133] },
    });

    doc.save(`Inventario General.pdf`);
  };

  if (isLoading) {
    return <div className="p-4 text-center">Cargando...</div>;
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-12">Inventario General</h1>
      {Inventario.length === 0 ? (
        <div className="p-4 text-center text-red-500">
          No hay inventarios disponibles
        </div>
      ) : (
        <div className="border rounded-lg p-4 shadow-sm bg-white">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  {[
                    "Número Consecutivo",
                    "Número de Expediente",
                    "Serie",
                    "Fecha de Inicio",
                    "Fecha de Cierre",
                    "Número de Legajos",
                    "Número de Fojas",
                    "Valores Primarios",
                    "Soporte Documental",
                    "Destino del Expediente",
                    "Acceso",
                    "Descripción",
                    "Observaciones",
                  ].map((header, index) => (
                    <th
                      key={index}
                      className="px-4 py-2 text-left text-gray-700 font-medium border-b"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Inventario.map((inventario, index) => (
                  <tr
                    key={index}
                    className="border-b hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-2">{inventario.num_consecutivo}</td>
                    <td className="px-4 py-2">{inventario.num_expediente}</td>
                    <td className="px-4 py-2">{inventario.serie}</td>
                    <td className="px-4 py-2">{inventario.fecha_inicio}</td>
                    <td className="px-4 py-2">{inventario.fecha_fin}</td>
                    <td className="px-4 py-2">{inventario.legajos}</td>
                    <td className="px-4 py-2">{inventario.fojas}</td>
                    <td className="px-4 py-2">
                      {inventario.valores_primarios}
                    </td>
                    <td className="px-4 py-2">{inventario.soporte}</td>
                    <td className="px-4 py-2">{inventario.destino}</td>
                    <td className="px-4 py-2">{inventario.acceso}</td>
                    <td className="px-4 py-2">{inventario.descripcion}</td>
                    <td className="px-4 py-2">{inventario.observaciones}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-6 flex justify-center">
            <button
              onClick={generarPDF}
              className="bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800 transition-colors shadow-md"
            >
              Generar PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImprimirInventario;
