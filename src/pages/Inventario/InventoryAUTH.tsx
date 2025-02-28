import { iInventario } from "../../services/var.inven";
import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import {
  inventario_get,
  inventario_delete,
} from "../../services/inventario.services";
import { useCallback, useEffect, useState } from "react";
import { Box, IconButton, Tooltip } from "@mui/material";
import { Eye, Check, X } from "lucide-react";
import Swal from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";
import SearchFilteriInventario from "./SearchInventario";
import { useNavigate } from "react-router-dom";

export function InventoryAuth() {
  const [iInventario, setiInventario] = useState<iInventario[]>([]);
  const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel>([]);
  const [filteredInventory, setFilteredInventory] = useState<iInventario[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [authorizedItems, setAuthorizedItems] = useState<Set<string>>(
    new Set()
  );
  const Navigate = useNavigate();

  const fetchInventory = async () => {
    setIsLoading(true);
    try {
      const items = await inventario_get();
      setiInventario(items);
      setFilteredInventory(items);

      // Load authorized items from localStorage
      const savedAuthorizedItems = localStorage.getItem(
        "authorizedInventoryItems"
      );
      if (savedAuthorizedItems) {
        setAuthorizedItems(new Set(JSON.parse(savedAuthorizedItems)));
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

  const handleFilterChange = useCallback(
    (filteredData: iInventario[]): void => {
      setFilteredInventory(filteredData);
    },
    []
  );

  const handleEdit = async (): Promise<void> => {
    if (!selectedRows || selectedRows.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Error",
        text: "No se seleccionó ningún item a autorizar",
      });
      return;
    }

    const selectedId = selectedRows[0] as string;

    if (authorizedItems.has(selectedId)) {
      Swal.fire({
        icon: "warning",
        title: "Item ya autorizado",
        text: "Este item ya ha sido autorizado previamente",
      });
      return;
    }

    const itemToEdit = filteredInventory.find(
      (item) => item.num_consecutivo === selectedId
    );

    if (!itemToEdit) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se encontró el item seleccionado",
      });
      return;
    }

    try {
      const result = await Swal.fire({
        title: "Autorizar item",
        text: `¿Desea autorizar el item seleccionado? ${itemToEdit.num_consecutivo}?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, Autorizar",
        cancelButtonText: "Cancelar",
      });

      if (result.isConfirmed) {
        // Add to authorized items
        const newAuthorizedItems = new Set(authorizedItems);
        newAuthorizedItems.add(selectedId);
        setAuthorizedItems(newAuthorizedItems);

        // Save to localStorage
        localStorage.setItem(
          "authorizedInventoryItems",
          JSON.stringify([...newAuthorizedItems])
        );

        localStorage.setItem("InventarioAutorizar", JSON.stringify(itemToEdit));
        Navigate(`/InvenAuth/${selectedId}`);
      }
    } catch (error) {
      console.error("Error al preparar la autorizacion:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error al preparar la autorizacion",
      });
    }
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
          // Remove from authorized items if it was authorized
          if (authorizedItems.has(selectedId)) {
            const newAuthorizedItems = new Set(authorizedItems);
            newAuthorizedItems.delete(selectedId);
            setAuthorizedItems(newAuthorizedItems);
            localStorage.setItem(
              "authorizedInventoryItems",
              JSON.stringify([...newAuthorizedItems])
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
      field: "num_consecutivo",
      headerName: "Núm. Consecutivo",
      flex: 1,
      minWidth: 150,
      headerClassName: "table-header",
    },
    {
      field: "num_expediente",
      headerName: "Núm. Expediente",
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
      headerName: "Núm. de legajos",
      flex: 1.2,
      minWidth: 150,
      headerClassName: "table-header",
    },
    {
      field: "fojas",
      headerName: "Núm. de fojas",
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
      field: "estado",
      headerName: "Estado",
      flex: 1,
      minWidth: 120,
      headerClassName: "table-header",
      renderCell: (params) => (
        <span
          className={`px-2 py-1 rounded ${
            authorizedItems.has(params.row.num_consecutivo)
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {authorizedItems.has(params.row.num_consecutivo)
            ? "Autorizado"
            : "Pendiente"}
        </span>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray pt-16">
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 border-b flex justify-between items-center bg-gray-50">
            <div className="flex gap-2">
              <Tooltip title="Autorizar">
                <span>
                  <IconButton
                    onClick={handleEdit}
                    size="small"
                    className="text-green-600 hover:text-green-800"
                    disabled={
                      selectedRows.length !== 1 ||
                      isLoading ||
                      (selectedRows.length === 1 &&
                        authorizedItems.has(selectedRows[0] as string))
                    }
                  >
                    <Check className="h-5 w-5" />
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
                    <X className="h-5 w-5" />
                  </IconButton>
                </span>
              </Tooltip>
            </div>
          </div>

          <Box
            sx={{
              height: 600,
              width: "100%",
              "& .table-header": {
                backgroundColor: "#000",
                color: "#ffffff",
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
              loading={isLoading}
            />
          </Box>
        </div>
      </main>
    </div>
  );
}

export default InventoryAuth;
