

export interface iUser{
    username: string; 
    password: string;
    first_name: string;
    last_name: string;
    email: string;
    cargo: string;
    unidad_admi : string;
    nombre_unidad: string;
    roles: number [];
    id_seccion: string;
    name_seccion: string;
}

export class User implements iUser{
    username: string = ""; 
    password: string = "";
    first_name: string = "";
    last_name: string = "";
    email: string = "";
    cargo: string = "";
    unidad_admi : string = "";
    nombre_unidad: string = "";
    roles: number [] = [];
    id_seccion: string = "";
    name_seccion: string = "";
}