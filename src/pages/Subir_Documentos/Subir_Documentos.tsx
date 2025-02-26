import React, { useState } from "react";
import axios from "axios";
import { Upload } from "lucide-react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Snackbar,
  Alert,
  Box,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import api from "../../api_axios";

interface Documento {
  id: number;
  nombre: string;
  fechaSubida: string;
  tipo: string;
  tamaño: string;
  anio: string;
  expediente: string;
}

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

export const Subir_Documentos: React.FC = () => {
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [anio, setAnio] = useState<string>("");
  const [expediente, setExpediente] = useState<string>("");

  const uploadWithRetry = async (
    formData: FormData,
    retries = 3
  ): Promise<any> => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/login";
        throw new Error("No autenticado");
      }

      const response = await api.post(
        "/portada/portada/upload-alfresco-document/",
        formData
      );
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          throw new Error("Sesión expirada");
        }
        throw error;
      }
      throw error;
    }
  };

  const validateFile = (file: File): boolean => {
    const allowedTypes = ["pdf", "docx", "txt", "jpg", "png"];
    const maxSize = 10 * 1024 * 1024; // 10MB

    const fileExtension = file.name.split(".").pop()?.toLowerCase();

    if (!fileExtension || !allowedTypes.includes(fileExtension)) {
      setErrorMessage("Tipo de archivo no permitido");
      return false;
    }

    if (file.size > maxSize) {
      setErrorMessage("El archivo es demasiado grande (máximo 10MB)");
      return false;
    }

    return true;
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && validateFile(file)) {
      setSelectedFile(file);
      setUploadDialogOpen(true);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile || !anio || !expediente) {
      setErrorMessage("Por favor complete todos los campos requeridos");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("anio", anio);
      formData.append("expediente", expediente);

      const result = await uploadWithRetry(formData);

      const newDoc: Documento = {
        id: result.id || documentos.length + 1,
        nombre: selectedFile.name,
        fechaSubida: new Date().toISOString().split("T")[0],
        tipo: selectedFile.name.split(".").pop()?.toUpperCase() || "UNKNOWN",
        tamaño: `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB`,
        anio,
        expediente,
      };

      setDocumentos((prev) => [...prev, newDoc]);
      setUploadDialogOpen(false);
      setSelectedFile(null);
      setAnio("");
      setExpediente("");
    } catch (error: any) {
      console.error("Error al subir documento:", error);

      if (axios.isAxiosError(error)) {
        switch (error.response?.status) {
          case 401:
            setErrorMessage(
              "Sesión expirada. Por favor inicie sesión nuevamente."
            );
            break;
          case 413:
            setErrorMessage("El archivo es demasiado grande para el servidor.");
            break;
          case 415:
            setErrorMessage("Tipo de archivo no soportado por el servidor.");
            break;
          case 500:
            setErrorMessage(
              "Error interno del servidor. Por favor intente más tarde."
            );
            break;
          default:
            setErrorMessage(
              error.response?.data?.message || "Error al subir el documento."
            );
        }
      } else {
        setErrorMessage("Error inesperado. Por favor intente nuevamente.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const columns: GridColDef[] = [
    {
      field: "nombre",
      headerName: "Nombre del Documento",
      flex: 1,
      minWidth: 200,
      headerClassName: "table-header",
    },
    {
      field: "fechaSubida",
      headerName: "Fecha de Subida",
      flex: 1,
      minWidth: 150,
      headerClassName: "table-header",
    },
    {
      field: "tipo",
      headerName: "Tipo",
      flex: 1,
      minWidth: 100,
      headerClassName: "table-header",
    },
    {
      field: "tamaño",
      headerName: "Tamaño",
      flex: 1,
      minWidth: 100,
      headerClassName: "table-header",
    },
    {
      field: "anio",
      headerName: "Año",
      flex: 1,
      minWidth: 100,
      headerClassName: "table-header",
    },
    {
      field: "expediente",
      headerName: "Expediente",
      flex: 1,
      minWidth: 150,
      headerClassName: "table-header",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Sección de acciones */}
          <div className="p-4 border-b flex justify-end items-center bg-gray-50">
            {/* Botón de subida de archivo */}
            <div>
              <input
                type="file"
                id="fileUpload"
                className="hidden"
                onChange={handleFileSelect}
                accept=".pdf,.docx,.txt,.jpg,.png"
              />
              <Button
                variant="contained"
                startIcon={<Upload className="h-4 w-4" />}
                onClick={() => document.getElementById("fileUpload")?.click()}
                disabled={isLoading}
                sx={{
                  backgroundColor: "#004c96",
                  "&:hover": {
                    backgroundColor: "#003366",
                  },
                }}
              >
                {isLoading ? "Subiendo..." : "Subir Documento"}
              </Button>
            </div>
          </div>

          {/* DataGrid para mostrar documentos */}
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
              rows={documentos}
              columns={columns}
              pageSizeOptions={[5, 10, 25]}
              density="comfortable"
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 10 },
                },
              }}
              loading={isLoading}
            />
          </Box>
        </div>
      </main>

      {/* Diálogo de subida de archivo */}
      <Dialog
        open={uploadDialogOpen}
        onClose={() => setUploadDialogOpen(false)}
      >
        <DialogTitle>Subir Documento</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Año"
            fullWidth
            variant="outlined"
            value={anio}
            onChange={(e) => setAnio(e.target.value)}
            helperText="Ingrese el año del documento"
          />
          <TextField
            margin="dense"
            label="Expediente"
            fullWidth
            variant="outlined"
            value={expediente}
            onChange={(e) => setExpediente(e.target.value)}
            helperText="Ingrese el número de expediente"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUploadDialogOpen(false)} color="secondary">
            Cancelar
          </Button>
          <Button
            onClick={handleFileUpload}
            color="primary"
            disabled={isLoading}
          >
            {isLoading ? "Subiendo..." : "Subir"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para mensajes de error */}
      <Snackbar
        open={!!errorMessage}
        autoHideDuration={6000}
        onClose={() => setErrorMessage(null)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setErrorMessage(null)}
          severity="error"
          sx={{ width: "100%" }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};
