import { Logo } from "../../components/Logo";
import { iPortada } from "../../services/var.portada";
import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import { portada_get, portada_delete } from "../../services/portada.services";
import { useEffect, useState, useCallback } from "react";
import { Box, Button, IconButton, Tooltip } from "@mui/material";
import { Eye, Pencil, Trash2, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";
import SearchFilter_Portada from "./SearchFilter_Portada";

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

  //Edición en construcción :pppppp

  const handleView = (): void => {
    if (!selectedRows || selectedRows.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Error",
        text: "Por favor, seleccione un elemento para ver",
      });
      return;
    }

    const selectedId = selectedRows[0] as string;
    const itemToView = filteredIPortada.find(
      (item) => item.id_expediente === selectedId
    );

    if (!itemToView) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se encontró el elemento seleccionado",
      });
      return;
    }
    localStorage.setItem("ImprimirPortada", JSON.stringify(itemToView));
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
              <Tooltip title="Ver detalles">
                <span>
                  <IconButton
                    onClick={handleView}
                    size="small"
                    className="text-blue-600 hover:text-blue-800"
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
