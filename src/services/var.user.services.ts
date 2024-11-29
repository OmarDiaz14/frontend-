

export interface iUser{
    username: string; 
    password: string;
    first_name: string;
    last_name: string;
    email: string;
    cargo: string;
    unidad_admi : string;
    roles: string [];
    id_seccion: string;
}

export class User implements iUser{
    username: string = ""; 
    password: string = "";
    first_name: string = "";
    last_name: string = "";
    email: string = "";
    cargo: string = "";
    unidad_admi : string = "";
    roles: string [] = [];
    id_seccion: string = "";
}