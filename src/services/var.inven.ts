export interface iInventario {
    num_consecutivo: string;
    serie: string;
    descripsion: string;
    observaciones: string;
    expediente: string;
}

export class Inventario implements iInventario{
    num_consecutivo: string = "";
    serie: string = "";
    descripsion: string = "";
    observaciones: string = "";
    expediente: string = "";
}

export interface iInventarioFormAuth {
    serie: string;
    expediente: string;
  }

export class InventarioFormAuth implements iInventarioFormAuth {
    serie: string = "";
    expediente: string = "";
  }
