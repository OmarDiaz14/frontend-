import { iGuia } from "../../services/var.guia";
import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import { useCallback, useEffect, useState } from "react";
import { Box, IconButton, Tooltip } from "@mui/material";
import { Eye, Pencil, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";
import { guia_delete, guia_get } from "../../services/gui.service";
import SearchFilteriGuia from "./SearchGuia";

export function TableGuia() {
  const [iGuia, setiGuia] = useState<iGuia[]>([]);
  const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel>([]);
  const [filteredGuia, setFilteredGuia] = useState<iGuia[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchGuia = async () => {
    setIsLoading(true);
    try {
      const items = await guia_get();
      setiGuia(items);
      setFilteredGuia(items);
    } catch (error) {
      console.error("Error fetching inventory", error);
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
    fetchGuia();
  }, []);

  const handleFilterChange = useCallback((filteredData: iGuia[]) => {
    setFilteredGuia(filteredData);
  }, []);

  const handleView = () => {
    const selectedId = selectedRows[0];
    console.log("Viewing item", selectedId);
  };

  const handleEdit = () => {
    const selectedId = selectedRows[0];
    console.log("Editing item:", selectedId);
  };

  const handleDelete = async () => {
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
      title: "¿Estás seguro de eliminar este elemento?",
      text: "No se podra revertir esta acción",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, Eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      setIsLoading(true);
      try {
        const success = await guia_delete(selectedId);

        if (success) {
          Swal.fire({
            icon: "success",
            title: "Eliminado",
            text: "El elemento ha sido eliminado con éxito",
            timer: 1500,
            showConfirmButton: false,
          }).then(() => {
            fetchGuia();
            setSelectedRows([]);
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Ha ocurrido un error al eliminar el elemento",
          });
        }
      } catch (error) {
        console.error("Error al eliminar:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Ha ocurrido un error al eliminar el elemento",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const columns: GridColDef[] = [
    {
      field: "id_guia",
      headerName: "ID Guia",
      flex: 1,
      minWidth: 150,
      headerClassName: "table-header",
    },
    {
      field: "descripcion",
      headerName: "Descripcion",
      flex: 1.5,
      minWidth: 200,
      headerClassName: "table-header",
    },
    {
      field: "volumen",
      headerName: "Volumen",
      flex: 1.2,
      minWidth: 150,
      headerClassName: "table-header",
    },
    {
      field: "ubicacion_fisica",
      headerName: "Ubicacion fisica",
      flex: 1.2,
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
      field: "seccion",
      headerName: "Seccion",
      flex: 1.2,
      minWidth: 150,
      headerClassName: "table-header",
    },
    {
      field: "num_expediente",
      headerName: "Numero de expediente",
      flex: 1.2,
      minWidth: 150,
      headerClassName: "table-header",
    },
    {
      field: "fecha_inicio",
      headerName: "Fecha de inicio",
      flex: 1.2,
      minWidth: 150,
      headerClassName: "table-header",
    },
    {
      field: "fecha_fin",
      headerName: "Fecha de fin",
      flex: 1.2,
      minWidth: 150,
      headerClassName: "table-header",
    },
  ];

  return (
    <div className="min-h-screen bg-gray">
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Toolbar */}
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
          </div>

          <SearchFilteriGuia
            onFilterChange={handleFilterChange}
            iGuia={iGuia}
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
              rows={filteredGuia}
              columns={columns}
              getRowId={(x) => x.id_guia}
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
              loading={isLoading}
            />
          </Box>
        </div>
      </main>
    </div>
  );
}

export default TableGuia;
