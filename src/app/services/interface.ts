
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
export interface ApiResponse {
    error?: string;
    message?: string;
    last_id?: string;
  }