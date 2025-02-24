import { ficha } from "../../services/var.ficha";
import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import { ficha_get, ficha_delete } from "../../services/ficha.services";
import { useEffect, useState, useCallback } from "react";
import { Box, Button, IconButton, Tooltip } from "@mui/material";
import { Eye, Pencil, Trash2, Plus } from "lucide-react";
import { MdOutlinePrint } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import SearchFilter_Ficha from "./SearchFilter_Ficha";
import Swal from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";
import { serie_get } from "../../services/cuadro.service"; // Importa el servicio para obtener las series
interface Serie {
  id_serie: number;
  serie: string;
}
export function Ficha_Registro(): JSX.Element {
  const navigate = useNavigate();
  const [ficha, setFicha] = useState<ficha[]>([]);
  const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel>([]);
  const [filteredFicha, setFilteredFicha] = useState<ficha[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [series, setSeries] = useState<Serie[]>([]);

  // Función para obtener las series
  const fetchSeries = async (): Promise<void> => {
    try {
      const seriesData = await serie_get();
      setSeries(seriesData);
    } catch (error) {
      console.error("Error fetching series", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron cargar las series",
      });
    }
  };

  // Función para obtener las fichas y mapearlas con los nombres de las series
  const fetchAndMapFicha = async (): Promise<void> => {
    try {
      const items = await ficha_get();
      
      // Solo mapear si tenemos tanto las fichas como las series
      const mappedItems = items.map((item: ficha) => {
        const serieFound = series.find((s) => s.id_serie === item.serie);
        return {
          ...item,
          serie: serieFound ? serieFound.serie : "Sin nombre",
        };
      });

      setFicha(mappedItems);
      setFilteredFicha(mappedItems);
    } catch (error) {
      console.error("Error fetching fichas", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron cargar las fichas",
      });
    }
  };

  // Primer useEffect para cargar las series
  useEffect(() => {
    fetchSeries();
  }, []);

  // Segundo useEffect para cargar y mapear las fichas cuando las series estén disponibles
  useEffect(() => {
    if (series.length > 0) {
      fetchAndMapFicha();
    }
  }, [series]);

  const handleFilterChange = useCallback((filteredData: ficha[]): void => {
    setFilteredFicha(filteredData);
  }, []);

  const handleView = (): void => {
    if (!selectedRows || selectedRows.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Error",
        text: "Por favor, seleccione un elemento para Ver",
      });
      return;
    }

    const selectedId = selectedRows[0] as string;
    const itemToView = filteredFicha.find(
      (item) => item.id_ficha === selectedId
    );

    if (!itemToView) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se encontró el elemento seleccionado",
      });
      return;
    }
    localStorage.setItem("", JSON.stringify(itemToView));
    navigate(`//${selectedId}`);
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
    const itemToPrint = filteredFicha.find(
      (item) => item.id_ficha === selectedId
    );

    if (!itemToPrint) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se encontró el elemento seleccionado",
      });
      return;
    }
    localStorage.setItem("ImprimirFicha", JSON.stringify(itemToPrint));
    navigate(`/ImprimirFicha/${selectedId}`);
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
    const itemToEdit = filteredFicha.find(
      (item) => item.id_ficha === selectedId
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
        title: "Editar Ficha",
        text: `¿Desea editar la ficha del expediente ${itemToEdit.id_ficha}?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, editar",
        cancelButtonText: "Cancelar",
      });

      if (result.isConfirmed) {
        localStorage.setItem("fichaEditar", JSON.stringify(itemToEdit));
        navigate(`/Editar_Ficha/${selectedId}`);
      }
    } catch (error) {
      console.error("Error al preparar la edición", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un error al preparar la edición de la ficha",
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
        const success = await ficha_delete(selectedId);

        if (success) {
          Swal.fire({
            icon: "success",
            title: "Eliminado",
            text: "La ficha ha sido eliminada exitosamente.",
            timer: 1500,
            showConfirmButton: false,
          });
          await fetchAndMapFicha();
          setSelectedRows([]);
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se pudo eliminar la ficha",
          });
        }
      } catch (error) {
        console.error("Error al eliminar:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Hubo un error al eliminar la ficha",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCreate = () => {
    navigate("/Crear_Ficha");
  };

  const columns: GridColDef[] = [
    {
      field: "id_ficha",
      headerName: "Num. de Ficha",
      flex: 1,
      minWidth: 150,
      headerClassName: "table-header",
    },
    {
      field: "serie",
      headerName: "Serie",
      flex: 1.2,
      minWidth: 150,
      headerClassName: "table-header",
    },
    {
      field: "descripcion",
      headerName: "Descripción",
      flex: 1.5,
      minWidth: 200,
      headerClassName: "table-header",
    },
    {
      field: "area_resguardante",
      headerName: "Área Resguardante",
      flex: 1.2,
      minWidth: 150,
      headerClassName: "table-header",
    },
    {
      field: "area_intervienen",
      headerName: "Áreas que Intervienen",
      flex: 1.2,
      minWidth: 150,
      headerClassName: "table-header",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Toolbar */}
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

              <Tooltip title="Imprimir Ficha">
                <span>
                  <IconButton
                    onClick={handlePrint}
                    size="small"
                    className="text-blue-600 hover:text-blue-800"
                    disabled={selectedRows.length !== 1 || isLoading}
                  >
                    <MdOutlinePrint className="h-5 w-5" />
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

          <SearchFilter_Ficha
            onFilterChange={handleFilterChange}
            ficha={ficha}
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
              rows={filteredFicha}
              columns={columns}
              getRowId={(x) => x.id_ficha}
              onRowSelectionModelChange={(newSelection) => {
                setSelectedRows(newSelection);
              }}
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

export default Ficha_Registro;