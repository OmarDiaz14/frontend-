export interface seccion{
  id_seccion: string;
  seccion: string;
  codigo_seccion: string;
  descripcion: string;
}

export interface serie {
    id_serie: string;
    serie: string;
    codigo_serie: string;
    descripcion: string;
    id_seccion: string;
}

export interface SubSerie{
    id_subserie: string;
    subserie: string;
    codigo_subserie: string;
    descripcion: string;
    id_serie: string;
  }