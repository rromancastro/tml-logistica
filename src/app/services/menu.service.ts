import { Injectable } from '@angular/core';

export interface Section {
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  public menu:{title: string, url: string,type:string,id:string,offset:number}[] = [];
  constructor() {}

  
  public folders: {seccion:string,menues:{titulo:string,url:string}[]}[] = [
    { 
      seccion:'Noticias',
      menues:[
        {titulo:"Listado", url:'noticias'},
        {titulo:"Nueva noticia", url:'noticias/nuevo'},
      ]
    }
  ];

}
