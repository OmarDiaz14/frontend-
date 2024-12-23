import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import { Seccion_get } from "../../services/cuadro.service";
import { seccion } from "../../Producto";
import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import Swal from "sweetalert2";

export function TableSeccion() {
  const [Seccion, setSeccion] = useState<seccion[]>([]);
  const [filteredSeccion, setFilteredSeccion] = useState<seccion[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchSeccion = async () => {
    setIsLoading(true);
    try {
      const items = await Seccion_get();
      setSeccion(items);
      setFilteredSeccion(items);
    } catch (error) {
      console.error("Error fetching inventory", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron cargar los datos de seccion",
      });
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchSeccion();
  }, []);

  const rowsWithIds = Seccion.map((row, index) => ({
    ...row,
    id: index,
  }));

  const handleFilterChange = (filteredData: seccion[]) => {
    setFilteredSeccion(filteredData);
  };

  const columns: GridColDef[] = [
    /*{
          field: "id_seccion",
          headerName: "Código de la Sección ",
          flex: 1,
          minWidth: 150,
          headerClassName: "table-header",
        },*/
    {
      field: "codigo",
      headerName: "Código de la Sección ",
      flex: 1.5,
      minWidth: 200,
      headerClassName: "table-header",
    },
    {
      field: "descripcion",
      headerName: "Nombre de la Sección",
      flex: 2,
      minWidth: 250,
      headerClassName: "table-header",
    },
  ];

  return (
    <main className="max-w-7x1 mx-auto px-4 py-8">
      <div className="container-fluid">
        <div className="row justify-content-center">
          <div className="col-lg-7">
            <div className="card shadow-lg border-0 rounded-lg">
              <div className="card-body">
                <Box
                  sx={{
                    height: 400,
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
                    rows={rowsWithIds}
                    columns={columns}
                    disableRowSelectionOnClick
                    density="comfortable"
                    initialState={{
                      pagination: {
                        paginationModel: { pageSize: 10 },
                      },
                    }}
                    pageSizeOptions={[5, 10, 25]}
                    loading={isLoading}
                  />
                </Box>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
