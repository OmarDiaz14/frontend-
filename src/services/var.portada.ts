export interface iPortada {
    id_expediente: string;
    num_expediente: string;
    asunto: string;
    num_legajos: string;
    num_fojas: string;
    valores_secundarios: string;
    fecha_apertura: string;
    fecha_cierre: string;
    seccion: number;
    serie: number;
    subserie: number | null;
}

export class Portada implements iPortada {
    id_expediente: string = "";
    num_expediente: string = "";
    asunto: string = "";
    num_legajos: string= "";
    num_fojas: string= "";
    valores_secundarios: string = "";
    fecha_apertura: string = "";
    fecha_cierre: string = "";
    seccion: number = 0;
    serie: number = 0;
    subserie: number | null = null;
}
