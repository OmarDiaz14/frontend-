import { Inventario } from "../../services/var.inven";
import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import {
  inventario_get,
  inventario_delete,
} from "../../services/inventario.services";
import { useEffect, useState } from "react";
import { Box, IconButton, Tooltip } from "@mui/material";
import { Eye, Pencil, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";

export function TableInventory() {
  const [inventario, setInventario] = useState<Inventario[]>([]);
  const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel>([]);
  const [filteredInventory, setFilteredInventory] = useState<Inventario[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchInventory = async () => {
    const items = await inventario_get();
    setInventario(items);
  };

  useEffect(() => {
    const fetchInventory = async () => {
      const items = await inventario_get();
      setInventario(items);
      setFilteredInventory(items);
    };
    fetchInventory();
  }, []);

  const handleFilterChange = (filteredData: Inventario[]) => {
    setFilteredInventory(filteredData);
  };

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
        const success = await inventario_delete(selectedId);

        if (success) {
          Swal.fire({
            icon: "success",
            title: "Eliminado",
            text: "El elemento ha sido eliminado con éxito",
            timer: 1500,
            showConfirmButton: false,
          }).then(() => {
            fetchInventory();
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
      field: "num_consecutivo",
      headerName: "Num. Consecutivo",
      flex: 1,
      minWidth: 150,
      headerClassName: "table-header",
    },
    {
      field: "serie",
      headerName: "Serie",
      flex: 1.5,
      minWidth: 200,
      headerClassName: "table-header",
    },
    {
      field: "descripsion",
      headerName: "Descripción",
      flex: 1.2,
      minWidth: 150,
      headerClassName: "table-header",
    },
    {
      field: "observaciones",
      headerName: "Observaciones",
      flex: 1.2,
      minWidth: 150,
      headerClassName: "table-header",
    },
    {
      field: "expediente",
      headerName: "Expediente",
      flex: 1.2,
      minWidth: 150,
      headerClassName: "table-header",
    },
    {
      field: "num_expediente",
      headerName: "Num. Expediente",
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
    {
      field: "legajos",
      headerName: "Num. de legajos",
      flex: 1.2,
      minWidth: 150,
      headerClassName: "table-header",
    },
    {
      field: "fojas",
      headerName: "Num. de fojas",
      flex: 1.2,
      minWidth: 150,
      headerClassName: "table-header",
    },
    {
      field: "valores_primarios",
      headerName: "Valores primarios",
      flex: 1.2,
      minWidth: 150,
      headerClassName: "table-header",
    },
    {
      field: "soporte",
      headerName: "Soporte",
      flex: 1.2,
      minWidth: 150,
      headerClassName: "table-header",
    },
    {
      field: "destino",
      headerName: "Destino",
      flex: 1.2,
      minWidth: 150,
      headerClassName: "table-header",
    },
    {
      field: "acceso",
      headerName: "Tipo de acceso",
      flex: 1.2,
      minWidth: 150,
      headerClassName: "table-header",
    },
    {
      field: "estatus",
      headerName: "Estatus",
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

          {/*<SearchFilter_Ficha
                onFilterChange={handleFilterChange}
                ficha={inventario}
              />*/}

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
              rows={filteredInventory}
              columns={columns}
              getRowId={(x) => x.num_consecutivo}
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

export default TableInventory;
