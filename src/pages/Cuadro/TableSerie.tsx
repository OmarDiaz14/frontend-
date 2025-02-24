import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import { Seccion_get, serie_get } from "../../services/cuadro.service";
import { seccion, serie } from "../../services/var.cuadro";
import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import Swal from "sweetalert2";

export function TableSerie() {
  const [Serie, setSerie] = useState<serie[]>([]);
  const [filteredSerie, setFilteredSerie] = useState<serie[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [secciones, setSecciones] = useState<seccion[]>([]);
  
  const fetchSeccion = async (): Promise<void> => {
  setIsLoading(true);
  try {
    const seccionesData: seccion[] = await Seccion_get();
    setSecciones(seccionesData);
    const seriesData: serie[] = await serie_get();
    const mappedSeries = seriesData.map((Serie) => {
      const seccion = seccionesData.find(
        (Seccion) => Seccion.id_seccion === Serie.id_seccion
      )?.seccion; 
      return {
        ...Serie,
        id_seccion: seccion || "Sin sección", 
      };
    });

    setSerie(mappedSeries);
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

  const rowsWithIds = Serie.map((row, index) => ({
    ...row,
    id: index,
  }));

  const handleFilterChange = (filteredData: serie[]) => {
    setFilteredSerie(filteredData);
  };

  const columns: GridColDef[] = [
    {
      field: "codigo_serie",
      headerName: "Código de la Serie",
      flex: 1,
      minWidth: 150,
      headerClassName: "table-header",
    },
    {
      field: "descripcion",
      headerName: "Nombre de la Serie",
      flex: 2,
      minWidth: 250,
      headerClassName: "table-header",
    },
    {
      field: "id_seccion",
      headerName: "Sección Asociada",
      flex: 1.5,
      minWidth: 150,
      headerClassName: "table-header",
    },
  ];

  return (
    <div className="card shadow-lg border-0 rounded-lg">
      <div className="card-body">
        <Box
          sx={{
            height: 400,
            width: "100%",
            "& .table-header": {
              backgroundColor: "#171717",
              color: "#ffffff",
              fontWeight: 600,
              fontSize: "16px",
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
              "& .MuiDataGrid-footerContainer": {
                borderTop: "2px solid #e2e8f0",
              },
            },
            "@media (max-width: 768px)": {
              height: 300,
              "& .MuiDataGrid-columnHeaderTitle": {
                fontSize: "12px",
              },
              "& .MuiDataGrid-cell": {
                fontSize: "12px",
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
  );
}
