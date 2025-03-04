export interface catalogo {
    id_catalogo : string;
    catalogo: string;
    archivo_tramite :string;
    archivo_concentracion: string;
    destino_expe: string;
    type_access: string;
    valores_documentales: string;
    observaciones:string;
    seccion : number;
    serie : number;
    subserie: number;
}


export interface destino {
    id_destino: string;
    destino: string;
}

export interface type{
    id_type: string;
    type: string;
}

export interface valor{
     id_valores: string;
     valores: string;
}