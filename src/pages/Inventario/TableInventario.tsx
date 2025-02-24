import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import {
  inventario_get,
  inventario_delete,
} from "../../services/inventario.services";
import { useCallback, useEffect, useState } from "react";
import { Box, IconButton, Tooltip } from "@mui/material";
import { Plus, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";
import SearchFilteriInventario from "./SearchInventario";
import { iPortada } from "../../services/var.portada";
import { portada_get } from "../../services/portada.services";
import { useNavigate } from "react-router-dom";

export function TableInventory() {
  const [iInventario, setiInventario] = useState<iPortada[]>([]);
  const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel>([]);
  const [filteredInventory, setFilteredInventory] = useState<iPortada[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [addedItems, setAddedItems] = useState<Set<string>>(new Set());
  const Navigate = useNavigate();

  const handleClick = () => {
    if (!selectedRows || selectedRows.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Error",
        text: "Por favor, seleccione un elemento para agregar",
      });
      return;
    }

    const selectedId = selectedRows[0] as string;

    if (addedItems.has(selectedId)) {
      Swal.fire({
        icon: "warning",
        title: "Elemento ya agregado",
        text: "Este elemento ya ha sido agregado al inventario",
      });
      return;
    }

    const selectedInventory = filteredInventory.find(
      (item) => item.id_expediente === selectedId
    );

    // Add to added items before navigation
    const newAddedItems = new Set(addedItems);
    newAddedItems.add(selectedId);
    setAddedItems(newAddedItems);
    localStorage.setItem(
      "addedInventoryItems",
      JSON.stringify([...newAddedItems])
    );

    Navigate("/FormAuth", {
      state: { selectedInventory },
    });
  };

  const fetchInventory = async () => {
    setIsLoading(true);
    try {
      const items = await portada_get();
      setiInventario(items);
      setFilteredInventory(items);

      // Load added items from localStorage
      const savedAddedItems = localStorage.getItem("addedInventoryItems");
      if (savedAddedItems) {
        setAddedItems(new Set(JSON.parse(savedAddedItems)));
      }
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
    fetchInventory();
  }, []);

  const handleFilterChange = useCallback((filteredData: iPortada[]): void => {
    setFilteredInventory(filteredData);
  }, []);

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
          // Remove from added items if it was added
          if (addedItems.has(selectedId)) {
            const newAddedItems = new Set(addedItems);
            newAddedItems.delete(selectedId);
            setAddedItems(newAddedItems);
            localStorage.setItem(
              "addedInventoryItems",
              JSON.stringify([...newAddedItems])
            );
          }

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
      field: "id_expediente",
      headerName: "Num. Consecutivo",
      flex: 1,
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
      field: "serie",
      headerName: "Serie",
      flex: 1.5,
      minWidth: 200,
      headerClassName: "table-header",
    },
    {
      field: "fecha_apertura",
      headerName: "Fecha de inicio",
      flex: 1.2,
      minWidth: 150,
      headerClassName: "table-header",
    },
    {
      field: "fecha_cierre",
      headerName: "Fecha de fin",
      flex: 1.2,
      minWidth: 150,
      headerClassName: "table-header",
    },
    {
      field: "num_legajos",
      headerName: "Num. de legajos",
      flex: 1.2,
      minWidth: 150,
      headerClassName: "table-header",
    },
    {
      field: "num_fojas",
      headerName: "Num. de fojas",
      flex: 1.2,
      minWidth: 150,
      headerClassName: "table-header",
    },
    {
      field: "valor_primario",
      headerName: "Valores primarios",
      flex: 1.2,
      minWidth: 150,
      headerClassName: "table-header",
    },
    {
      field: "soporte_docu",
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
      field: "type",
      headerName: "Tipo de acceso",
      flex: 1.2,
      minWidth: 150,
      headerClassName: "table-header",
    },
    {
      field: "estado",
      headerName: "Estado",
      flex: 1,
      minWidth: 120,
      headerClassName: "table-header",
      renderCell: (params) => (
        <span
          className={`px-2 py-1 rounded ${
            addedItems.has(params.row.id_expediente)
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {addedItems.has(params.row.id_expediente)
            ? "Agregado"
            : "No Agregado"}
        </span>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray">
      <main className="max-w-screen-xl mx-auto py-7">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <h1 className="text-center border-b bg-gray-60">
            Inventario General
          </h1>
          <div className="p-4 border-b flex justify-between items-center bg-gray-50">
            <div className="flex gap-3">
              <Tooltip title="Agregar Inventario">
                <span>
                  <IconButton
                    onClick={handleClick}
                    size="small"
                    className="text-green-600 hover:text-green-800"
                    disabled={
                      selectedRows.length !== 1 ||
                      isLoading ||
                      (selectedRows.length === 1 &&
                        addedItems.has(selectedRows[0] as string))
                    }
                  >
                    <Plus className="h-5 w-5" />
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

          <SearchFilteriInventario
            onFilterChange={handleFilterChange}
            iInventario={iInventario}
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
              rows={filteredInventory}
              columns={columns}
              getRowId={(x) => x.id_expediente}
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

export default TableInventory;
