import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Slider from "@mui/material/Slider";
import { BarChart } from "@mui/x-charts/BarChart";
import axios from "axios";
import { user_profile } from "../../services/user.services";

interface ResizableChartProps {
  width?: number | string;
  height?: number | string;
  marginTop?: number;
  marginBottom?: number;
  marginLeft?: string;
  marginRight?: string;
}

const ResizableChart: React.FC<ResizableChartProps> = ({
  width = "100%",
  height = 400,
  marginTop = 0,
  marginBottom = 0,
  marginLeft = "auto",
  marginRight = "auto",
}) => {
  const [seriesNb, setSeriesNb] = React.useState(4);
  const [chartData, setChartData] = React.useState<{
    totalPortadas: number;
    totalFichas: number;
    totalCatalogos: number;
    totalExpedientes: number;
  }>({
    totalPortadas: 0,
    totalFichas: 0,
    totalCatalogos: 0,
    totalExpedientes: 0,
  });
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);
  const [yAxisMax, setYAxisMax] = React.useState(10); // Cambié el valor inicial a 10

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const profile = await user_profile();

        if (profile && profile.id_seccion) {
          const baseUrl =
            "https://backend-lga.onrender.com/dashboard/dashboard";
          const axiosInstance = axios.create({});

          const [
            portadaResponse,
            fichaResponse,
            catalogoResponse,
            expedienteResponse,
          ] = await Promise.all([
            axiosInstance.get(
              `${baseUrl}/${profile.id_seccion}/get-total-portadas/`
            ),
            axiosInstance.get(
              `${baseUrl}/${profile.id_seccion}/get-total-fichas/`
            ),
            axiosInstance.get(
              `${baseUrl}/${profile.id_seccion}/get-total-catalogos/`
            ),
            axiosInstance.get(
              `${baseUrl}/${profile.id_seccion}/get-total-portadas/`
            ),
          ]);

          const newChartData = {
            totalPortadas: portadaResponse.data || 0,
            totalFichas: fichaResponse.data || 0,
            totalCatalogos: catalogoResponse.data || 0,
            totalExpedientes: expedienteResponse.data || 0,
          };

          setChartData(newChartData);

          // Calcular el máximo considerando valores mínimos
          const maxValue = Math.max(
            10, // Valor mínimo para mostrar
            newChartData.totalPortadas,
            newChartData.totalFichas,
            newChartData.totalCatalogos,
            newChartData.totalExpedientes
          );

          // Ajustar el eje Y para mostrar datos pequeños
          const roundedMax = Math.max(10, Math.ceil(maxValue / 10) * 10);
          setYAxisMax(roundedMax);

          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error al cargar los datos:", error);
        setError(error instanceof Error ? error : new Error(String(error)));
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSeriesNbChange = (event: Event, newValue: number | number[]) => {
    if (typeof newValue !== "number") {
      return;
    }
    setSeriesNb(newValue);
  };

  const series = [
    {
      label: "Total de Portadas",
      color: "#44ac44",
      data: [chartData.totalPortadas],
    },
    {
      label: "Total de Fichas",
      color: "#F1872D",
      data: [chartData.totalFichas],
    },
    {
      label: "Total de Catálogos",
      color: "#FFCA1A",
      data: [chartData.totalCatalogos],
    },
    {
      label: "Total de Expedientes",
      color: "#446ca4",
      data: [chartData.totalExpedientes],
    },
  ];

  if (isLoading) {
    return <Box>Cargando...</Box>;
  }

  if (error) {
    return <Box color="error">Error: {error.message}</Box>;
  }

  return (
    <Box
      sx={{
        width,
        height,
        marginTop,
        marginBottom,
        marginLeft,
        marginRight,
        border: "1px solid #ccc",
        padding: 2,
        maxWidth: "100%",
      }}
    >
      <BarChart
        height={200}
        series={series.slice(0, seriesNb)}
        yAxis={[
          {
            max: yAxisMax,
            tickMinStep: 1, // Mostrar incluso incrementos pequeños
            tickNumber: 5, // Controlar número de marcas
          },
        ]}
        skipAnimation={false}
      />
      <Typography id="input-series-number" gutterBottom>
        Instrumentos Archivísticos
      </Typography>
      <Slider
        value={seriesNb}
        onChange={handleSeriesNbChange}
        valueLabelDisplay="auto"
        min={1}
        max={4}
        aria-labelledby="input-series-number"
      />
    </Box>
  );
};

export default ResizableChart;
