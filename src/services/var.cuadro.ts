export interface seccion{
  id_seccion: number;
  seccion: string;
  codigo_seccion: string;
  descripcion: string;
}

export interface serie {
    id_serie: number;
    serie: string;
    codigo_serie: string;
    descripcion: string;
    id_seccion: string | number;
}

export interface SubSerie{
    id_subserie: number;
    subserie: string;
    codigo_subserie: string;
    descripcion: string;
    id_serie: string |number;
  }