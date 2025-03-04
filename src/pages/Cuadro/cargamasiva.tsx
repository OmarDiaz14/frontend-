import { useState, useEffect, useRef } from "react";
import DragDropImage from "../../assets/DragDrop.png";
import "../../styles/Styles.css";

// Define the event types to avoid implicit any
interface DragEvent extends React.DragEvent<HTMLDivElement> {
  dataTransfer: DataTransfer;
}

export default function Carga_Masiva() {
  // Fix type for divDrag ref
  const divDrag = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const dragCounter = useRef(0);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  // Event 1: Enter container
  const handleDragIn = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setDragging(true);
    }
  };

  // Event 2: Over container
  const handleDrag = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Event 3: Drop files in container
  const handleDrop = async (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
    dragCounter.current = 0;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      console.log("Archivo arrastrado:", file);

      // Check if it's an Excel file
      if (!file.name.match(/\.(xlsx|xls|csv)$/i)) {
        setUploadStatus({
          success: false,
          message: "Solo se permiten archivos Excel (.xlsx, .xls) o CSV",
        });
        return;
      }

      await uploadFile(file);
    }
  };

  // Upload file to API
  const uploadFile = async (file: File) => {
    setUploading(true);
    setUploadStatus(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        "https://backend-lga.onrender.com/cuadro/import_excel/upload/",
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();

      if (response.ok) {
        setUploadStatus({
          success: true,
          message: "Archivo cargado correctamente",
        });
      } else {
        setUploadStatus({
          success: false,
          message: result.detail || "Error al cargar el archivo",
        });
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadStatus({
        success: false,
        message: "Error de conexión al servidor",
      });
    } finally {
      setUploading(false);
    }
  };

  // Event 4: Leave container
  const handleDragOut = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setDragging(false);
    }
  };

  // Set up and clean up event listeners
  useEffect(() => {
    const div = divDrag.current;

    if (div) {
      div.addEventListener(
        "dragenter",
        handleDragIn as unknown as EventListener
      );
      div.addEventListener("dragover", handleDrag as unknown as EventListener);
      div.addEventListener(
        "dragleave",
        handleDragOut as unknown as EventListener
      );
      div.addEventListener("drop", handleDrop as unknown as EventListener);
    }

    return () => {
      if (div) {
        div.removeEventListener(
          "dragenter",
          handleDragIn as unknown as EventListener
        );
        div.removeEventListener(
          "dragover",
          handleDrag as unknown as EventListener
        );
        div.removeEventListener(
          "dragleave",
          handleDragOut as unknown as EventListener
        );
        div.removeEventListener("drop", handleDrop as unknown as EventListener);
      }
    };
  }, []);

  // Manual file input as an alternative to drag and drop
  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      // Check if it's an Excel file
      if (!file.name.match(/\.(xlsx|xls|csv)$/i)) {
        setUploadStatus({
          success: false,
          message: "Solo se permiten archivos Excel (.xlsx, .xls) o CSV",
        });
        return;
      }

      await uploadFile(file);
    }
  };

  return (
    <div style={{ paddingTop: "100px" }}>
      <div className="CargaMasiva">
        <div ref={divDrag} className={dragging ? "mainDD dragging" : "mainDD"}>
          {dragging ? (
            <div className="containerDragging" onDragOver={handleDrag}>
              <div className="divCenterDD">
                <img
                  src={DragDropImage}
                  width={50}
                  height={50}
                  alt="Agregar archivos"
                />
                <p>Suelte el archivo aquí</p>
              </div>
            </div>
          ) : (
            <div className="divCenterDD">
              <img
                src={DragDropImage}
                width={50}
                height={50}
                alt="Agregar archivos"
              />
              <p>Arrastre su documento Excel aquí</p>
              <p>ó</p>
              <input
                type="file"
                id="fileInput"
                accept=".xlsx,.xls,.csv"
                style={{ display: "none" }}
                onChange={handleFileInput}
              />
              <button
                onClick={() => document.getElementById("fileInput")?.click()}
                className="upload-btn"
              >
                Seleccionar archivo
              </button>
            </div>
          )}
        </div>

        {uploading && (
          <div className="status-message loading">
            <p>Cargando archivo...</p>
          </div>
        )}

        {uploadStatus && (
          <div
            className={`status-message ${
              uploadStatus.success ? "success" : "error"
            }`}
          >
            <p>{uploadStatus.message}</p>
          </div>
        )}
      </div>
    </div>
  );
}
