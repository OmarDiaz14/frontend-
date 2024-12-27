import { Logo } from "../../components/Logo";
import { iPortada } from "../../services/var.portada";
import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import { portada_get, portada_delete } from "../../services/portada.services";
import { useEffect, useState, useCallback } from "react";
import { Box, Button, IconButton, Tooltip } from "@mui/material";
import { Eye, Pencil, Trash2, Plus } from "lucide-react";
import { MdOutlinePrint } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";
import SearchFilter_Portada from "./SearchFilter_Portada";
import axios from "axios";

interface DocumentResponse {
  blob: Blob;
  fileName: string;
}

const getAlfrescoDocument = async (id: string): Promise<DocumentResponse> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No se encontró el token de autenticación");
    }
    const response = await axios({
      method: "get",
      url: `https://backend-lga.onrender.com/portada/portada/${id}/get-alfresco-document/`,
      responseType: "blob",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    });

    const contentType = response.headers["content-type"];
    const contentDisposition = response.headers["content-disposition"];
    const fileName = contentDisposition
      ? contentDisposition.split("filename=")[1]?.replace(/"/g, "")
      : "document.pdf";

    return { blob: response.data, fileName };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error("Esta portada no está cargada en Alfresco");
    }
    throw new Error("Error desconocido al obtener el documento");
  }
};

