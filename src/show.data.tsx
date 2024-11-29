import React, {useEffect, useState} from "react";
import axios from "axios";

interface Documento{
    id: number;
    seccion: string;
    codigo: string;
    serie_documental: string;
    contenido: string;

}


export const  DocumentoList: React.FC =() => {
    const [documents, setDocuments] =useState<Documento[]>([]);


    useEffect(()=> {
        const fetchDocuments = async () =>{
            try{
                const response = await axios.get('http://127.0.0.1:8000/documento/documento/');
                setDocuments(response.data);
            }
            catch(error){
                console.error('Error fetching documents:', error);
            }
        };

        fetchDocuments();
    }, []);

    
    return(
        <div>
            <h1>Documento litado</h1>
            <ul>
                {documents.map((doc)=>(
                    <li key={doc.id}>
                        <strong>Seccion:</strong> {doc.seccion} <br/>
                        <strong>Codigo:</strong> {doc.codigo} <br/>
                        <strong>Serie:</strong> {doc.serie_documental} <br/>
                        <strong>Contenid</strong> {doc.contenido} <br/>
                        <hr />
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default DocumentoList;