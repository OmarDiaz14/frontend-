import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { serie_get, subserie_get } from "../../services/cuadro.service";
import { SubSerie, serie } from "../../services/var.cuadro";
import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import Swal from "sweetalert2";

export function TableSubserie() {
   
const [Subserie, setSubserie] = useState<SubSerie[]>([]);
const [filteredSubserie, setFilteredSubserie] = useState<SubSerie[]>([]);
const [isLoading, setIsLoading] = useState<boolean>(false);
const [series, setSeries] = useState<serie[]>([]);

const fetchSeccion = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const seriesData: serie[] = await serie_get();
      setSeries(seriesData);
      const subseriesData: SubSerie[] = await subserie_get();
      const mappedSubseries = subseriesData.map((Subserie) => {
        const serie = seriesData.find(
          (Serie) => Serie.id_serie === Subserie.id_serie
        )?.serie;
        return {
          ...Subserie,
          id_serie: serie || "Sin serie",
        }
      });

      setSubserie(mappedSubseries);

    } catch (error) {
      console.error("Error fetching inventory", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron cargar los datos de subserie",
      });
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    fetchSeccion();
  }, []);

  // const fetchSeccion = async () => {
  //   setIsLoading(true);
  //   try {
  //     const items = await subserie_get();
  //     setSubserie(items);
  //     setFilteredSubserie(items);
  //   } catch (error) {
  //     console.error("Error fetching inventory", error);
  //     Swal.fire({
  //       icon: "error",
  //       title: "Error",
  //       text: "No se pudieron cargar los datos de seccion",
  //     });
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  // useEffect(() => {
  //   fetchSeccion();
  // }, []);

  const rowsWithIds = Subserie.map((row, index) => ({
    ...row,
    id: index,
  }));

  const handleFilterChange = (filteredData: SubSerie[]) => {
    setFilteredSubserie(filteredData);
  };

  const columns: GridColDef[] = [
    {
      field: "codigo_subserie",
      headerName: "Código de la Sub-serie",
      flex: 1,
      minWidth: 150,
      headerClassName: "table-header",
    },
    {
      field: "subserie",
      headerName: "Nombre de la subserie",
      flex: 1,
      minWidth: 150,
      headerClassName: "table-header",
    },
    {
      field: "id_serie",
      headerName: "Serie Asociada ",
      flex: 1,
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
