import React, { useState, useEffect } from "react";
import axios from "axios";
import { Upload, Eye, Pencil, Trash2 } from "lucide-react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Snackbar,
  Alert,
  IconButton,
  Tooltip,
} from "@mui/material";
import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";

interface Documento {
  id: number;
  nombre: string;
  fechaSubida: string;
  tipo: string;
  tamaño: string;
  anio: string;
  expediente: string;
}

// Create an axios instance with default config
const api = axios.create({
  baseURL: "https://backend-lga.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add authentication interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

export const Subir_Documentos: React.FC = () => {
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel>([]);
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
      const response = await api.post(
        "/portada/portada/upload-alfresco-document/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401 && retries > 0) {
          return uploadWithRetry(formData, retries - 1);
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
            // Redirect to login or trigger auth refresh
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
    },
    {
      field: "fechaSubida",
      headerName: "Fecha de Subida",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "tipo",
      headerName: "Tipo",
      flex: 1,
      minWidth: 100,
    },
    {
      field: "tamaño",
      headerName: "Tamaño",
      flex: 1,
      minWidth: 100,
    },
    {
      field: "anio",
      headerName: "Año",
      flex: 1,
      minWidth: 100,
    },
    {
      field: "expediente",
      headerName: "Expediente",
      flex: 1,
      minWidth: 150,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
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

      <div className="bg-white rounded-lg shadow-sm">
        {/* Sección de acciones */}
        <div className="p-4 border-b flex justify-between items-center">
          <div className="flex gap-2">
            <Tooltip title="Ver detalles">
              <IconButton
                size="small"
                disabled={selectedRows.length !== 1 || isLoading}
              >
                <Eye className="h-5 w-5" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Editar">
              <IconButton
                size="small"
                disabled={selectedRows.length !== 1 || isLoading}
              >
                <Pencil className="h-5 w-5" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Eliminar">
              <IconButton
                size="small"
                disabled={selectedRows.length !== 1 || isLoading}
              >
                <Trash2 className="h-5 w-5" />
              </IconButton>
            </Tooltip>
          </div>

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
              color="primary"
            >
              {isLoading ? "Subiendo..." : "Subir Documento"}
            </Button>
          </div>
        </div>

        {/* DataGrid para mostrar documentos */}
        <div style={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={documentos}
            columns={columns}
            pageSizeOptions={[5, 10, 25]}
            checkboxSelection
            onRowSelectionModelChange={(newSelection) => {
              setSelectedRows(newSelection);
            }}
            rowSelectionModel={selectedRows}
          />
        </div>
      </div>
    </div>
  );
};
