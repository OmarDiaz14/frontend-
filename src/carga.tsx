import React, {useState} from "react";
import axios from "axios";


export const PDFUpload: React.FC = () => {

    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e. target.files){
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file){
            alert("Selecciona un Archivo para poder cargar");
            return;
        }

        const formData = new FormData();
        formData.append('file',file);
    
        try{
            const response = await axios.post('http://127.0.0.1:8000/documento/documento/upload_pdf/',formData,{
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
             });
            
            console.log('Carga Completa:', response.data);
            alert("PDf cargado y procesado correctamente");
            
        } catch(error){
            console.error('Error al cargar el archivo', error);
            alert("Error al Cargar el PDF,");
        }
    };



    return (
       
        <div>
          <input type="file" accept="application/pdf" onChange={handleFileChange} />
          <button onClick={handleUpload}>Upload PDF</button>
        </div>
       
      );
};

export default PDFUpload;