export function Portada_Registro(): JSX.Element {
  const navigate = useNavigate();
  const [iPortada, setIPortada] = useState<iPortada[]>([]);
  const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel>([]);
  const [filteredIPortada, setFilteredIPortada] = useState<iPortada[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    setIsDataLoaded(true);
  }, []);

  const fetchIPortada = async (): Promise<void> => {
    try {
      const items = await portada_get();
      setIPortada(items);
      setFilteredIPortada(items);
    } catch (error) {
      console.error("Error fetching portada:", error);
    }
  };

  useEffect(() => {
    if (isDataLoaded) {
      fetchIPortada();
    }
  }, [isDataLoaded]);

  const handleFilterChange = useCallback((filteredData: iPortada[]): void => {
    setFilteredIPortada(filteredData);
  }, []);

  const handleView = async (): Promise<void> => {
    if (!selectedRows || selectedRows.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Error",
        text: "Por favor, seleccione un elemento para Ver",
      });
      return;
    }

    const selectedId = selectedRows[0] as string;

    try {
      setIsLoading(true);

      const { blob, fileName } = await getAlfrescoDocument(selectedId);

      const pdfUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = pdfUrl;
      link.target = "_blank";
      link.rel = "noopener noreferrer";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => {
        URL.revokeObjectURL(pdfUrl);
      }, 100);
    } catch (error) {
      console.error("Error al obtener el documento:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error instanceof Error
            ? error.message
            : "Error al obtener el documento PDF",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = (): void => {
    if (!selectedRows || selectedRows.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Error",
        text: "Por favor, seleccione un elemento para Imprimir",
      });
      return;
    }

    const selectedId = selectedRows[0] as string;
    const itemToPrint = filteredIPortada.find(
      (item) => item.id_expediente === selectedId
    );

    if (!itemToPrint) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se encontró el elemento seleccionado",
      });
      return;
    }
    localStorage.setItem("ImprimirPortada", JSON.stringify(itemToPrint));
    navigate(`/ImprimirPortada/${selectedId}`);
  };

  const handleEdit = async (): Promise<void> => {
    if (!selectedRows || selectedRows.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Error",
        text: "Por favor, seleccione un elemento para editar",
      });
      return;
    }

    const selectedId = selectedRows[0] as string;
    const itemToEdit = filteredIPortada.find(
      (item) => item.id_expediente === selectedId
    );

    if (!itemToEdit) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se encontró el elemento seleccionado",
      });
      return;
    }

    try {
      const result = await Swal.fire({
        title: "Editar Portada",
        text: `¿Desea editar la portada del expediente ${itemToEdit.num_expediente}?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, editar",
        cancelButtonText: "Cancelar",
      });

      if (result.isConfirmed) {
        localStorage.setItem("portadaEditar", JSON.stringify(itemToEdit));
        navigate(`/Editar_Portada/${selectedId}`);
      }
    } catch (error) {
      console.error("Error al preparar la edición:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un error al preparar la edición de la portada",
      });
    }
  };

  const handleDelete = async (): Promise<void> => {
    if (!selectedRows || selectedRows.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Error",
        text: "Por favor, seleccione un elemento para eliminar",
      });
      return;
    }

    const selectedId = selectedRows[0] as string;

    const result = await Swal.fire({
      title: "¿Está seguro?",
      text: "No podrá revertir esta acción",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      setIsLoading(true);
      try {
        const success = await portada_delete(selectedId);

        if (success) {
          await Swal.fire({
            icon: "success",
            title: "Eliminado",
            text: "La portada ha sido eliminada exitosamente.",
            timer: 1500,
            showConfirmButton: false,
          });
          await fetchIPortada();
          setSelectedRows([]);
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se pudo eliminar la portada",
          });
        }
      } catch (error) {
        console.error("Error al eliminar:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Hubo un error al eliminar la portada",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCreate = () => {
    navigate("/Crear_Portada");
  };

  const columns: GridColDef[] = [
    {
      field: "num_expediente",
      headerName: "No. Expediente",
      flex: 1,
      minWidth: 150,
      headerClassName: "table-header",
    },
    {
      field: "asunto",
      headerName: "Asunto",
      flex: 1.5,
      minWidth: 150,
      headerClassName: "table-header",
    },
    {
      field: "fecha_apertura",
      headerName: "Fecha de Apertura",
      flex: 1,
      minWidth: 150,
      headerClassName: "table-header",
    },
    {
      field: "fecha_cierre",
      headerName: "Fecha de Cierre",
      flex: 1,
      minWidth: 150,
      headerClassName: "table-header",
    },
    {
      field: "ficha",
      headerName: "Ficha",
      flex: 1,
      minWidth: 150,
      headerClassName: "table-header",
    },
    {
      field: "catalogo",
      headerName: "Catálogo",
      flex: 1,
      minWidth: 150,
      headerClassName: "table-header",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="p-4 flex flex-col items-center">
        <Logo />
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 border-b flex justify-between items-center bg-gray-50">
            <div className="flex gap-2">
              <Tooltip title="Ver">
                <span>
                  <IconButton
                    onClick={handleView}
                    size="small"
                    className="text-green-600 hover:text-green-800"
                    disabled={selectedRows.length !== 1 || isLoading}
                  >
                    <Eye className="h-5 w-5" />
                  </IconButton>
                </span>
              </Tooltip>

              <Tooltip title="Editar">
                <span>
                  <IconButton
                    onClick={handleEdit}
                    size="small"
                    className="text-green-600 hover:text-green-800"
                    disabled={selectedRows.length !== 1 || isLoading}
                  >
                    <Pencil className="h-5 w-5" />
                  </IconButton>
                </span>
              </Tooltip>

              <Tooltip title="Eliminar">
                <span>
                  <IconButton
                    onClick={handleDelete}
                    size="small"
                    className="text-red-600 hover:text-red-800"
                    disabled={selectedRows.length !== 1 || isLoading}
                  >
                    <Trash2 className="h-5 w-5" />
                  </IconButton>
                </span>
              </Tooltip>

              <Tooltip title="Imprimir Docuemento">
                <span>
                  <IconButton
                    onClick={handlePrint}
                    size="small"
                    className="text-blue-600 hover:text-blue-800"
                    disabled={selectedRows.length !== 1 || isLoading}
                  >
                    <MdOutlinePrint className="h-6 w-6" />
                  </IconButton>
                </span>
              </Tooltip>
            </div>

            <Button
              variant="contained"
              startIcon={<Plus className="h-4 w-4" />}
              onClick={handleCreate}
              disabled={isLoading}
              sx={{
                backgroundColor: "#441853",
                "&:hover": {
                  backgroundColor: "#331340",
                },
              }}
            >
              Nuevo
            </Button>
          </div>

          <SearchFilter_Portada
            onFilterChange={handleFilterChange}
            iPortada={iPortada}
          />

          <Box
            sx={{
              height: 600,
              width: "100%",
              "& .table-header": {
                backgroundColor: "#f8fafc",
                color: "#1f2937",
                fontWeight: 600,
              },
              "& .MuiDataGrid-root": {
                border: "none",
                "& .MuiDataGrid-cell": {
                  borderBottom: "1px solid #f1f5f9",
                },
                "& .MuiDataGrid-columnHeaders": {
                  borderBottom: "2px solid #e2e8f0",
                },
                "& .MuiDataGrid-virtualScroller": {
                  backgroundColor: "#ffffff",
                },
              },
            }}
          >
            <DataGrid
              rows={filteredIPortada}
              columns={columns}
              getRowId={(x) => x.id_expediente}
              onRowSelectionModelChange={(newSelection) => {
                setSelectedRows(newSelection);
              }}
              rowSelectionModel={selectedRows}
              density="comfortable"
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 10 },
                },
              }}
              pageSizeOptions={[5, 10, 25, 50]}
              className="w-full"
              checkboxSelection
            />
          </Box>
        </div>
      </main>
    </div>
  );
}

export default Portada_Registro;
