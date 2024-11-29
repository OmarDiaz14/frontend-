import { Logo } from "../../components/Logo";
import { catalogo, destino, type, valor } from "../../services/var.catalogo";
import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import {
  catalogo_get,
  catalogo_delete,
  destino_get,
  type_get,
  valor_get,
} from "../../services/catalogo.service";
import { useEffect, useState, useCallback } from "react";
import { Box, Button, IconButton, Tooltip } from "@mui/material";
import { Eye, Pencil, Trash2, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";
import SearchFilter from "./SearchFilter";

export function Catálogo_Registro(): JSX.Element {
  const navigate = useNavigate();
  const [catalogo, setCatalogo] = useState<catalogo[]>([]);
  const [filteredCatalogo, setFilteredCatalogo] = useState<catalogo[]>([]);
  const [destinos, setDestinos] = useState<destino[]>([]);
  const [types, setTypes] = useState<type[]>([]);
  const [valores, setValores] = useState<valor[]>([]);
  const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    const fetchRelatedData = async () => {
      try {
        const [destinosData, typesData, valoresData] = await Promise.all([
          destino_get(),
          type_get(),
          valor_get(),
        ]);
        setDestinos(destinosData);
        setTypes(typesData);
        setValores(valoresData);
        setIsDataLoaded(true);
      } catch (error) {
        console.error("Error fetching related data:", error);
      }
    };

    fetchRelatedData();
  }, []);

  useEffect(() => {
    if (isDataLoaded) {
      fetchCatalogo();
    }
  }, [isDataLoaded]);

  const fetchCatalogo = async (): Promise<void> => {
    try {
      const items = await catalogo_get();
      const mappedItems: catalogo[] = items.map((item: catalogo) => ({
        ...item,
        destino_expe:
          destinos.find((dest) => dest.id_destino === item.destino_expe)
            ?.destino || item.destino_expe,
        type_access:
          types.find((type) => type.id_type === item.type_access)?.type ||
          item.type_access,
        valores_documentales:
          valores.find(
            (valor) => valor.id_valores === item.valores_documentales
          )?.valores || item.valores_documentales,
      }));
      setCatalogo(mappedItems);
      setFilteredCatalogo(mappedItems);
    } catch (error) {
      console.error("Error fetching catalogo:", error);
    }
  };

  const handleFilterChange = useCallback((filteredData: catalogo[]): void => {
    setFilteredCatalogo(filteredData);
  }, []);

  const handleView = (): void => {
    const selectedId = selectedRows[0];
    console.log("Viewing item:", selectedId);
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
    const itemToEdit = filteredCatalogo.find(
      (item) => item.id_catalogo === selectedId
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
        title: "Editar Catálogo",
        text: `¿Desea editar el catálogo ${itemToEdit.catalogo}?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, editar",
        cancelButtonText: "Cancelar",
      });

      if (result.isConfirmed) {
        localStorage.setItem("catalogoEditar", JSON.stringify(itemToEdit));
        navigate(`/Editar_Catálogo/${selectedId}`);
      }
    } catch (error) {
      console.error("Error al preparar la edición:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un error al preparar la edición del catálogo",
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
        const success = await catalogo_delete(selectedId);

        if (success) {
          await Swal.fire({
            icon: "success",
            title: "Eliminado",
            text: "El catálogo ha sido eliminado exitosamente.",
            timer: 1500,
            showConfirmButton: false,
          });
          await fetchCatalogo();
          setSelectedRows([]); // Reset selection after deletion
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se pudo eliminar el catálogo",
          });
        }
      } catch (error) {
        console.error("Error al eliminar:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Hubo un error al eliminar el catálogo",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCreate = (): void => {
    navigate("/Crear_Catálogo");
  };

  const columns: GridColDef[] = [
    {
      field: "id_seccion",
      headerName: "Sección",
      flex: 1,
      minWidth: 150,
      headerClassName: "table-header",
    },
    {
      field: "id_serie",
      headerName: "Serie",
      flex: 1,
      minWidth: 150,
      headerClassName: "table-header",
    },
    {
      field: "valores_documentales",
      headerName: "Valores  del Expediente",
      flex: 1,
      minWidth: 150,
      headerClassName: "table-header",
    },
    {
      field: "archivo_tramite",
      headerName: "Tiempo en Archivo de Trámite",
      flex: 1,
      minWidth: 150,
      headerClassName: "table-header",
    },
    {
      field: "archivo_concentracion",
      headerName: "Tiempo en Archivo de Concentración",
      flex: 1,
      minWidth: 150,
      headerClassName: "table-header",
    },
    {
      field: "type_access",
      headerName: "Tipo  del Expediente",
      flex: 1,
      minWidth: 150,
      headerClassName: "table-header",
    },
    {
      field: "destino_expe",
      headerName: "Destino del Expediente",
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

          <SearchFilter
            onFilterChange={handleFilterChange}
            catalogo={catalogo}
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
              rows={filteredCatalogo}
              columns={columns}
              getRowId={(row) => row.id_catalogo}
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

export default Catálogo_Registro;
