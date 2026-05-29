export interface Novedades {
    id:string;
    titulo: string;
    subtitulo: string;
    resumen: string;
    texto: string;
    boton_name: string;
    boton_url: string;
    boton_color: string;
    img: string;
    categoria: string;
    fecha: string;
    seo: string;
    mostrar: string;
} 

export interface usersNovedades {
    id:string;
    titulo: string;
    subtitulo: string;
    texto: string;
    link: string;
    mostrar:string;
} 

export interface Asociados {
    id?: string;
    nombre: string;
    apellido:string;
    celular:string;
    email?:any;
    dni:number;
    reprocann:string;
    codidoreprocann:string;
    fechareprocann:string;
    codigopostal:number;
    calle:string;
    numero:number;
    departamento?:string;
    provincia:string;
    localidad:string;
    fichareprocann:string;
    activo:string;
    categoriareprocann:string;
    habilitado:string;
    usuario:string;
    pass:string;
}
export interface Img {
    id?: string;
    base?:string;
    img:string;
    elementos:string;
}

export interface Carousel {
    id?:string;
    img:string;
    orden:number;
    mostrar: number;
    id_elemento:number;
}
export interface faq {
    id:string;
    pregunta: string;
    respuesta: string;
    mostrar:string;
} 

export interface Quienes {
    id?: string;
    texto:string;
    img:string;
    video:string;
}
