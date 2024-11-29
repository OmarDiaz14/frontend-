export interface iInventario {
    serie: string;
    descripsion: string;
    observaciones: string;
    estatus: string;
    expediente: string;
}

export class Inventario implements iInventario{
    serie: string = "";
    descripsion: string = "";
    observaciones: string = "";
    estatus: string = "";
    expediente: string = "";
}