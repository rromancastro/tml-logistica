import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError,Observable,throwError} from 'rxjs';
import {debounceTime, distinctUntilChanged, map, startWith, tap } from 'rxjs/operators';
import { ApiResponse, Carousel, Img } from './interface';
//import { EmailAsociado } from '../servicios/email';
import { Location } from '@angular/common';


@Injectable({
  providedIn: 'root'
})
export class AdminService {
 
  public href: string = '';
  public protocol: string = '';
  public servidor:string= '';  
  public loading:boolean = false;
  public loader:boolean = false;
  
  constructor(
    private http: HttpClient,
    private location: Location,
    
  ) { 
      this.href = window.location.hostname;
      this.protocol = window.location.protocol;
    
      if(this.href==='localhost'){
        this.servidor = 'https://tmlogistica.com.ar/server/';
        console.log('localhost: ',this.servidor);
      }else{
        this.servidor = this.protocol+"//"+this.href+'/server/';
        console.log('online: ',this.servidor);
      }
    
  }
  private handleError(error: HttpErrorResponse) {
    
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
      //this.loading = false;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
     // this.loading = false;
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }
    // Return an observable with a user-facing error message.
    //this.loading = false;
    return throwError(() => new Error('Something bad happened; please try again later.'));
  } 

  traerColumnasTabla(tabla:string):Observable<any[]>{
    const url = this.servidor+'traer-columnas-de-tabla.php?tabla='+tabla;  // URL to web api
    return this.http.get<any[]>(url)
    .pipe(
      tap(data=>{
        //console.log(data);
      }),
      map(resp=>{
        return resp;
      }),
      debounceTime(1500),
      distinctUntilChanged(),
      startWith([]),
      catchError(this.handleError),
    );
  }


  traerIdDelUnaTabla(tabla:string,id:string,order:string,by:string):Observable<any[]>{
    //console.log(tabla,id);
    const url = this.servidor+'traer-tabla-por-id.php?tabla='+tabla+"&id="+id+"&order="+order+"&by="+by;  // URL to web api
    //console.log(url);
    return this.http.get<any[]>(url)
    .pipe(
      tap(data=>{
       //console.log(data);
      }),
      map(resp=>{
        return resp;
      }),
      debounceTime(500),
      distinctUntilChanged(),
      startWith([]),
      catchError(this.handleError),
    );
  }

  traerAlgoDeUnaTabla(tabla:string,columna:string,que:string,filtro:string,orden:string,limit:string):Observable<any[]>{
    //console.log(tabla,columna,que);
    const url = this.servidor+'traer-tabla.php?tabla='+tabla+"&columna="+columna+"&que="+que+"&filtro="+filtro+"&orden="+orden+"&limit="+limit;  // URL to web api
    return this.http.get<any[]>(url)
    .pipe(
      tap(data=>{
        //console.log(data);
      }),
      map(resp=>{
        return resp;
      }),
      debounceTime(500),
      distinctUntilChanged(),
      startWith([]),
      catchError(this.handleError),
    );
  }

  // Este endpoint devuelve una sola imagen, no una lista, asÃ­ que se elimina el startWith([]) que rompÃ­a la inferencia de tipos.
  /*
  traerImgPorID(id:string){
    const url = this.servidor+'traer-img-por-id.php?id='+id;  // URL to web api
    return this.http.get<Img>(url)
    .pipe(
      tap(data=>{
       //console.log(data);
      }),
      map(resp=>{
        return resp;
      }),
      debounceTime(500),
      distinctUntilChanged(),
      startWith([]),
      catchError(this.handleError),
    );
  }
  */
  traerImgPorID(id: string): Observable<Img> {
    const url = this.servidor + 'traer-img-por-id.php?id=' + id;  // URL to web api
    return this.http.get<Img>(url)
      .pipe(
        tap(data => {
          //console.log(data);
        }),
        map(resp => resp),
        debounceTime(500),
        distinctUntilChanged(),
        catchError(this.handleError),
      );
  }

  

  borrarPorId(tabla:string,id:string){
    const url = this.servidor+'borrar-por-id.php?tabla='+tabla+"&id="+id;  // URL to web api
    return this.http.get(url)
    .pipe(
      tap(data=>{
        //console.log(data);
      }),
      map(resp=>{
        return resp;
      }),
      debounceTime(500),
      distinctUntilChanged(),
      startWith([]),
      catchError(this.handleError),
    );
  }
  
  insertArray(tabla:string, data:Img[]  | any){
    //console.log(tabla, data);
    const url = this.servidor+'insert_array.php'; // URL to web api
    //console.log(url);
    const options = new HttpParams()
      .set('tabla', tabla)
      .set('datos',JSON.stringify(data))
    ;
    return this.http.post(url,options)
      .pipe(
        catchError(this.handleError)
      ).pipe(
        tap(
          val=>{
            this.loading = false;
            console.log(val);
            }
          )
      );
  }

  insertDia(tabla:string, data:Img[]  | any){
    //console.log(tabla, data);
    const url = this.servidor+'easylunch/insert_dia.php'; // URL to web api
    //console.log(url);
    const options = new HttpParams()
      .set('tabla', tabla)
      .set('datos',JSON.stringify(data))
    ;
    return this.http.post(url,options)
      .pipe(
        catchError(this.handleError)
      ).pipe(
        tap(
          val=>{
            this.loading = false;
            console.log(val);
            }
          )
      );
  }

  insertArrayUsuario(tabla:string, data:any):Observable<ApiResponse>{
    //console.log(tabla, data);
    const url = this.servidor+'insert_array_usuario.php'; // URL to web api
    const options = new HttpParams()
      .set('tabla', tabla)
      .set('datos',JSON.stringify(data))
    ;
    return this.http.post<ApiResponse>(url,options)
      .pipe(
        catchError(this.handleError)
      ).pipe(
        tap(
          val=>{
            this.loading = false;
            //console.log(val);
            }
          )
      );
  }

  edit(tabla:string, data:any, id:string, where:string){
    console.log(tabla,data,id,where);
    const url = this.servidor+'edit.php'; // URL to web api
    const options = new HttpParams()
      .set('tabla', tabla)
      .set('datos',JSON.stringify(data))
      .set('id', id)
      .set('where',where)
    ;
    return this.http.post(url,options)
      .pipe(
        catchError(this.handleError)
      ).pipe(
        tap(
          val=>{this.loading = false;}
          )
      );
  }
  
  editDia(tabla:string, data:any, id:string, where:string){
   // console.log(tabla,data,id,where);
    const url = this.servidor+'easylunch/edit_dia.php'; // URL to web api
    const options = new HttpParams()
      .set('tabla', tabla)
      .set('datos',JSON.stringify(data))
      .set('id',id)
      .set('where',where)
    ;
    return this.http.post(url,options)
      .pipe(
        catchError(this.handleError)
      ).pipe(
        tap(
          val=>{this.loading = false;}
          )
      );
  }

  editar(tabla:string, que:string,valor:string, id:string, where:string){
    
    const url = this.servidor+'editar.php'; // URL to web api
    const options = new HttpParams()
      .set('tabla', tabla)
      .set('que',que)
      .set('valor',valor)
      .set('id',id)
      .set('where',where)
    ;
    return this.http.post(url,options)
      .pipe(
        catchError(this.handleError)
      ).pipe(
        tap(
          val=>{this.loading = false;}
          )
      );
  }

  GuardarImg(tabla:string,idTabla:string,base:string){
    //console.log(tabla,idTabla,base);  
    tabla = tabla.trim();
    idTabla = idTabla.trim();
       
    const url = this.servidor+'guardar-editar-img.php';  // URL to web api
    
    const options = new HttpParams()
      .set('tabla', tabla)
      .set('id_tabla',idTabla)
      .set('base',btoa(base));
    ;
    //console.log(options);
    return this.http.post(url,options)
      .pipe(
        catchError(this.handleError)
      );
  }
  
  GuardarImgEnCarousel(idTabla:string,base:string){
     const url = this.servidor+'guardar-img-carousel.php';  // URL to web api
     const options = new HttpParams()
       .set('id_tabla',idTabla)
       .set('base',btoa(base));
     return this.http.post(url,options)
       .pipe(
         catchError(this.handleError)
       );
  }

  
 
  traerImgPorIdObs(id:any):Observable<Img[]>{
    const url = this.servidor+'traer-img-por-id.php?id='+id;  // URL to web api
    return this.http.get<Img[]>(url)
    .pipe(
      tap(data=>{
       // console.log(data);
      }),
      map(resp=>{
        return resp;
      }),
      debounceTime(500),
      distinctUntilChanged(),
      startWith([]),
      catchError(this.handleError),
    );
  }

  editarOrden(tabla:string,id:string,orden:string){
    //console.log(tabla, id, orden);
    const url = this.servidor+'cambiar-orden.php?tabla='+tabla+'&id='+id+'&orden='+orden;  // URL to web api
    return this.http.get<number>(url)
    .pipe(
      tap(
        val=>{this.loading = false;}
        )
    );
  }
 
    
  goBack() {
    this.location.back();
  }
 
  
  

  traerUnicos(tabla:string,columna:string){
    this.loader = true;
    const url = this.servidor+'traer-columna-unique.php?tabla='+tabla+'&columna='+columna;  // URL to web api
    return this.http.get<any[]>(url)
    .pipe(
      tap(data=>{
       //console.log(data);
      }),
      map(resp=>{
        return resp;
      }),
      debounceTime(500),
      distinctUntilChanged(),
      startWith([]),
      catchError(this.handleError),
    );
  }


  
  traerOpciones(id:string){
    this.loader = true;
    const url = this.servidor+'traer-opciones.php?id='+id;  // URL to web api
    return this.http.get<any[]>(url)
    .pipe(
      catchError(this.handleError),
      tap(()=>{this.loader = false;})
    );
  }
  
  traerOpcionesNombreOpcion(id:string){
    this.loader = true;
    const url = this.servidor+'traer-opciones-nombre-opcion.php?id='+id;  // URL to web api
    return this.http.get<any[]>(url)
    .pipe(
      catchError(this.handleError),
      tap(()=>{this.loader = false;})
    );
  }
  
  traerArticulosPorBusqueda(tabla:string,palabra:string){
    this.loader = true;
    const url = this.servidor+'traer-articulos-like-new.php?tabla='+tabla+'&palabra='+palabra;  // URL to web api
    return this.http.get<any[]>(url)
    .pipe(
      catchError(this.handleError),
      tap(()=>{this.loader = false;})
    );
  }

  traerArticulosPorBusquedaQue(tabla:string,que:string,palabra:string){
    this.loader = true;
    const url = this.servidor+'traer-articulos-like-que.php?tabla='+tabla+'&palabra='+palabra+'&que='+que;  // URL to web api
    return this.http.get<any>(url)
    .pipe(
      catchError(this.handleError),
      tap((data)=>{
        //console.log(data);
        this.loader = false;})
    );
  }


  traerArticulosPorBusquedaSinLike(tabla:string,que:string,palabra:string){
    this.loader = true;
    const url = this.servidor+'traer-articulos-like-que.php?tabla='+tabla+'&palabra='+palabra+'&que='+que;  // URL to web api
    return this.http.get<any>(url)
    .pipe(
      catchError(this.handleError),
      tap((data)=>{
        //console.log(data);
        this.loader = false;})
    );
  }

  busqueda(tabla:string, data:any,order:string,by:string):Observable<any[]>{
   // console.log(tabla, data);
    const url = this.servidor+'buscar-en-todas-las-columnas.php'; // URL to web api
    //console.log(url);
    const options = new HttpParams()
      .set('tabla', tabla)
      .set('data',JSON.stringify(data[0]))
      .set('order',order)
      .set('by',by)
    ;
    return this.http.post<any[]>(url,options)
    .pipe(
      tap(data=>{
        //this.options.next(data);
        console.log(data);
      }),
      map(resp=>{
        return resp;
      }),
      debounceTime(500),
      distinctUntilChanged(),
      startWith([]),
      catchError(this.handleError),
    );
  };

  busquedaPorTabla(tabla:string, data:any):Observable<any[]>{
    //console.log(tabla, data);
    const url = this.servidor+'buscar-por-tabla.php'; // URL to web api
    //console.log(url);
    const options = new HttpParams()
      .set('tabla', tabla)
      .set('data',JSON.stringify(data[0]))
    ;
    return this.http.post<any[]>(url,options)
    .pipe(
      tap(data=>{
        //this.options.next(data);
        //console.log(data);
      }),
      map(resp=>{
        return resp;
      }),
      debounceTime(500),
      distinctUntilChanged(),
      startWith([]),
      catchError(this.handleError),
    );
  };

  traerNovedadesSeo(seo:string):Observable<any[]>{
    const url = this.servidor+'traer-novedades-por-seo.php?seo='+seo;  // URL to web api
    return this.http.get<any[]>(url)
    .pipe(
      tap(data=>{
        //this.options.next(data);
        //console.log(data);
      }),
      map(resp=>{
        return resp;
      }),
      debounceTime(500),
      distinctUntilChanged(),
      startWith([]),
      catchError(this.handleError),
    );
  }

  buscarSuscriptores(tabla:string, email:string):Observable<number>{
    const url = this.servidor+'buscar-suscriptores.php';  // URL to web api
    const options = new HttpParams()
      .set('tabla', tabla)
      .set('email',email)
    ;
    return this.http.post<number>(url,options)
    .pipe(
      tap(data=>{
        //this.options.next(data);
       // console.log(data);
      }),
      map(resp=>{
        return resp;
      }),
      debounceTime(500),
      distinctUntilChanged(),
      catchError(this.handleError),
    );
  }

  blog_next(id:string):Observable<any>{
    //console.log(id);
    const url = this.servidor+'blog-next.php?id='+id; 
    return this.http.get<any>(url)
    .pipe(
      tap(data=>{
        //console.log(data);
      }),
      map(resp=>{
        return resp;
      }),
      debounceTime(500),
      distinctUntilChanged(),
      startWith([]),
      catchError(this.handleError),
    );
  }

  blog_prev(id:string):Observable<any>{
    //console.log(id);
    const url = this.servidor+'blog-prev.php?id='+id; 
    return this.http.get<any>(url)
    .pipe(
      tap(data=>{
        //console.log(data);
      }),
      map(resp=>{
        return resp;
      }),
      debounceTime(500),
      distinctUntilChanged(),
      startWith([]),
      catchError(this.handleError),
    );
  }

  traerBlog():Observable<any[]>{
    this.loader = true;
    const url = this.servidor+'traer-blog.php';  // URL to web api
    return this.http.get<any[]>(url)
    .pipe(
      tap(data=>{
      //console.log(data);
      }),
      map(resp=>{
        return resp;
      }),
      debounceTime(500),
      distinctUntilChanged(),
      startWith([]),
      catchError(this.handleError),
    );
  }

   
  traerAlgoPorURLGET(serverUrl:string, objeto:any){
    const url = this.servidor+serverUrl; 
    // Crear HttpParams a partir del objeto
    let params = new HttpParams();
    for (const key in objeto) {
        if (objeto.hasOwnProperty(key)) {
            params = params.append(key, objeto[key]);
        }
    }
    return this.http.get<any[]>(url, { params })
    .pipe(
        tap(data => {
            //console.log(data);
        }),
        map(resp => {
            return resp;
        }),
        debounceTime(500),
        distinctUntilChanged(),
        startWith([]),
        catchError(this.handleError),
    );
  }

 
  traerDatosParaFiltroConStringSeparadosPorColumnas(tabla:string,columna:string,orden:string){
    this.loader = true;
    const url = this.servidor+`traer-datos-unicos-de-columna.php?tabla=${tabla}&columna=${columna}&orden=${orden};`;  
    return this.http.get<any[]>(url)
    .pipe(
      catchError(this.handleError),
      tap(()=>{this.loader = false;})
    );
  }

  traerPlatosBebidasPostres(empresa:string):Observable<any>{
    //console.log(tabla, data);
    const url = this.servidor+'easylunch/traerPlatosBebidasPostres.php'; // URL to web api
    //console.log(url);
    const options = new HttpParams()
      .set('empresa', empresa)
    ;
    return this.http.post<any[]>(url,options)
    .pipe(
      tap(data=>{
        //this.options.next(data);
        //console.log(data);
      }),
      map(resp=>{
        return resp;
      }),
      debounceTime(500),
      distinctUntilChanged(),
      startWith([]),
      catchError(this.handleError),
    );
  };

  traer_pedidos_por_id(id_user:number, forma_de_cobro?:number):Observable<any[]>{
    //console.log('traer_pedidos_por_id - forma_de_cobro', forma_de_cobro );
    const url = this.servidor+'easylunch/traer_los_tres_pedidos_del_usuario.php'; // URL to web api
    //console.log(url);
    let options = new HttpParams()
      .set('id_user', id_user)
    ;
    // Conditionally add forma_de_cobro if it's provided
    if (forma_de_cobro !== undefined) {
      options = options.set('forma_de_cobro', forma_de_cobro); // Convert number to string
    }
    return this.http.post<any[]>(url,options)
    .pipe(
      tap(data=>{
        //console.log(data);
      }),
      map(resp=>{
        return resp;
      }),
      debounceTime(500),
      distinctUntilChanged(),
      startWith([]),
      catchError(this.handleError),
    );
  };

  traer_pedidos_por_id_de_hoy(id_user:number):Observable<any[]>{
    //console.log(tabla, data);
    const url = this.servidor+'easylunch/traer_los_tres_pedidos_de_hoy.php'; // URL to web api
    //console.log(url);
    const options = new HttpParams()
      .set('id_user', id_user)
    ;
    return this.http.post<any[]>(url,options)
    .pipe(
      tap(data=>{
        console.log(data);
      }),
      map(resp=>{
        return resp;
      }),
      debounceTime(500),
      distinctUntilChanged(),
      startWith([]),
      catchError(this.handleError),
    );
  };

  traer_pedidos_por_id_y_fecha(id_user:number,dia:string,mes:string,anio:string):Observable<any[]>{
    //console.log(tabla, data);
    const url = this.servidor+'easylunch/traer_pedidos_del_usuario_por_fecha.php'; // URL to web api
    //console.log(url);
    const options = new HttpParams()
      .set('id_user', id_user)
      .set('dia', dia)
      .set('mes', mes)
      .set('anio', anio)
    ;
    return this.http.post<any[]>(url,options)
    .pipe(
      tap(data=>{
        //console.log(data);
      }),
      map(resp=>{
        return resp;
      }),
      debounceTime(500),
      distinctUntilChanged(),
      startWith([]),
      catchError(this.handleError),
    );
  };

  traer_pagos_por_id(id_user:number):Observable<any[]>{
    //console.log(tabla, data);
    const url = this.servidor+'easylunch/traer_pagos_del_usuario.php'; // URL to web api
    //console.log(url);
    const options = new HttpParams()
      .set('id_user', id_user)
    ;
    return this.http.post<any[]>(url,options)
    .pipe(
      tap(data=>{
        //console.log(data);
      }),
      map(resp=>{
        return resp;
      }),
      debounceTime(500),
      distinctUntilChanged(),
      startWith([]),
      catchError(this.handleError),
    );
  };

  traerConfiguracionPagos(){
    this.loader = true;
    const url = this.servidor+'traerConfigPedidos.php';  
    return this.http.get<any[]>(url)
    .pipe(
      tap(data=>{
        console.log(data);
      }),
      map(resp=>{
        return resp;
      }),
      debounceTime(500),
      distinctUntilChanged(),
      startWith([]),
      catchError(this.handleError),
    );
  }
  traerCarouselElementos(id:string){
    const url = this.servidor+'traer-carousel-elementos.php?id='+id;  // URL to web api
    return this.http.get<Carousel[]>(url)
    .pipe(
      catchError(this.handleError)
    ).pipe(
      tap(
          val=>{this.loading = false;}
        )
    );
  }

  directorio(dir:string):Observable<any[]>{
    
    const url = this.servidor+'directories.php?dir='+dir;  // URL to web api
    return this.http.get<any[]>(url)
    .pipe(
      catchError(this.handleError),
      tap((data)=>{console.log(data);})
    );
  }

}
