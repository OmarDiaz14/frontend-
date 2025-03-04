import * as React from "react";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import axios from "axios";
import { user_profile } from "../../services/user.services";
import { Seccion_get } from "../../services/cuadro.service";

interface UserProfile {
  id: number | string;
  id_seccion: number | string;
}

interface SeccionData {
  id_seccion: number | string | null;
}

const CardsInstrumentos: React.FC = () => {
  const [selectedCard, setSelectedCard] = React.useState(0);
  const [data, setData] = useState({
    totalPortadas: null as number | null,
    totalFichas: null as number | null,
    totalCatalogos: null as number | null,
  });
  const [userInfo, setUserInfo] = useState<{
    userId: number | string | null;
    seccionId: number | string | null;
  }>({
    userId: null,
    seccionId: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUserAndSeccionData = async () => {
      try {
        const profile: UserProfile = await user_profile();

        if (profile && profile.id && profile.id_seccion) {
          setUserInfo({
            userId: profile.id,
            seccionId: profile.id_seccion,
          });
        } else {
          throw new Error("No se encontró perfil de usuario o sección");
        }
      } catch (error) {
        console.error("Error al obtener perfil de usuario:", error);
        setError(error instanceof Error ? error : new Error(String(error)));
        setIsLoading(false);
      }
    };

    fetchUserAndSeccionData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!userInfo.userId || !userInfo.seccionId) return;

      setIsLoading(true);
      try {
        const axiosInstance = axios.create({});

        const baseUrl = "https://backend-lga.onrender.com/dashboard/dashboard";

        const [portadaResponse, fichaResponse, catalogoResponse] =
          await Promise.all([
            axiosInstance.get(
              `${baseUrl}/${userInfo.seccionId}/get-total-portadas/`
            ),
            axiosInstance.get(
              `${baseUrl}/${userInfo.seccionId}/get-total-fichas/`
            ),
            axiosInstance.get(
              `${baseUrl}/${userInfo.seccionId}/get-total-catalogos/`
            ),
          ]);

        setData({
          totalPortadas: portadaResponse.data,
          totalFichas: fichaResponse.data,
          totalCatalogos: catalogoResponse.data,
        });
        setIsLoading(false);
      } catch (error) {
        console.error("Error al cargar los datos:", error);
        setError(error instanceof Error ? error : new Error(String(error)));
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userInfo.userId, userInfo.seccionId]);

  const cards = [
    {
      id: 1,
      title: "Total de Portadas",
      description: isLoading
        ? "Cargando..."
        : `Número de portadas: ${data.totalPortadas ?? 0}`,
      color: "#44ac44",
    },
    {
      id: 2,
      title: "Total de Fichas",
      description: isLoading
        ? "Cargando..."
        : `Número de fichas: ${data.totalFichas ?? 0}`,
      color: "#F1872D",
    },
    {
      id: 3,
      title: "Total de Catálogos",
      description: isLoading
        ? "Cargando..."
        : `Número de catálogos: ${data.totalCatalogos ?? 0}`,
      color: "#FFCA1A",
    },
    {
      id: 4,
      title: "Total de Expedientes",
      description: isLoading
        ? "Cargando..."
        : `Número de expedientes: ${data.totalPortadas ?? 0}`,
      color: "#446ca4",
    },
  ];

  if (error) {
    return (
      <Box sx={{ margin: "20px", color: "red" }}>
        Error al cargar los datos: {error.message}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: "98%",
        margin: "20px",
        padding: "10px",
      }}
    >
      <Box
        sx={{
          width: "100%",
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(auto-fill, minmax(150px, 1fr))",
            sm: "repeat(auto-fill, minmax(200px, 1fr))",
            md: "repeat(auto-fill, minmax(250px, 1fr))",
          },
          gap: 2,
        }}
      >
        {cards.map((card, index) => (
          <Card key={card.id}>
            <CardActionArea
              onClick={() => setSelectedCard(index)}
              data-active={selectedCard === index ? "" : undefined}
              sx={{
                height: "100%",
                backgroundColor: card.color,
                "&[data-active]": {
                  backgroundColor: "action.selected",
                  "&:hover": {
                    backgroundColor: "#f0f0f0",
                  },
                },
                "&:hover": {
                  backgroundColor: "#f0f0f0",
                },
              }}
            >
              <CardContent sx={{ height: "100%" }}>
                <Typography variant="h5" component="div">
                  {card.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {card.description}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default CardsInstrumentos;
